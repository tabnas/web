// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import cloudflare from "@astrojs/cloudflare";
import { lastmodFor, historyReport } from "./tools/lastmod.mjs";

// Say which it is, once, rather than letting a lastmod-free sitemap ship
// unnoticed — the hosted build's clone depth is not set from this repo.
console.log(`  sitemap lastmod: ${historyReport()}`);

// https://astro.build/config
export default defineConfig({
	site: "https://tabnas.dev",
	// Fully static. The site was previously output:"server" so an
	// under-construction Basic-Auth middleware could run per request; that
	// gate is gone, and nothing else here needs a server at request time.
	output: "static",
	// Canonical URLs, the sitemap and every internal link all use the
	// trailing-slash form. They have to agree: `build.format: "directory"`
	// writes dist/docs/quickstart/index.html, Cloudflare's asset server
	// serves that at /docs/quickstart/ and answers /docs/quickstart with a
	// 307 to it. Every internal link on the site used to be the no-slash
	// form, so every link a crawler followed was a redirect — 3,861 of them,
	// none of them permanent, so nothing consolidated onto the canonical
	// URL. "always" makes `astro dev` and `astro build` reject the no-slash
	// form instead of quietly rewriting it, and test/artifacts.test.mjs
	// checks the built HTML so a new link cannot reintroduce the hop.
	trailingSlash: "always",
	integrations: [
		mdx(),
		// <lastmod> per page, from the last commit that touched the file the
		// page renders from — see tools/lastmod.mjs for why it is not the build
		// time. A page whose source cannot be identified is emitted without
		// one, which the schema allows; changefreq and priority are left out
		// entirely, because Google ignores both.
		sitemap({
			serialize(item) {
				const lastmod = lastmodFor(new URL(item.url).pathname);
				return lastmod ? { ...item, lastmod } : item;
			},
		}),
	],
	// Every heading in markdown/MDX gets an id and a linkable anchor. The
	// same markup is produced by hand in .astro pages (see Heading.astro) so
	// the two look and behave identically; styles live in global.css.
	markdown: {
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: {
						class: "heading-anchor",
						ariaHidden: "true",
						tabIndex: -1,
						// Keep the literal '#' out of the Pagefind index. Without
						// this every result title reads "Attaching actions#" and
						// the '#' turns up mid-excerpt wherever a heading was.
						"data-pagefind-ignore": "",
					},
					content: { type: "text", value: "#" },
				},
			],
		],
	},
	adapter: cloudflare({
		// Optimise imported raster images with sharp at build time
		// (Cloudflare Workers can't run sharp at runtime; the site is static).
		imageService: "compile",
		platformProxy: {
			enabled: true,
		},
	}),
});
