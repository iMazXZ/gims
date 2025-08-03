import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MediaItem, MoviesApiItem } from "../types";
import { tmdbFetch, moviesApiFetch } from "../api";
import Hero from "../components/Hero";
import MediaRow from "../components/MediaRow";
import { ChevronRight } from "lucide-react";

// Memperbarui nama kategori agar lebih akurat
const categories = [
  { title: "Film Populer", endpoint: "/movie/popular", type: "movie" as const },
  {
    title: "Update Acara TV Terbaru",
    endpoint: "/discover/tv",
    type: "tv" as const,
    source: "moviesapi",
  }, // Menandai sumber API
  {
    title: "Film Rating Tertinggi",
    endpoint: "/movie/top_rated",
    type: "movie" as const,
  },
  {
    title: "Akan Tayang di Bioskop",
    endpoint: "/movie/upcoming",
    type: "movie" as const,
  },
];

const HomePage: React.FC = () => {
  const [trendingItems, setTrendingItems] = useState<MediaItem[]>([]);
  const [categoryData, setCategoryData] = useState<Record<string, MediaItem[]>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk "menghias" data TMDB dengan info kualitas dari moviesapi.club
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
          // Logika baru: Cek sumber API untuk setiap kategori
          if (cat.source === "moviesapi") {
            // Jika sumbernya moviesapi, ambil dari sana dulu
            return moviesApiFetch(cat.endpoint, {
              ordering: "last_upload_date",
              direction: "desc",
            });
          }
          // Jika tidak, ambil dari TMDB seperti biasa
          return tmdbFetch(cat.endpoint);
        });

        const allCategoryRes = await Promise.all(categoryPromises);
        const decoratedData: Record<string, MediaItem[]> = {};

        for (let i = 0; i < categories.length; i++) {
          const cat = categories[i];
          let itemsToDecorate: MediaItem[];

          if (cat.source === "moviesapi") {
            // Jika dari moviesapi, kita perlu mengambil detail TMDB
            const moviesApiItems: MoviesApiItem[] = allCategoryRes[i].data;
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
            // Jika dari TMDB, kita hias dengan info kualitas
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
              <Link
                to={`/discover/${cat.type}`}
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
