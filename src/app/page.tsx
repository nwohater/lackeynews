'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/lib/types';
import { ArticleCard } from '@/components/ArticleCard';
import { TopicFilter } from '@/components/TopicFilter';
import { Loader2, RefreshCw, Newspaper, Sparkles } from 'lucide-react';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const fetchNews = async (topics?: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const topicsQuery = topics && topics.length > 0 ? `&topics=${topics.join(',')}` : '';
      const response = await fetch(`/api/news?limit=50${topicsQuery}`);
      const data = await response.json();

      if (data.success) {
        setArticles(data.data.articles);
        setSources(data.data.sources);
      } else {
        setError(data.error || 'Failed to fetch news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedTopics);
  }, [selectedTopics]);

  const handleTopicsChange = (topics: string[]) => {
    setSelectedTopics(topics);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
      <div className="absolute top-40 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />

      {/* Header */}
      <header className="relative border-b border-cyan-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Newspaper className="w-10 h-10 text-cyan-400" />
                <div className="absolute inset-0 blur-xl bg-cyan-400/50" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  LACKEY<span className="text-cyan-300">NEWS</span>
                </h1>
                <p className="text-xs text-cyan-400/60 font-mono tracking-wider">NEURAL FEED v2.0</p>
              </div>
            </div>
            <button
              onClick={() => fetchNews(selectedTopics)}
              disabled={loading}
              className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <RefreshCw className={`w-5 h-5 relative z-10 ${loading ? 'animate-spin' : ''}`} />
              <span className="relative z-10">SYNC</span>
            </button>
          </div>

          {/* Sources indicator */}
          {sources.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <p className="text-sm text-cyan-400/80 font-mono">
                CONNECTED: <span className="text-purple-400">{sources.join(' • ')}</span>
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Topic Filter */}
        <div className="mb-8">
          <TopicFilter selectedTopics={selectedTopics} onTopicsChange={handleTopicsChange} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-cyan-400/80 font-mono text-lg">SYNCING NEURAL FEED...</p>
              <div className="mt-4 flex gap-1 justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center backdrop-blur-sm">
            <p className="text-red-400 font-bold text-lg mb-4">ERROR: {error}</p>
            <button
              onClick={() => fetchNews(selectedTopics)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              RETRY CONNECTION
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-12 text-center backdrop-blur-sm">
            <Newspaper className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
            <p className="text-cyan-400/80 font-mono text-lg">NO DATA STREAMS FOUND</p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  LIVE FEED
                </h2>
                <p className="text-cyan-400/60 font-mono text-sm mt-1">
                  {articles.length} ARTICLES LOADED
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cyan-500/20 mt-12 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-cyan-400/80 font-mono text-sm mb-2">
              AGGREGATING: <span className="text-purple-400">REDDIT • HACKER NEWS • DEV.TO • ESPN • CBS SPORTS • 30+ RSS FEEDS</span>
            </p>
            <p className="text-cyan-400/40 font-mono text-xs">
              LACKEYNEWS v2.0 • NEURAL NETWORK EDITION
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
