import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const docs = defineCollection({
	// Markdown docs under src/content/docs/, grouped by `section`.
	loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Sidebar grouping + ordering.
		section: z.enum(["Start", "Guides", "Concepts", "Reference"]),
		order: z.number().default(100),
	}),
});

export const collections = { blog, docs };
