import React from "react";
import { Link } from "react-router-dom";
import { Film, Tv, Calendar } from "lucide-react";
import { SearchResult } from "../types";

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <p className="text-center text-brand-text-secondary mt-10">
        No results found.
      </p>
    );
  }
  return (
    <section className="animate-fade-in-up">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results
          .filter((r) => r.poster_path)
          .map((result) => (
            <Link
              to={`/${result.media_type}/${result.id}`}
              key={result.id}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] bg-brand-surface rounded-lg overflow-hidden border border-brand-border transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-brand-primary/20">
                <img
                  src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                  alt={result.title || result.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-semibold text-brand-text-primary truncate">
                  {result.title || result.name}
                </h3>
                <div className="flex items-center text-sm text-brand-text-secondary gap-2">
                  <Calendar size={14} />
                  <span>
                    {(result.release_date || result.first_air_date)?.split(
                      "-"
                    )[0] || "N/A"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default SearchResults;
