// /errors/<code>.json — one error code, machine-readable.
//
// The .json twin of /errors/<code>, so the URL an agent is told to follow
// when it sees a diagnostic ("look it up at tabnas.dev/errors/<code>")
// resolves to data as well as to a page. A code that is not declared anywhere
// has no page and no JSON: the Worker answers those with the site's error
// object, which names /errors.json as the full list.

import type { APIRoute, GetStaticPaths } from "astro";
import { errorRegistry, type ErrorEntry } from "../../errors";
import { SITE_URL } from "../../openapi";

export const getStaticPaths: GetStaticPaths = () =>
  errorRegistry().codes.map((entry) => ({ params: { code: entry.code }, props: { entry } }));

export const GET: APIRoute = ({ props }) =>
  new Response(
    JSON.stringify(
      {
        $comment: `The tabnas error code registry entry. The full list is at ${SITE_URL}/errors.json.`,
        site: SITE_URL,
        ...(props as { entry: ErrorEntry }).entry,
      },
      null,
      2,
    ) + "\n",
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=3600",
        "access-control-allow-origin": "*",
      },
    },
  );
