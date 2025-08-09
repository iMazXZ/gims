import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MediaItem, MoviesApiItem } from "../types";
import { tmdbFetch, moviesApiFetch } from "../api";
import Hero from "../components/Hero";
import MediaRow from "../components/MediaRow";
import { ChevronRight } from "lucide-react";

const currentYear = new Date().getFullYear();

type CategoryParams = {
  with_origin_country?: string;
  first_air_date_year?: number;
  sort_by?: string;
};

// Mendefinisikan tipe yang lebih ketat untuk kategori
const categories: {
  title: string;
  endpoint: string;
  type: "movie" | "tv";
  source?: string;
  params: CategoryParams;
  ordering?: "upload_date" | "last_upload_date"; // Properti untuk ordering API
}[] = [
  {
    title: "Latest Movie",
    endpoint: "/discover/movie",
    type: "movie",
    source: "moviesapi",
    params: {},
    ordering: "upload_date",
  },
  {
    title: "Latest TV Show",
    endpoint: "/discover/tv",
    type: "tv",
    source: "moviesapi",
    params: {},
    ordering: "last_upload_date",
  },
  {
    title: "Film Populer", // Baris baru ditambahkan
    endpoint: "/movie/popular",
    type: "movie",
    params: {}, // Tanpa 'source' akan otomatis mengambil dari TMDB
  },
  {
    title: "Drama Korea",
    endpoint: "/discover/tv",
    type: "tv",
    params: {
      with_origin_country: "KR",
      first_air_date_year: currentYear,
      sort_by: "popularity.desc",
    },
  },
  {
    title: "Drama China",
    endpoint: "/discover/tv",
    type: "tv",
    params: {
      with_origin_country: "CN",
      first_air_date_year: currentYear,
      sort_by: "popularity.desc",
    },
  },
  {
    title: "Drama Thailand",
    endpoint: "/discover/tv",
    type: "tv",
    params: {
      with_origin_country: "TH",
      first_air_date_year: currentYear,
      sort_by: "popularity.desc",
    },
  },
];

const HomePage: React.FC = () => {
  const [trendingItems, setTrendingItems] = useState<MediaItem[]>([]);
  const [categoryData, setCategoryData] = useState<Record<string, MediaItem[]>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  const decorateWithQuality = useCallback(
    async (
      items: MediaItem[],
      mediaType: "movie" | "tv"
    ): Promise<MediaItem[]> => {
      const qualityPromises = items.map(async (item) => {
        try {
          const qualityRes = await moviesApiFetch(`/discover/${mediaType}`, {
            tmdbid: String(item.id),
          });
          const quality = qualityRes.data[0]?.quality || null;
          return { ...item, quality, media_type: mediaType };
        } catch {
          return { ...item, media_type: mediaType };
        }
      });
      return Promise.all(qualityPromises);
    },
    []
  );

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const trendingRes = await tmdbFetch("/trending/all/week");
        setTrendingItems(trendingRes.results);

        const categoryPromises = categories.map((cat) => {
          if (cat.source === "moviesapi") {
            // Menggunakan properti 'ordering' yang dinamis
            return moviesApiFetch(cat.endpoint, {
              ordering: cat.ordering,
              direction: "desc",
            });
          }
          return tmdbFetch(cat.endpoint, cat.params);
        });

        const allCategoryRes = await Promise.all(categoryPromises);
        const decoratedData: Record<string, MediaItem[]> = {};

        for (let i = 0; i < categories.length; i++) {
          const cat = categories[i];
          let itemsToDecorate: MediaItem[];

          if (cat.source === "moviesapi") {
            const moviesApiItems: MoviesApiItem[] = allCategoryRes[i].data;
            const detailPromises = moviesApiItems
              .slice(0, 10)
              .map(async (item) => {
                try {
                  const tmdbDetail = await tmdbFetch(
                    `/${cat.type}/${item.tmdbid}`
                  );
                  return {
                    ...tmdbDetail,
                    quality: item.quality,
                    media_type: cat.type,
                  };
                } catch {
                  return null;
                }
              });
            itemsToDecorate = (await Promise.all(detailPromises)).filter(
              (item): item is MediaItem => item !== null
            );
          } else {
            const initialItems = allCategoryRes[i].results.slice(0, 10);
            itemsToDecorate = await decorateWithQuality(initialItems, cat.type);
          }
          decoratedData[cat.title] = itemsToDecorate;
        }

        setCategoryData(decoratedData);
      } catch (error) {
        console.error("Gagal mengambil data halaman depan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [decorateWithQuality]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <Hero items={trendingItems.slice(0, 5)} />
      <div className="p-4 md:p-8 space-y-10">
        {categories.map((cat) => (
          <section key={cat.title}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-display tracking-wider">
                {cat.title}
              </h2>
              <Link
                to={`/discover/${cat.type}${
                  cat.params.with_origin_country
                    ? `?region=${cat.params.with_origin_country}`
                    : ""
                }`}
                className="flex items-center gap-1 text-sm text-brand-text-secondary hover:text-brand-primary transition-colors"
              >
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </div>
            <MediaRow items={categoryData[cat.title] || []} />
          </section>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
