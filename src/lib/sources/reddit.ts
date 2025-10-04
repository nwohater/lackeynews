import { Article, NewsSource, FetchOptions } from '../types';

interface RedditPost {
  data: {
    id: string;
    title: string;
    url: string;
    selftext?: string;
    author: string;
    subreddit: string;
    created_utc: number;
    score: number;
    num_comments: number;
    thumbnail?: string;
    preview?: {
      images: Array<{
        source: {
          url: string;
        };
      }>;
    };
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

// Popular subreddits for news by topic
const SUBREDDIT_MAP: Record<string, string[]> = {
  technology: ['technology', 'tech', 'gadgets'],
  programming: ['programming', 'coding', 'webdev'],
  science: ['science', 'space', 'physics'],
  business: ['business', 'economics', 'investing'],
  world: ['worldnews', 'news', 'politics'],
  entertainment: ['movies', 'television', 'gaming'],
  ai: ['artificial', 'MachineLearning', 'OpenAI', 'LocalLLaMA', 'singularity'],
  sports: ['sports', 'nba', 'nfl', 'soccer', 'baseball', 'hockey'],
  football: ['nfl', 'fantasyfootball'],
  basketball: ['nba', 'Basketball'],
  soccer: ['soccer', 'football'],
  baseball: ['baseball', 'mlb'],
};

async function fetchSubreddit(
  subreddit: string,
  limit: number = 25
): Promise<Article[]> {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`,
      {
        headers: {
          'User-Agent': 'LackeyNews/1.0',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch r/${subreddit}: ${response.statusText}`);
      return [];
    }

    const data: RedditResponse = await response.json();

    return data.data.children
      .filter((post) => {
        // Filter out self posts without URLs and removed/deleted posts
        return (
          !post.data.url.includes('reddit.com') &&
          post.data.title &&
          !post.data.title.includes('[removed]')
        );
      })
      .map((post) => {
        let imageUrl: string | undefined;
        
        if (post.data.preview?.images[0]?.source?.url) {
          // Decode HTML entities and URI components
          const url = post.data.preview.images[0].source.url;
          imageUrl = url
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
        } else if (
          post.data.thumbnail &&
          post.data.thumbnail !== 'self' &&
          post.data.thumbnail !== 'default' &&
          post.data.thumbnail.startsWith('http')
        ) {
          imageUrl = post.data.thumbnail;
        }

        return {
          id: `reddit-${post.data.id}`,
          title: post.data.title,
          url: post.data.url,
          description: post.data.selftext?.substring(0, 200) || undefined,
          source: 'reddit' as const,
          author: post.data.author,
          imageUrl,
          publishedAt: new Date(post.data.created_utc * 1000),
          topics: [post.data.subreddit.toLowerCase()],
          score: post.data.score,
          commentsCount: post.data.num_comments,
        };
      });
  } catch (error) {
    console.error(`Error fetching r/${subreddit}:`, error);
    return [];
  }
}

async function fetchRedditNews(options?: FetchOptions): Promise<Article[]> {
  const limit = options?.limit || 25;
  const topics = options?.topics || Object.keys(SUBREDDIT_MAP);

  // Get subreddits based on requested topics
  const subredditsToFetch = topics.flatMap(
    (topic) => SUBREDDIT_MAP[topic.toLowerCase()] || []
  );

  // If no topics matched, fetch from popular news subreddits
  const subreddits =
    subredditsToFetch.length > 0
      ? [...new Set(subredditsToFetch)]
      : ['technology', 'worldnews', 'programming'];

  // Fetch from multiple subreddits in parallel
  const postsPerSubreddit = Math.ceil(limit / subreddits.length);
  const results = await Promise.all(
    subreddits.map((sub) => fetchSubreddit(sub, postsPerSubreddit))
  );

  // Flatten and sort by score
  const allArticles = results.flat();
  return allArticles
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit);
}

export const redditSource: NewsSource = {
  name: 'Reddit',
  fetch: fetchRedditNews,
};
