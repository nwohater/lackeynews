import { Article, AggregatedNews, FetchOptions } from './types';
import { redditSource } from './sources/reddit';
import { hackerNewsSource } from './sources/hackernews';
import { devToSource } from './sources/devto';
import { rssSource } from './sources/rss';

const NEWS_SOURCES = [redditSource, hackerNewsSource, devToSource, rssSource];

export async function aggregateNews(
  options?: FetchOptions
): Promise<AggregatedNews> {
  const startTime = Date.now();

  // Fetch from all sources in parallel
  const results = await Promise.allSettled(
    NEWS_SOURCES.map((source) => source.fetch(options))
  );

  // Collect successful results
  const articles: Article[] = [];
  const successfulSources: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
      successfulSources.push(NEWS_SOURCES[index].name);
    } else {
      console.error(
        `Failed to fetch from ${NEWS_SOURCES[index].name}:`,
        result.reason
      );
    }
  });

  // Remove duplicates based on URL
  const uniqueArticles = deduplicateArticles(articles);

  // Sort by published date (newest first)
  const sortedArticles = uniqueArticles.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );

  const endTime = Date.now();
  console.log(
    `Aggregated ${sortedArticles.length} articles from ${successfulSources.length} sources in ${endTime - startTime}ms`
  );

  return {
    articles: sortedArticles,
    sources: successfulSources,
    fetchedAt: new Date(),
  };
}

function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  const unique: Article[] = [];

  for (const article of articles) {
    // Normalize URL for comparison
    const normalizedUrl = normalizeUrl(article.url);

    if (!seen.has(normalizedUrl)) {
      seen.add(normalizedUrl);
      unique.push(article);
    }
  }

  return unique;
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove trailing slashes, query params for comparison
    const normalized = `${parsed.protocol}//${parsed.hostname}${parsed.pathname.replace(/\/$/, '')}`;
    return normalized.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export function filterArticlesByTopics(
  articles: Article[],
  topics: string[]
): Article[] {
  if (topics.length === 0) return articles;

  const lowerTopics = topics.map((t) => t.toLowerCase());

  return articles.filter((article) =>
    article.topics.some((topic) => lowerTopics.includes(topic.toLowerCase()))
  );
}

export function searchArticles(articles: Article[], query: string): Article[] {
  if (!query.trim()) return articles;

  const lowerQuery = query.toLowerCase();

  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description?.toLowerCase().includes(lowerQuery) ||
      article.author?.toLowerCase().includes(lowerQuery)
  );
}
