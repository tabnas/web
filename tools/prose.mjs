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

// Vale has no comment syntax in a vocabulary file: it reads a `#` line
// as a pattern, and a lone `#` bans the character. Skipping them here
// would leave the two halves banning different things, so a list that
// carries one is refused rather than filtered.
export function rules(source) {
  const lines = source.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const comments = lines.filter((s) => s.startsWith("#"));
  if (comments.length) {
    throw new Error(`The prose vocabulary has comment lines, and Vale reads them as patterns: ${comments.join(" / ")}`);
  }
  return lines.map((source) => ({ source, re: new RegExp(`\\b(?:${source})\\b`, "gi") }));
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

// Page kinds, as lists rather than a path pattern. A rule about register
// has to know which page it is on, and a regex over paths reads as an
// accident where a list reads as a decision.
//
// TUTORIALS walk the reader through building something, which is where
// STYLE-GUIDE.md allows "we". PROJECT_VOICE is where the subject IS the
// project, so it speaks as itself: "the code runs on your machine rather
// than ours", "no cookies set by us". Everywhere else, both are refused.
export const TUTORIALS = [
  "docs/quickstart/",
  "docs/first-grammar/",
  "docs/grammar-with-plugins/",
];
export const PROJECT_VOICE = ["about/", "privacy/"];

// The third form of the reader's question, where a block states the
// problem and then asks: "My action never fires. Why?". That is how the
// FAQ terms read, and splitting one by sentence loses it. It is allowed
// on this page alone, because a block that merely ends in a question is
// otherwise an exemption for everything above it.
export const QUESTIONS = ["faq/"];

// `I` is a pronoun only capitalised, because a lone lowercase `i` is
// the one in `i.e.` or an index. The rest are pronouns however they
// fall, the start of a sentence or a heading included.
const SINGULAR_I = /\b(I|I'\w+)\b/;
const SINGULAR_MY = /\b(me|my|mine)\b/i;
const PLURAL = /\b(we|we'\w+|us|our|ours)\b/i;

// Emoji, not "symbol in this block". A bare warning sign or arrow is
// text presentation, and a keycap or a flag sits in no symbol block.
const EMOJI = /\p{Emoji_Presentation}|\uFE0F|\u20E3|[\u{1F1E6}-\u{1F1FF}]/u;

// Every mark except the two that are not punctuation: the `!=` of an
// operator and the `!` that opens an image. Requiring a word character
// before the mark, as this did, missed `Really?!`, `Great!!`, `Voilà!`
// and a mark closing a bold run.
const EXCLAMATION = /!(?![=[])/g;

// A question in the reader's voice is this site's device, and it is
// written three ways: as a question sentence ("does this string match
// my grammar?"), as a block on the FAQ that ends in one after setting
// it up ("My action never fires. Why?"), or quoted inside a sentence of
// its own ("How do I parse this", "my rule never fires"). All three are
// the reader talking. Anything else in the first person singular is a
// page that slipped out of second person.
function sentences(text) {
  return text.split(/(?<=[.?!])\s+/).filter(Boolean);
}


// Straight and typographic pairs both appear on the site.
function unquoted(text) {
  return text.replace(/["\u201c\u2018][^"\u201c\u201d\u2018\u2019]*["\u201d\u2019]/g, " ");
}


export function register(blocks, rel) {
  const hits = [];
  const tutorial = TUTORIALS.some((p) => rel.startsWith(p));
  const projectVoice = PROJECT_VOICE.some((p) => rel.startsWith(p));
  const questions = QUESTIONS.some((p) => rel.startsWith(p));
  let marks = 0;
  for (const text of blocks) {
    marks += (text.match(EXCLAMATION) || []).length;
    if (EMOJI.test(text)) {
      hits.push(`emoji: ${text}`);
    }
    const asks = questions && text.trimEnd().endsWith("?");
    for (const sentence of sentences(text)) {
      // `I/O` is not a pronoun. A slash is a word boundary.
      const bare = unquoted(sentence).replace(/\bI\/O\b/g, "");
      if ((SINGULAR_I.test(bare) || SINGULAR_MY.test(bare)) &&
        !asks && !sentence.trimEnd().endsWith("?")) {
        hits.push(`first person singular outside a question: ${sentence}`);
      }
    }
    if (PLURAL.test(text) && !tutorial && !projectVoice) {
      hits.push(`"we" outside a tutorial: ${text}`);
    }
  }
  // STYLE-GUIDE.md rations exclamation marks; one page, one mark.
  if (1 < marks) {
    hits.push(`${marks} exclamation marks on one page`);
  }
  return hits;
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
    hits.push(...register(content.blocks, rel).map((hit) => `${rel}: ${hit}`));
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
