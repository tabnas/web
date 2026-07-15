// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://tabnas.dev",
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
