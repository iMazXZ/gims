import React from 'react';
import { Star, Calendar, Film, Tv } from 'lucide-react';
import { SearchResult } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
  onSelectResult: (id: number, type: 'movie' | 'tv') => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelectResult }) => {
  return (
    <div className="w-full mb-8">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Search Results
        </span>
        <span className="text-sm font-normal text-gray-300">({results.length} found)</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl border border-white/10"
            onClick={() => onSelectResult(result.id, result.media_type as 'movie' | 'tv')}
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              {result.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${result.poster_path}`}
                  alt={result.title || result.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  {result.media_type === 'movie' ? (
                    <Film size={48} className="text-white/50" />
                  ) : (
                    <Tv size={48} className="text-white/50" />
                  )}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-1">
                  {result.media_type === 'movie' ? (
                    <Film size={16} className="text-white" />
                  ) : (
                    <Tv size={16} className="text-white" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
                {result.title || result.name}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="capitalize">{result.media_type}</span>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{result.release_date || result.first_air_date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;