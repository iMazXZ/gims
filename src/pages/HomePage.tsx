import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MediaItem } from "../types";
import { tmdbFetch, moviesApiFetch } from "../api";
import Hero from "../components/Hero";
import MediaRow from "../components/MediaRow";
import { ChevronRight } from "lucide-react";

// Mendapatkan tahun saat ini secara dinamis
const currentYear = new Date().getFullYear();

// Memperbarui kategori Drama Asia dengan filter tahun dan popularitas
const categories = [
  {
    title: "Film Populer",
    endpoint: "/movie/popular",
    type: "movie" as const,
    params: {},
  },
  {
    title: "Update Acara TV Terbaru",
    endpoint: "/discover/tv",
    type: "tv" as const,
    source: "moviesapi",
    params: {},
  },
  {
    title: "Drama Korea Populer Terbaru",
    endpoint: "/discover/tv",
    type: "tv" as const,
    params: {
      with_origin_country: "KR",
      first_air_date_year: currentYear,
      sort_by: "popularity.desc",
    },
  },
  {
    title: "Drama China Populer Terbaru",
    endpoint: "/discover/tv",
    type: "tv" as const,
    params: {
      with_origin_country: "CN",
      first_air_date_year: currentYear,
      sort_by: "popularity.desc",
    },
  },
  {
    title: "Drama Thailand Populer Terbaru",
    endpoint: "/discover/tv",
    type: "tv" as const,
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
        } catch (e) {
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
            return moviesApiFetch(cat.endpoint, {
              ordering: "last_upload_date",
              direction: "desc",
            });
          }
          // Menggunakan parameter yang didefinisikan di array kategori
          return tmdbFetch(cat.endpoint, cat.params);
        });

        const allCategoryRes = await Promise.all(categoryPromises);
        const decoratedData: Record<string, MediaItem[]> = {};

        for (let i = 0; i < categories.length; i++) {
          const cat = categories[i];
          let itemsToDecorate: MediaItem[];

          if (cat.source === "moviesapi") {
            const moviesApiItems: any[] = allCategoryRes[i].data;
            const detailPromises = moviesApiItems
              .slice(0, 9)
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
            const initialItems = allCategoryRes[i].results.slice(0, 9);
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
              {/* Tautan "Lihat Semua" akan mengarah ke halaman discover dengan filter negara */}
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
