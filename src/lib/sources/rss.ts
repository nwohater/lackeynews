import { Article, NewsSource, FetchOptions } from '../types';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'description', 'content:encoded'],
  },
});

interface RSSFeed {
  url: string;
  name: string;
  topics: string[];
}

// AI-focused RSS feeds
const AI_FEEDS: RSSFeed[] = [
  {
    url: 'https://openai.com/blog/rss.xml',
    name: 'OpenAI Blog',
    topics: ['ai', 'technology'],
  },
  {
    url: 'https://huggingface.co/blog/feed.xml',
    name: 'Hugging Face Blog',
    topics: ['ai', 'machine-learning'],
  },
  {
    url: 'https://blog.google/technology/ai/rss',
    name: 'Google AI Blog',
    topics: ['ai', 'technology'],
  },
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    name: 'TechCrunch AI',
    topics: ['ai', 'technology', 'business'],
  },
  {
    url: 'https://www.technologyreview.com/feed/',
    name: 'MIT Technology Review',
    topics: ['ai', 'technology', 'science'],
  },
  {
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    name: 'The Verge AI',
    topics: ['ai', 'technology'],
  },
  {
    url: 'https://blog.research.google/feeds/posts/default',
    name: 'Google Research',
    topics: ['ai', 'research', 'technology'],
  },
  {
    url: 'https://www.deepmind.com/blog/rss.xml',
    name: 'DeepMind Blog',
    topics: ['ai', 'research', 'machine-learning'],
  },
  {
    url: 'https://blogs.nvidia.com/feed/',
    name: 'NVIDIA Blog',
    topics: ['ai', 'technology', 'hardware'],
  },
  {
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    name: 'AWS ML Blog',
    topics: ['ai', 'machine-learning', 'cloud'],
  },
  {
    url: 'https://www.microsoft.com/en-us/research/feed/',
    name: 'Microsoft Research',
    topics: ['ai', 'research', 'technology'],
  },
  // Sports feeds
  {
    url: 'https://www.espn.com/espn/rss/news',
    name: 'ESPN',
    topics: ['sports'],
  },
  {
    url: 'https://www.espn.com/espn/rss/nfl/news',
    name: 'ESPN NFL',
    topics: ['sports', 'football'],
  },
  {
    url: 'https://www.espn.com/espn/rss/nba/news',
    name: 'ESPN NBA',
    topics: ['sports', 'basketball'],
  },
  {
    url: 'https://www.espn.com/espn/rss/mlb/news',
    name: 'ESPN MLB',
    topics: ['sports', 'baseball'],
  },
  {
    url: 'https://www.espn.com/espn/rss/soccer/news',
    name: 'ESPN Soccer',
    topics: ['sports', 'soccer'],
  },
  {
    url: 'https://www.cbssports.com/rss/headlines/',
    name: 'CBS Sports',
    topics: ['sports'],
  },
  {
    url: 'https://sports.yahoo.com/rss/',
    name: 'Yahoo Sports',
    topics: ['sports'],
  },
  // Developer & Programming feeds
  {
    url: 'https://github.blog/feed/',
    name: 'GitHub Blog',
    topics: ['programming', 'technology'],
  },
  {
    url: 'https://stackoverflow.blog/feed/',
    name: 'Stack Overflow Blog',
    topics: ['programming', 'technology'],
  },
  {
    url: 'https://css-tricks.com/feed/',
    name: 'CSS-Tricks',
    topics: ['programming', 'web-development'],
  },
  {
    url: 'https://www.smashingmagazine.com/feed/',
    name: 'Smashing Magazine',
    topics: ['programming', 'web-development', 'design'],
  },
  {
    url: 'https://www.freecodecamp.org/news/rss/',
    name: 'freeCodeCamp',
    topics: ['programming', 'tutorials'],
  },
  {
    url: 'https://martinfowler.com/feed.atom',
    name: 'Martin Fowler',
    topics: ['programming', 'software-architecture'],
  },
  {
    url: 'https://blog.jetbrains.com/feed/',
    name: 'JetBrains Blog',
    topics: ['programming', 'tools'],
  },
  {
    url: 'https://devblogs.microsoft.com/feed/',
    name: 'Microsoft DevBlogs',
    topics: ['programming', 'technology'],
  },
  {
    url: 'https://developers.googleblog.com/feeds/posts/default',
    name: 'Google Developers',
    topics: ['programming', 'technology'],
  },
  {
    url: 'https://vercel.com/atom',
    name: 'Vercel Blog',
    topics: ['programming', 'web-development'],
  },
  {
    url: 'https://nodejs.org/en/feed/blog.xml',
    name: 'Node.js Blog',
    topics: ['programming', 'javascript'],
  },
  {
    url: 'https://react.dev/rss.xml',
    name: 'React Blog',
    topics: ['programming', 'javascript', 'web-development'],
  },
  {
    url: 'https://blog.rust-lang.org/feed.xml',
    name: 'Rust Blog',
    topics: ['programming', 'rust'],
  },
  {
    url: 'https://go.dev/blog/feed.atom',
    name: 'Go Blog',
    topics: ['programming', 'golang'],
  },
  {
    url: 'https://blog.python.org/feeds/posts/default',
    name: 'Python Blog',
    topics: ['programming', 'python'],
  },
  {
    url: 'https://www.ruby-lang.org/en/feeds/news.rss',
    name: 'Ruby News',
    topics: ['programming', 'ruby'],
  },
  {
    url: 'https://aws.amazon.com/blogs/developer/feed/',
    name: 'AWS Developer Blog',
    topics: ['programming', 'cloud', 'devops'],
  },
  {
    url: 'https://thenewstack.io/feed/',
    name: 'The New Stack',
    topics: ['programming', 'devops', 'cloud'],
  },
];

