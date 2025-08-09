import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { tmdbFetch } from "../api";
import { SearchResult } from "../types";
import SearchResults from "../components/SearchResults";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const query = searchParams.get("q");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const performSearch = useCallback(
    async (searchQuery: string, searchPage: number) => {
      if (searchPage === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        // Cek apakah query adalah ID numerik
        const isNumericId = /^\d+$/.test(searchQuery);

        // Jika ini adalah ID, coba cari langsung berdasarkan ID (hanya di halaman pertama)
        if (isNumericId && searchPage === 1) {
          // Coba fetch sebagai movie dan tv show secara bersamaan
          const [movieResult, tvResult] = await Promise.allSettled([
            tmdbFetch(`/movie/${searchQuery}`),
            tmdbFetch(`/tv/${searchQuery}`),
          ]);

          const foundResults: SearchResult[] = [];
          // Jika movie ditemukan, tambahkan ke hasil
          if (movieResult.status === "fulfilled" && movieResult.value.id) {
            foundResults.push({ ...movieResult.value, media_type: "movie" });
          }
          // Jika TV show ditemukan, tambahkan ke hasil
          if (tvResult.status === "fulfilled" && tvResult.value.id) {
            foundResults.push({ ...tvResult.value, media_type: "tv" });
          }

          setResults(foundResults);
          setTotalPages(foundResults.length > 0 ? 1 : 0); // Pencarian ID hanya punya 1 halaman
        } else if (!isNumericId) {
          // Jika bukan ID, lakukan pencarian teks multi
          const data = await tmdbFetch(`/search/multi`, {
            query: searchQuery,
            page: String(searchPage),
          });

          const filteredResults = data.results.filter(
            (r: any) =>
              (r.media_type === "movie" || r.media_type === "tv") &&
              r.poster_path
          );

          setResults((prev) =>
            searchPage === 1 ? filteredResults : [...prev, ...filteredResults]
          );
          setTotalPages(data.total_pages);
        } else {
          // Jika ini adalah ID tapi bukan halaman pertama, jangan lakukan apa-apa
          setResults([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Pencarian gagal:", error);
        setResults([]); // Pastikan hasil kosong jika ada error
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    if (query && query.length > 0) {
      // Izinkan pencarian ID meskipun kurang dari 3 karakter
      setPage(1);
      setResults([]);
      performSearch(query, 1);
    } else {
      setResults([]);
    }
  }, [query, performSearch]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      if (query) {
        performSearch(query, nextPage);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-display tracking-wider mb-6">
        Hasil Pencarian untuk "{query}"
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <SearchResults results={results} />
          {/* Tombol "Muat Lebih Banyak" hanya muncul untuk pencarian teks */}
          {results.length > 0 &&
            page < totalPages &&
            !/^\d+$/.test(query || "") && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-brand-primary px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-500"
                >
                  {isLoadingMore ? "Memuat..." : "Muat Lebih Banyak"}
                </button>
              </div>
            )}
          {results.length === 0 && !isLoading && query && (
            <p className="text-center text-brand-text-secondary mt-10">
              Tidak ada hasil yang ditemukan untuk "{query}".
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
