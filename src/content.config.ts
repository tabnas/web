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

const howto = defineCollection({
	// Task-oriented guides under src/content/howto/, served at /how-to/<id>.
	loader: glob({ base: "./src/content/howto", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Sidebar and index grouping. Order of HOWTO_GROUPS in consts.ts
		// decides the order the groups appear in.
		group: z.enum([
			"Composing grammars",
			"Shaping the parse",
			"Feeding the lexer",
			"Working on a grammar",
		]),
		order: z.number().default(100),
		// Packages the guide actually uses. Rendered as links; keep honest.
		packages: z.array(z.string()).default([]),
	}),
});

export const collections = { docs, howto };
