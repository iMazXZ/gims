import React, { useState, useEffect } from 'react';
import { Search, History, Trash2 } from 'lucide-react';
import SearchForm from './components/SearchForm';
import DetailCard from './components/DetailCard';
import SearchResults from './components/SearchResults';
import HistoryPanel from './components/HistoryPanel';
import { MediaDetails, SearchResult, HistoryItem } from './types';
import './styles/animations.css';

function App() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [mediaDetails, setMediaDetails] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const apiKey = 'bdb582fd786dbd3db9d6e6ea727adb2b';

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('movieTvHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('movieTvHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (details: MediaDetails) => {
    const isMovie = 'title' in details;
    const historyItem: HistoryItem = {
      id: details.id,
      title: isMovie ? details.title : details.name,
      type: isMovie ? 'movie' : 'tv',
      poster_path: details.poster_path,
      viewedAt: new Date().toISOString(),
      vote_average: details.vote_average
    };

    setHistory(prev => {
      // Remove existing item if it exists
      const filtered = prev.filter(item => !(item.id === details.id && item.type === historyItem.type));
      // Add new item at the beginning
      return [historyItem, ...filtered].slice(0, 20); // Keep only last 20 items
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('movieTvHistory');
  };

  const handleSearch = async (query: string, type: 'movie' | 'tv') => {
    setIsLoading(true);
    setError(null);
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results.map((result: any) => ({ ...result, media_type: type })));
        setMediaDetails(null);
        setShowHistory(false);
      } else {
        setSearchResults([]);
        setMediaDetails(null);
        setError('No results found');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(`An error occurred while fetching search results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetails = async (id: number, type: 'movie' | 'tv') => {
    setIsLoading(true);
    setError(null);
    
    const detailsUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`;
    const creditsUrl = `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}`;
    const imagesUrl = `https://api.themoviedb.org/3/${type}/${id}/images?api_key=${apiKey}`;

    try {
      const [detailsResponse, creditsResponse, imagesResponse] = await Promise.all([
        fetch(detailsUrl),
        fetch(creditsUrl),
        fetch(imagesUrl)
      ]);

      if (!detailsResponse.ok || !creditsResponse.ok || !imagesResponse.ok) {
        throw new Error(`HTTP error! status: ${detailsResponse.status}`);
      }

      const detailsData = await detailsResponse.json();
      const creditsData = await creditsResponse.json();
      const imagesData = await imagesResponse.json();

      const cast = creditsData.cast || [];
      const backdrops = imagesData.backdrops.map((backdrop: any) => backdrop.file_path) || [];
      const posters = imagesData.posters.map((poster: any) => poster.file_path) || [];

      const details = { ...detailsData, cast, backdrops, posters };
      setMediaDetails(details);
      setSearchResults([]);
      setShowHistory(false);
      
      // Add to history
      addToHistory(details);
    } catch (error) {
      console.error('Error fetching details:', error);
      setError(`An error occurred while fetching details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    fetchDetails(item.id, item.type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-text">
              CineScope
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover detailed information about your favorite movies and TV shows
            </p>
          </div>

          {/* Main Content Container */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            {/* Search Form and History Toggle */}
            <div className="flex flex-col lg:flex-row gap-4 items-center mb-8">
              <div className="flex-1 w-full">
                <SearchForm onSearch={handleSearch} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    showHistory 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <History size={20} />
                  History ({history.length})
                </button>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-2 px-4 py-3 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
                <div className="text-xl font-semibold text-white">Loading...</div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <div className="text-xl font-semibold text-red-400 bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  {error}
                </div>
              </div>
            )}

            {/* History Panel */}
            {showHistory && !isLoading && (
              <HistoryPanel 
                history={history} 
                onItemClick={handleHistoryItemClick}
                onClearHistory={clearHistory}
              />
            )}

            {/* Search Results */}
            {searchResults.length > 0 && !showHistory && (
              <SearchResults results={searchResults} onSelectResult={fetchDetails} />
            )}

            {/* Media Details */}
            {mediaDetails && !showHistory && (
              <DetailCard details={mediaDetails} />
            )}

            {/* Welcome State */}
            {!isLoading && !error && !mediaDetails && searchResults.length === 0 && !showHistory && (
              <div className="text-center py-16">
                <div className="mb-8">
                  <Search size={64} className="mx-auto text-purple-400 mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Ready to Explore?</h2>
                  <p className="text-gray-300 max-w-md mx-auto">
                    Search for any movie or TV show to get detailed information, cast details, and beautiful imagery.
                  </p>
                </div>
                {history.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-white mb-2">Recent Searches</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {history.slice(0, 5).map((item) => (
                        <button
                          key={`${item.id}-${item.type}`}
                          onClick={() => handleHistoryItemClick(item)}
                          className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm hover:bg-purple-500/30 transition-colors duration-200"
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;