import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

// Raw-markdown endpoint for blog posts (agent-consumable): /blog/<slug>.md
// returns the post's source markdown with frontmatter title/description.
export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  const entry = slug ? await getEntry("blog", slug) : undefined;
  if (!entry) {
    return new Response("Not found\n", { status: 404, headers: { "content-type": "text/plain" } });
  }
  const body = `# ${entry.data.title}\n\n> ${entry.data.description}\n\n${entry.body ?? ""}`;
  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
