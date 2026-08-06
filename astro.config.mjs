// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://tabnas.dev",
	// Fully static. The site was previously output:"server" so an
	// under-construction Basic-Auth middleware could run per request; that
	// gate is gone, and nothing else here needs a server at request time.
	output: "static",
	integrations: [mdx(), sitemap()],
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
