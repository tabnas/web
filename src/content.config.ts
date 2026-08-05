import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const docs = defineCollection({
	// Markdown docs under src/content/docs/, grouped by `section`.
	loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Sidebar grouping + ordering.
		// Diátaxis: learning / task / information / understanding oriented.
		section: z.enum(["Start", "Tutorials", "How-to", "Reference", "Explanation"]),
		order: z.number().default(100),
	}),
});

export const collections = { docs };
