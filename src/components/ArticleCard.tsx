import { Article } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, MessageCircle, TrendingUp, ImageOff } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ArticleCardProps {
  article: Article;
}

const SOURCE_COLORS = {
  reddit: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  hackernews: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  devto: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  rss: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
};

export function ArticleCard({ article }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const publishedDate =
    typeof article.publishedAt === 'string'
      ? new Date(article.publishedAt)
      : article.publishedAt;

  return (
    <article className="group relative bg-black/40 backdrop-blur-sm rounded-lg border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
      
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6 relative"
      >
        <div className="flex gap-6">
          {/* Image */}
          {article.imageUrl && !imageError && (
            <div className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden bg-black/60 border border-cyan-500/30 group-hover:border-cyan-400 transition-colors relative">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                onError={() => setImageError(true)}
                unoptimized
              />
            </div>
          )}
          {article.imageUrl && imageError && (
            <div className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden bg-black/60 border border-cyan-500/30 flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-cyan-500/40" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-xl font-bold text-cyan-100 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all mb-3">
              {article.title}
            </h3>

            {/* Description */}
            {article.description && (
              <p className="text-sm text-cyan-200/70 line-clamp-2 mb-4 font-mono">
                {article.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-3 text-sm text-cyan-400/60 flex-wrap font-mono">
              {/* Source Badge */}
              <span
                className={`px-3 py-1 rounded border text-xs font-bold ${
                  SOURCE_COLORS[article.source]
                }`}
              >
                {article.source === 'hackernews'
                  ? 'HACKER NEWS'
                  : article.source === 'devto'
                  ? 'DEV.TO'
                  : article.source.toUpperCase()}
              </span>

              {/* Author */}
              {article.author && (
                <span className="flex items-center gap-1 text-purple-400/80">
                  {article.author}
                </span>
              )}

              {/* Time */}
              <span className="text-cyan-400/60">
                {formatDistanceToNow(publishedDate, { addSuffix: true })}
              </span>

              {/* Score */}
              {article.score !== undefined && article.score > 0 && (
                <span className="flex items-center gap-1 text-cyan-400">
                  <TrendingUp className="w-4 h-4" />
                  {article.score}
                </span>
              )}

              {/* Comments */}
              {article.commentsCount !== undefined &&
                article.commentsCount > 0 && (
                  <span className="flex items-center gap-1 text-purple-400">
                    <MessageCircle className="w-4 h-4" />
                    {article.commentsCount}
                  </span>
                )}

              {/* External Link Icon */}
              <span className="ml-auto text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </span>
            </div>

            {/* Topics */}
            {article.topics.length > 0 && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {article.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/30 rounded text-xs font-mono"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </a>
    </article>
  );
}
