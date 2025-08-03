import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { MediaItem } from "../types";
import { tmdbFetch, moviesApiFetch } from "../api";
import MediaGrid from "../components/MediaGrid";
import FilterControls, { Filters } from "../components/FilterControls";

const DiscoverPage: React.FC = () => {
  const { type } = useParams<{ type: "movie" | "tv" }>();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState<Filters>({
    genre: "all",
    year: "all",
    sort_by: "popularity.desc",
    region: "all",
  });

  const decorateWithQuality = useCallback(
    async (
      tmdbItems: MediaItem[],
      mediaType: "movie" | "tv"
    ): Promise<MediaItem[]> => {
      const qualityPromises = tmdbItems.map(async (item) => {
        try {
          const qualityRes = await moviesApiFetch(`/discover/${mediaType}`, {
            tmdbid: String(item.id),
          });
          const quality = qualityRes.data[0]?.quality || null;
          return { ...item, quality, media_type: mediaType };
        } catch (e) {
          return { ...item, media_type: mediaType };
        }
      });
      return Promise.all(qualityPromises);
    },
    []
  );

  const fetchItems = useCallback(
    async (fetchPage: number, filters: Filters) => {
      if (!type) return;
      if (fetchPage === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      const params: Record<string, string | number> = {
        sort_by: filters.sort_by,
        page: fetchPage,
      };
      if (filters.genre !== "all") params.with_genres = filters.genre;
      if (filters.year !== "all") {
        if (type === "movie") params.primary_release_year = filters.year;
        if (type === "tv") params.first_air_date_year = filters.year;
      }
      if (filters.region !== "all") params.with_origin_country = filters.region;

      try {
        const data = await tmdbFetch(`/discover/${type}`, params);
        const decoratedItems = await decorateWithQuality(data.results, type);

        setItems((prev) =>
          fetchPage === 1 ? decoratedItems : [...prev, ...decoratedItems]
        );
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
      } catch (err) {
        setError("Gagal memuat konten. Silakan coba lagi.");
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [type, decorateWithQuality]
  );

  useEffect(() => {
    setItems([]);
    setPage(1);
    fetchItems(1, activeFilters);
  }, [type, activeFilters, fetchItems]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchItems(nextPage, activeFilters);
    }
  };

  const title = type === "movie" ? "Jelajahi Film" : "Jelajahi Acara TV";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-display tracking-wider mb-6">{title}</h1>

      {type && (
        <FilterControls mediaType={type} onFilterChange={setActiveFilters} />
      )}

      {isLoading ? (
        <p>Memuat...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <MediaGrid items={items} />
          {items.length > 0 && page < totalPages && (
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
          {items.length === 0 && !isLoading && (
            <p>Tidak ada hasil yang cocok dengan filter Anda.</p>
          )}
        </>
      )}
    </div>
  );
};

export default DiscoverPage;
