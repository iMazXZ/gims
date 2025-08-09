import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import { SearchResult } from "../types";
import SearchResults from "../components/SearchResults";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const query = searchParams.get("q");

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await apiFetch(`/search/multi`, { query });
        setResults(
          (data.results as SearchResult[]).filter(
            (r) => r.media_type === "movie" || r.media_type === "tv"
          )
        );
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
