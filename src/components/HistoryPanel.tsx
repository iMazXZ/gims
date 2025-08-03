import React from 'react';
import { Clock, Star, Film, Tv, Trash2 } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onItemClick: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onItemClick, onClearHistory }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No History Yet</h3>
        <p className="text-gray-300">
          Your recently viewed movies and TV shows will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock size={24} />
          Recently Viewed
        </h2>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-colors duration-200"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {history.map((item) => (
          <div
            key={`${item.id}-${item.type}-${item.viewedAt}`}
            onClick={() => onItemClick(item)}
            className="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl border border-white/10"
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  {item.type === 'movie' ? (
                    <Film size={48} className="text-white/50" />
                  ) : (
                    <Tv size={48} className="text-white/50" />
                  )}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-1">
                  {item.type === 'movie' ? (
                    <Film size={16} className="text-white" />
                  ) : (
                    <Tv size={16} className="text-white" />
                  )}
                </div>
              </div>
              {item.vote_average && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <span className="text-white text-xs font-semibold">
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-200 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="capitalize">{item.type}</span>
                <span>{formatDate(item.viewedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;