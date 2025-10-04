import { z } from 'zod';

// Unified Article schema
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
  source: z.enum(['reddit', 'hackernews', 'devto', 'rss']),
  author: z.string().optional(),
  imageUrl: z.string().url().optional(),
  publishedAt: z.date(),
  topics: z.array(z.string()).default([]),
  score: z.number().optional(),
  commentsCount: z.number().optional(),
});

export type Article = z.infer<typeof ArticleSchema>;

export interface NewsSource {
  name: string;
  fetch: (options?: FetchOptions) => Promise<Article[]>;
}

export interface FetchOptions {
  limit?: number;
  topics?: string[];
}

export interface AggregatedNews {
  articles: Article[];
  sources: string[];
  fetchedAt: Date;
}
