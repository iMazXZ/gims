import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MediaItem } from "../types";
import { Bookmark, Star } from "lucide-react";
import { isInWatchlist, toggleWatchlist } from "../utils/watchlist";

interface MediaGridProps {
  items: MediaItem[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ items }) => {
  const [, setVersion] = useState(0);
  const forceUpdate = useCallback(() => setVersion((v) => v + 1), []);

  const handleWatchlistToggle = (e: React.MouseEvent, item: MediaItem) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(item);
    forceUpdate();
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {items.map((item) => {
        const inWatchlist = isInWatchlist(item.id);
        return (
          <Link
            to={`/${item.media_type || (item.title ? "movie" : "tv")}/${
              item.id
            }`}
            key={item.id}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] bg-brand-surface rounded-lg overflow-hidden border border-transparent group-hover:border-brand-primary transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-brand-primary/20">
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : `https://placehold.co/500x750/161B22/7D8590?text=${encodeURIComponent(
                        item.title || item.name || ""
                      )}`
                }
                alt={item.title || item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

              {/* Badge Kualitas */}
              {item.quality && (
                <div className="absolute top-2 left-2 bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg uppercase">
                  {item.quality}
                </div>
              )}

              {/* Tombol Watchlist */}
              <button
                onClick={(e) => handleWatchlistToggle(e, item)}
                className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 ${
                  inWatchlist
                    ? "bg-pink-600 text-white"
                    : "bg-black/60 text-white hover:bg-brand-primary"
                }`}
                title={
                  inWatchlist ? "Hapus dari Watchlist" : "Tambah ke Watchlist"
                }
              >
                <Bookmark
                  size={16}
                  className={inWatchlist ? "fill-current" : ""}
                />
              </button>

              <div className="absolute bottom-0 left-0 p-2 text-white w-full">
                {/* Rating */}
                {item.vote_average && item.vote_average > 0 ? (
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-bold">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                ) : null}
                <h3 className="font-bold text-sm leading-tight truncate">
                  {item.title || item.name}
                </h3>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MediaGrid;