async function fetchRSSFeed(feed: RSSFeed): Promise<Article[]> {
  try {
    const feedData = await parser.parseURL(feed.url);

    if (!feedData.items) {
      return [];
    }

    const articles: Article[] = feedData.items
      .filter((item) => item.link)
      .map((item) => {
        // Try to extract image from various RSS fields
        let imageUrl: string | undefined;
        
        // Check for media:content or media:thumbnail
        const mediaContent = (item as any)['media:content'];
        const mediaThumbnail = (item as any)['media:thumbnail'];
        
        if (mediaContent?.$ && mediaContent.$.url) {
          imageUrl = mediaContent.$.url;
        } else if (mediaThumbnail?.$ && mediaThumbnail.$.url) {
          imageUrl = mediaThumbnail.$.url;
        } else if (item.enclosure?.url) {
          imageUrl = item.enclosure.url;
        }

        // Get description, trying various fields
        const description =
          item.contentSnippet ||
          item.summary ||
          (item.content || '').replace(/<[^>]*>/g, '').substring(0, 200);

        // Get author, handling when it might be an object
        let author = feed.name;
        if (item.creator) {
          if (typeof item.creator === 'string') {
            author = item.creator;
          } else if (typeof item.creator === 'object' && item.creator !== null) {
            // Handle case where creator is an object with name property
            author = (item.creator as any).name || (item.creator as any).title || feed.name;
          }
        }

        // Create a unique ID by hashing the URL and title
        const uniqueString = `${item.link}-${item.title}-${feed.name}`;
        const uniqueId = Buffer.from(uniqueString).toString('base64').replace(/[^a-zA-Z0-9]/g, '');

        return {
          id: `rss-${uniqueId}`,
          title: item.title || 'Untitled',
          url: item.link!,
          description: description || undefined,
          source: 'rss' as const,
          author,
          imageUrl,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          topics: [...feed.topics],
          score: undefined,
          commentsCount: undefined,
        };
      });

    return articles;
  } catch (error) {
    console.error(`Error fetching RSS feed ${feed.name}:`, error);
    return [];
  }
}

async function fetchRSSNews(options?: FetchOptions): Promise<Article[]> {
  const limit = options?.limit || 20;

  // Determine which feeds to fetch based on topics
  let feedsToFetch = AI_FEEDS;

  if (options?.topics && options.topics.length > 0) {
    const lowerTopics = options.topics.map((t) => t.toLowerCase());
    feedsToFetch = AI_FEEDS.filter((feed) =>
      feed.topics.some((topic) => lowerTopics.includes(topic.toLowerCase()))
    );
  }

  // If no feeds match, don't fetch anything
  if (feedsToFetch.length === 0) {
    return [];
  }

  // Fetch all feeds in parallel
  const results = await Promise.all(
    feedsToFetch.map((feed) => fetchRSSFeed(feed))
  );

  // Flatten and sort by date
  const allArticles = results.flat();
  return allArticles
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
}

export const rssSource: NewsSource = {
  name: 'RSS Feeds',
  fetch: fetchRSSNews,
};
