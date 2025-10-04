import { Article, NewsSource, FetchOptions } from '../types';

interface DevToArticle {
  id: number;
  title: string;
  url: string;
  description: string;
  published_at: string;
  tag_list: string[];
  user: {
    name: string;
    username: string;
  };
  cover_image?: string;
  positive_reactions_count: number;
  comments_count: number;
}

const DEVTO_API_BASE = 'https://dev.to/api';

async function fetchDevTo(options?: FetchOptions): Promise<Article[]> {
  const limit = options?.limit || 30;

  try {
    // Fetch latest articles
    const response = await fetch(
      `${DEVTO_API_BASE}/articles?per_page=${limit}&top=7`, // Top articles from last 7 days
      {
        headers: {
          'User-Agent': 'LackeyNews/1.0',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch Dev.to articles');
      return [];
    }

    const data: DevToArticle[] = await response.json();

    const articles: Article[] = data.map((article) => ({
      id: `devto-${article.id}`,
      title: article.title,
      url: article.url,
      description: article.description,
      source: 'devto' as const,
      author: article.user.name || article.user.username,
      imageUrl: article.cover_image,
      publishedAt: new Date(article.published_at),
      topics: article.tag_list.map((tag) => tag.toLowerCase()),
      score: article.positive_reactions_count,
      commentsCount: article.comments_count,
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching Dev.to:', error);
    return [];
  }
}

export const devToSource: NewsSource = {
  name: 'Dev.to',
  fetch: fetchDevTo,
};
