import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    categoryPill: z.string(),
    readTime: z.string(),
    date: z.string(),
    author: z.object({
      name: z.string(),
      role: z.string(),
      avatar: z.string()
    }),
    image: z.string(),
    keyTakeaways: z.array(z.string()).default([]),
    aiSummary: z.string().default("")
  })
});

export const collections = { blog };
