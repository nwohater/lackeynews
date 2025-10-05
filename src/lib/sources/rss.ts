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
    url: 'http://feeds.feedburner.com/TechCrunch/',
    name: 'TechCrunch',
    topics: ['technology', 'business', 'startups'],
  },
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    name: 'TechCrunch AI',
    topics: ['ai', 'technology', 'business'],
  },
  {
    url: 'https://www.wired.com/feed/rss',
    name: 'Wired',
    topics: ['technology', 'science', 'culture'],
  },
  {
    url: 'https://www.theverge.com/rss/index.xml',
    name: 'The Verge',
    topics: ['technology', 'gadgets'],
  },
  {
    url: 'http://feeds.arstechnica.com/arstechnica/index/',
    name: 'Ars Technica',
    topics: ['technology', 'science'],
  },
  {
    url: 'http://feeds.mashable.com/Mashable',
    name: 'Mashable',
    topics: ['technology', 'digital-culture'],
  },
  {
    url: 'https://news.ycombinator.com/rss',
    name: 'Hacker News',
    topics: ['technology', 'programming', 'startups'],
  },
  {
    url: 'https://www.producthunt.com/feed',
    name: 'Product Hunt',
    topics: ['technology', 'startups', 'products'],
  },
  {
    url: 'https://www.engadget.com/rss.xml',
    name: 'Engadget',
    topics: ['technology', 'gadgets'],
  },
  {
    url: 'https://venturebeat.com/feed/',
    name: 'VentureBeat',
    topics: ['technology', 'ai', 'business'],
  },
  {
    url: 'https://gizmodo.com/rss',
    name: 'Gizmodo',
    topics: ['technology', 'science', 'gadgets'],
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
  // Business & Finance feeds
  {
    url: 'https://www.bloomberg.com/feed/podcast/etf-report.xml',
    name: 'Bloomberg',
    topics: ['business', 'finance', 'markets'],
  },
  {
    url: 'https://www.forbes.com/business/feed/',
    name: 'Forbes',
    topics: ['business', 'finance', 'entrepreneurship'],
  },
  {
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    name: 'CNBC',
    topics: ['business', 'finance', 'markets'],
  },
  {
    url: 'https://www.ft.com/?format=rss',
    name: 'Financial Times',
    topics: ['business', 'finance', 'world'],
  },
  {
    url: 'https://www.economist.com/latest/rss.xml',
    name: 'The Economist',
    topics: ['business', 'economics', 'world'],
  },
  {
    url: 'https://hbr.org/feed',
    name: 'Harvard Business Review',
    topics: ['business', 'management', 'leadership'],
  },
  {
    url: 'https://www.marketwatch.com/rss/topstories',
    name: 'MarketWatch',
    topics: ['business', 'finance', 'markets'],
  },
  {
    url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    name: 'Wall Street Journal',
    topics: ['business', 'finance', 'markets'],
  },
  {
    url: 'https://www.businessinsider.com/rss',
    name: 'Business Insider',
    topics: ['business', 'technology', 'finance'],
  },
  {
    url: 'https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_articles',
    name: 'Investopedia',
    topics: ['business', 'finance', 'investing'],
  },
  // Science feeds
  {
    url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    name: 'NASA Breaking News',
    topics: ['science', 'space', 'astronomy'],
  },
  {
    url: 'https://www.nature.com/nature.rss',
    name: 'Nature',
    topics: ['science', 'research'],
  },
  {
    url: 'https://www.scientificamerican.com/feed/',
    name: 'Scientific American',
    topics: ['science', 'research'],
  },
  {
    url: 'https://www.smithsonianmag.com/rss/',
    name: 'Smithsonian Magazine',
    topics: ['science', 'history', 'culture'],
  },
  {
    url: 'https://feeds.feedburner.com/tedtalks_video',
    name: 'TED Talks Daily',
    topics: ['science', 'technology', 'ideas'],
  },
  {
    url: 'https://www.sciencemag.org/rss/current.xml',
    name: 'Science Magazine',
    topics: ['science', 'research'],
  },
  {
    url: 'https://www.livescience.com/feeds/all',
    name: 'Live Science',
    topics: ['science', 'health', 'nature'],
  },
  {
    url: 'https://www.popsci.com/arcio/rss/',
    name: 'Popular Science',
    topics: ['science', 'technology'],
  },
  {
    url: 'https://theconversation.com/us/articles.atom',
    name: 'The Conversation',
    topics: ['science', 'research', 'academia'],
  },
  {
    url: 'https://www.nationalgeographic.com/content/nationalgeographic/en_us/rss',
    name: 'National Geographic',
    topics: ['science', 'nature', 'exploration'],
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
  {
    url: 'https://www.reddit.com/r/ExperiencedDevs/top/.rss?t=month',
    name: 'r/ExperiencedDevs',
    topics: ['programming', 'career', 'software-engineering'],
  },
  // World News feeds
  {
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    name: 'BBC World News',
    topics: ['world', 'news', 'international'],
  },
  {
    url: 'https://feeds.nbcnews.com/nbcnews/public/news',
    name: 'NBC News',
    topics: ['world', 'news', 'politics'],
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
        const itemWithMedia = item as unknown as Record<string, unknown>;
        const mediaContent = itemWithMedia['media:content'] as { $?: { url?: string } } | undefined;
        const mediaThumbnail = itemWithMedia['media:thumbnail'] as { $?: { url?: string } } | undefined;
        
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
            const creatorObj = item.creator as Record<string, unknown>;
            author = (creatorObj.name as string) || (creatorObj.title as string) || feed.name;
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
  const limit = options?.limit || 50;

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

  // Limit number of feeds to fetch for better performance
  // Take a sample of feeds if there are too many
  const maxFeeds = 15;
  if (feedsToFetch.length > maxFeeds) {
    // Shuffle and take first maxFeeds to get variety
    feedsToFetch = feedsToFetch
      .sort(() => Math.random() - 0.5)
      .slice(0, maxFeeds);
  }

  // Fetch all feeds in parallel with timeout
  const results = await Promise.all(
    feedsToFetch.map(async (feed) => {
      try {
        // Add timeout to prevent slow feeds from blocking
        const timeoutPromise = new Promise<Article[]>((resolve) => {
          setTimeout(() => resolve([]), 5000); // 5 second timeout
        });
        const fetchPromise = fetchRSSFeed(feed);
        return await Promise.race([fetchPromise, timeoutPromise]);
      } catch (error) {
        console.error(`Error fetching feed ${feed.name}:`, error);
        return [];
      }
    })
  );

  // Flatten, sort by date, and limit to top articles
  const allArticles = results.flat();
  return allArticles
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
}

export const rssSource: NewsSource = {
  name: 'RSS Feeds',
  fetch: fetchRSSNews,
};
