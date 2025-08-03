import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
// FIXED: Mengimpor fungsi yang benar dari modul api.ts yang baru
import { moviesApiFetch, tmdbFetch } from "../api";
import { SearchResult, MoviesApiItem, MediaItem } from "../types";
import SearchResults from "../components/SearchResults";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const query = searchParams.get("q");

  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.length < 3) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        // 1. Fetch from both movie and tv discover endpoints
        const [movieSearchRes, tvSearchRes] = await Promise.all([
          moviesApiFetch(`/discover/movie`, { query }),
          moviesApiFetch(`/discover/tv`, { query }),
        ]);

        const combinedRawResults = [
          ...movieSearchRes.data,
          ...tvSearchRes.data,
        ];

        // 2. Decorate with TMDB data
        const detailPromises = combinedRawResults.map((item: MoviesApiItem) =>
          tmdbFetch(`/${item.type}/${item.tmdbid}`).catch(() => null)
        );

        const tmdbDetails = await Promise.all(detailPromises);

        const decoratedResults = tmdbDetails.filter(
          (details) => details !== null
        ) as MediaItem[];

        // Add media_type for linking
        const finalResults = decoratedResults.map((item) => ({
          ...item,
          media_type: item.title ? "movie" : "tv",
        }));

        setResults(finalResults);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    performSearch();
  }, [query]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-display tracking-wider mb-6">
        Search Results for "{query}"
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <SearchResults results={results} />
      )}
    </div>
  );
};

export default SearchPage;
