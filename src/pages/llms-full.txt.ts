// /llms-full.txt — the full documentation text in one file, GENERATED.
//
// llmstxt.org's companion to llms.txt: everything, so a model can read the
// documentation without following links. It used to be a hand-maintained
// digest in public/, which drifts the moment a doc page changes — the point
// of this file is that it says the same thing the pages say, and only
// generation makes that true.
//
// The bodies are the collections' own markdown, in the order the site
// navigates them.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, HOWTO_GROUPS } from "../consts";
import pkg from "../../package.json";

const SECTIONS = ["Start", "Tutorials", "How-to", "Reference", "Explanation"] as const;

// MDX pages import components and render them as JSX. Those lines are build
// machinery, not documentation, so they are dropped — a model reading this
// file should see prose and code, not `import CodeTabs from ...`.
function stripMdx(body: string): string {
  return body
    .replace(/^import\s+.*?from\s+["'].*?["'];?\s*$/gm, "")
    .replace(/^\s*<\/?(CodeTabs|Card|CardGrid|Figure|Aside)[^>]*>\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export const GET: APIRoute = async () => {
  const engine = (pkg.dependencies as Record<string, string>)["@tabnas/parser"];

  const docs = (await getCollection("docs")).sort(
    (a, b) =>
      SECTIONS.indexOf(a.data.section) - SECTIONS.indexOf(b.data.section) ||
      a.data.order - b.data.order,
  );

  const order = HOWTO_GROUPS.map((g) => g.name);
  const howto = (await getCollection("howto")).sort(
    (a, b) =>
      order.indexOf(a.data.group) - order.indexOf(b.data.group) ||
      a.data.order - b.data.order,
  );

  const part = (entry: { id: string; data: { title: string; description: string }; body?: string }, base: string) =>
    [
      `# ${entry.data.title}`,
      ``,
      `Source: https://tabnas.dev${base}/${entry.id}`,
      `${entry.data.description}`,
      ``,
      stripMdx(entry.body ?? ""),
    ].join("\n");

  const body = [
    `# tabnas — full documentation`,
    ``,
    `> ${SITE_DESCRIPTION.replace(/\s+/g, " ").trim()}`,
    ``,
    `Describes @tabnas/parser ${engine}. Exact package pins: https://tabnas.dev/versions.json`,
    `Index: https://tabnas.dev/llms.txt · Error codes: https://tabnas.dev/errors`,
    ``,
    `${docs.length} documentation pages and ${howto.length} how-to guides follow, in site order.`,
    ``,
    `---`,
    ``,
    docs.map((d) => part(d, "/docs")).join("\n\n---\n\n"),
    ``,
    `---`,
    ``,
    howto.map((h) => part(h, "/how-to")).join("\n\n---\n\n"),
    ``,
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
