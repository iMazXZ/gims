import React from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, Film, Tv } from "lucide-react";
import { HistoryItem } from "../types";

interface HistoryPanelProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-20 text-brand-text-secondary">
        <Clock size={64} className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-text-primary">
          No History Yet
        </h2>
        <p>Your recently viewed items will appear here.</p>
      </div>
    );
  }

  return (
    <section className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-display tracking-wider">
          Recently Viewed
        </h1>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {history.map((item) => (
          <Link
            to={`/${item.type}/${item.id}`}
            key={`${item.id}-${item.viewedAt}`}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] bg-brand-surface rounded-lg overflow-hidden border border-brand-border transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-brand-primary/20">
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-text-secondary">
                  {item.type === "movie" ? (
                    <Film size={48} />
                  ) : (
                    <Tv size={48} />
                  )}
                </div>
              )}
            </div>
            <h3 className="mt-2 font-semibold text-brand-text-primary truncate">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HistoryPanel;
