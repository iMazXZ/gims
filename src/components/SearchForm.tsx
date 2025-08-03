import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchFormProps {
  onSearch: (query: string, type: 'movie' | 'tv') => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, type);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <input
            className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 border border-white/30 rounded-2xl py-4 px-6 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/25"
            type="text"
            placeholder="Search for movies or TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search className="h-5 w-5 text-gray-300" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-2xl py-4 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/25"
            value={type}
            onChange={(e) => setType(e.target.value as 'movie' | 'tv')}
          >
            <option value="movie" className="bg-gray-800 text-white">Movies</option>
            <option value="tv" className="bg-gray-800 text-white">TV Shows</option>
          </select>
          
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            type="submit"
          >
            <Sparkles size={18} />
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;