import { Filter } from 'lucide-react';

interface TopicFilterProps {
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
}

const AVAILABLE_TOPICS = [
  { id: 'all', label: 'All News', icon: '📰' },
  { id: 'ai', label: 'AI & ML', icon: '🤖' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'programming', label: 'Programming', icon: '👨‍💻' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'world', label: 'World News', icon: '🌍' },
];

export function TopicFilter({ selectedTopics, onTopicsChange }: TopicFilterProps) {
  const handleTopicClick = (topicId: string) => {
    if (topicId === 'all') {
      onTopicsChange([]);
      return;
    }

    if (selectedTopics.includes(topicId)) {
      onTopicsChange(selectedTopics.filter((t) => t !== topicId));
    } else {
      onTopicsChange([...selectedTopics, topicId]);
    }
  };

  const isActive = (topicId: string) => {
    if (topicId === 'all') {
      return selectedTopics.length === 0;
    }
    return selectedTopics.includes(topicId);
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-cyan-500/20 p-3 sm:p-4 relative overflow-hidden">
      <div className="relative flex items-start sm:items-center gap-2">
        <Filter className="w-4 h-4 text-cyan-400/70 flex-shrink-0 mt-1 sm:mt-0" />
        <div className="flex-1 overflow-x-auto -mx-1 px-1 scrollbar-hide">
          <div className="flex gap-2 pb-1 min-w-max sm:flex-wrap sm:min-w-0">
            {AVAILABLE_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                className={`group relative px-3 py-2 sm:py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                  isActive(topic.id)
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-black/60 text-cyan-400/70 border border-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 active:scale-95'
                }`}
              >
                <span className="mr-1">{topic.icon}</span>
                <span>{topic.label.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
