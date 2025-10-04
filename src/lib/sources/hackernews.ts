import { Article, NewsSource, FetchOptions } from '../types';

interface HNItem {
  id: number;
  title: string;
  url?: string;
  text?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
  type: string;
}

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

async function fetchHNItem(id: number): Promise<HNItem | null> {
  try {
    const response = await fetch(`${HN_API_BASE}/item/${id}.json`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error(`Error fetching HN item ${id}:`, error);
    return null;
  }
}

async function fetchHackerNews(options?: FetchOptions): Promise<Article[]> {
  const limit = options?.limit || 30;

  try {
    // Fetch top stories IDs
    const response = await fetch(`${HN_API_BASE}/topstories.json`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error('Failed to fetch HN top stories');
      return [];
    }

    const storyIds: number[] = await response.json();

    // Fetch details for top N stories in parallel
    const itemPromises = storyIds.slice(0, limit * 2).map(fetchHNItem); // Fetch 2x in case some fail
    const items = await Promise.all(itemPromises);

    // Filter valid stories with URLs
    const articles: Article[] = items
      .filter(
        (item): item is HNItem =>
          item !== null && item.type === 'story' && Boolean(item.url)
      )
      .slice(0, limit)
      .map((item) => ({
        id: `hn-${item.id}`,
        title: item.title,
        url: item.url!,
        description: item.text?.replace(/<[^>]*>/g, '').substring(0, 200),
        source: 'hackernews' as const,
        author: item.by,
        publishedAt: new Date(item.time * 1000),
        topics: ['technology', 'programming'],
        score: item.score,
        commentsCount: item.descendants,
      }));

    return articles;
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
}

export const hackerNewsSource: NewsSource = {
  name: 'Hacker News',
  fetch: fetchHackerNews,
};
