import React from "react";
import { Link } from "react-router-dom";
import { MediaItem } from "../types";
import { Film, Tv } from "lucide-react";

interface MediaRowProps {
  title: string;
  items: MediaItem[];
}

const MediaRow: React.FC<MediaRowProps> = ({ title, items }) => {
  return (
    <section>
      <h2 className="text-2xl font-display tracking-wider mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-8 px-8">
        {items
          .filter((item) => item.poster_path)
          .map((item) => {
            const mediaType = item.media_type || (item.title ? "movie" : "tv");
            return (
              <Link
                to={`/${mediaType}/${item.id}`}
                key={item.id}
                className="flex-shrink-0 w-40 group"
              >
                <div className="relative aspect-[2/3] bg-brand-surface rounded-lg overflow-hidden border border-brand-border transition-transform duration-300 group-hover:-translate-y-2">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    className="w-full h-full object-cover"
                    alt={item.title || item.name}
                  />
                </div>
                <h3 className="mt-2 font-semibold truncate">
                  {item.title || item.name}
                </h3>
              </Link>
            );
          })}
      </div>
    </section>
  );
};

export default MediaRow;
