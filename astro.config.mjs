// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://tabnas.dev",
	// On-demand rendering so the under-construction Basic-Auth middleware
	// (src/middleware.ts) runs per request. Individual pages can still opt
	// into prerendering; revert to output:"static" when the gate is removed.
	output: "server",
	integrations: [mdx(), sitemap()],
	adapter: cloudflare({
		// Optimise imported raster images with sharp at build time
		// (Cloudflare Workers can't run sharp at runtime; the site is static).
		imageService: "compile",
		platformProxy: {
			enabled: true,
		},
	}),
});
