// Prose is read from the build so Astro expressions, imported pages, shared
// labels, and metadata are checked as readers receive them. Code is excluded.
import { readFileSync, readdirSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { parseHTML } from "linkedom";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = join(ROOT, "dist");
const OUT = join(ROOT, ".prose");
const VOCAB = join(ROOT, ".vale/styles/config/vocabularies/Tabnas/reject.txt");

export function rules(source) {
  return source.split(/\r?\n/).map((s) => s.trim())
    .filter((s) => s && !s.startsWith("#"))
    .map((source) => ({ source, re: new RegExp(`\\b(?:${source})\\b`, "gi") }));
}

export function extract(html) {
  const { document } = parseHTML(html);
  // These are literal output or non-prose, including generated figure labels.
  for (const el of document.querySelectorAll("script, style, noscript, template, pre, svg, textarea, .heading-anchor, [aria-hidden='true']")) el.remove();
  const identifiers = [...new Set([...document.querySelectorAll("code")]
    .map((el) => el.textContent.trim())
    .filter((s) => /^[A-Za-z_$][\w$:.\[\]~-]*$/.test(s)))];
  const metadata = [];
  for (const el of document.querySelectorAll("title, meta[name='description'], meta[property='og:title'], meta[property='og:description'], meta[name='twitter:description']")) {
    const value = el.getAttribute("content") ?? el.textContent;
    if (value && !metadata.includes(value)) metadata.push(value);
  }
  for (const value of metadata) {
    const p = document.createElement("p");
    for (const token of value.split(/(\s+)/)) {
      const bare = identifiers.includes(token) ? token : token.replace(/[.,;:]$/, "");
      if (identifiers.includes(bare)) {
        const code = document.createElement("code"); code.textContent = bare;
        p.append(code, token.slice(bare.length));
      } else p.append(token);
    }
    document.body.prepend(p);
  }
  for (const el of document.querySelectorAll("[alt], [aria-label]")) {
    const p = document.createElement("p");
    p.textContent = el.getAttribute("alt") || el.getAttribute("aria-label") || "";
    if (p.textContent) document.body.append(p);
  }
  // Public explanations must stand alone without internal planning records.
  // Check before stripping inline code, which can contain a file name.
  const internal = /\b(?:BUGS\.m[gd]|REVIEW\.md|DIVERGENCE\.md)\b|docs\/(?:design|capability-review)\//i;
  const references = [...document.body.querySelectorAll("a")]
    .map((el) => el.getAttribute("href") || "");
  const internalReferences = [document.body.textContent, ...references]
    .filter((text) => internal.test(text)).map((text) => text.match(internal)[0]);
  const body = document.body.innerHTML;
  // Vale gets inline <code> intact. The Node rules skip the same literals.
  for (const el of document.querySelectorAll("code, tt")) el.textContent = " ";
  const selector = "p,h1,h2,h3,h4,h5,h6,li,dt,dd,figcaption,summary,td,th,button,label,option";
  const blocks = [...document.body.querySelectorAll(selector)]
    .map((el) => {
      const own = el.cloneNode(true);
      for (const nested of own.querySelectorAll(selector)) nested.remove();
      return own.textContent.replace(/\s+/g, " ").trim();
    })
    .filter(Boolean);
  // Navigation can contain direct links with no paragraph or list wrapper.
  for (const el of document.body.querySelectorAll("a")) {
    if (!el.closest(selector)) {
      const text = el.textContent.replace(/\s+/g, " ").trim();
      if (text) blocks.push(text);
    }
  }
  return { html: `<!doctype html><html><body>${body}</body></html>\n`, blocks, internalReferences };
}

export function findings(blocks, banned) {
  const hits = [];
  for (const text of blocks) {
    if (text.includes("—")) hits.push(`em dash: ${text}`);
    for (const { source, re } of banned) {
      re.lastIndex = 0;
      if (re.test(text)) hits.push(`${source}: ${text}`);
    }
  }
  return hits;
}

function pages(dir) {
  if (!existsSync(dir)) throw new Error("No website build. Run npm run build first.");
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? pages(path) : entry.name.endsWith(".html") ? [path] : [];
  });
}

export function prepare() {
  const files = pages(DIST);
  if (!files.includes(join(DIST, "index.html")) || files.length < 2) {
    throw new Error("Website build has no complete page set; run npm run build.");
  }
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  const banned = rules(readFileSync(VOCAB, "utf8"));
  if (!banned.length) throw new Error("The prose vocabulary is empty.");
  const hits = [];
  const outputs = [];
  for (const file of files) {
    const rel = relative(DIST, file);
    const content = extract(readFileSync(file, "utf8"));
    if (!content.blocks.length) throw new Error(`No prose extracted from ${rel}`);
    hits.push(...content.internalReferences.map((ref) => `${rel}: internal reference: ${ref}`));
    hits.push(...findings(content.blocks, banned).map((hit) => `${rel}: ${hit}`));
    const target = join(OUT, rel);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content.html); outputs.push(target);
  }
  console.log(`prose: checked ${files.length} rendered pages, including metadata and shared labels`);
  return { hits, outputs };
}

function main() {
  const { hits, outputs } = prepare();
  if (hits.length) console.error(hits.join("\n"));
  if (process.argv.includes("--vale")) {
    const result = spawnSync(process.env.VALE ?? "vale", [
      "--config", join(ROOT, ".vale.ini"), "--minAlertLevel=error",
      ...outputs, join(ROOT, "README.md"),
    ], { cwd: ROOT, stdio: "inherit" });
    if (result.error) throw new Error(`Cannot run Vale: ${result.error.message}. Install Vale 3.9.1 and run vale sync.`);
    if (result.status) process.exitCode = 1;
  }
  if (hits.length) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
