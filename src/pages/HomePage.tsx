import React, { useEffect, useState } from "react";
import { MediaItem, MoviesApiItem } from "../types";
import { moviesApiFetch, tmdbFetch } from "../api";
import MediaRow from "../components/MediaRow";
import Hero from "../components/Hero";

const HomePage: React.FC = () => {
  const [latestMovies, setLatestMovies] = useState<MediaItem[]>([]);
  const [latestTvShows, setLatestTvShows] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndDecorateMedia = async (
      mediaType: "movie" | "tv"
    ): Promise<MediaItem[]> => {
      // 1. Fetch list from moviesapi.club
      const discoverEndpoint =
        mediaType === "movie" ? "/discover/movie" : "/discover/tv";
      const discoverRes = await moviesApiFetch(discoverEndpoint, {
        direction: "desc",
        ordering: "upload_date",
      });

      // 2. Create a list of promises to fetch details for each item from TMDB
      const detailPromises = discoverRes.data.map((item: MoviesApiItem) =>
        tmdbFetch(`/${mediaType}/${item.tmdbid}`).catch((e) => {
          console.error(
            `Failed to fetch TMDB details for ${mediaType} ID ${item.tmdbid}`,
            e
          );
          return null; // Return null if a fetch fails
        })
      );

      // 3. Wait for all TMDB fetches to complete
      const tmdbDetails = await Promise.all(detailPromises);

      // 4. Filter out any failed fetches and combine data
      const decoratedMedia = tmdbDetails.filter(
        (details) => details !== null
      ) as MediaItem[];

      return decoratedMedia;
    };

    const fetchAll = async () => {
      try {
        const [movies, tvShows] = await Promise.all([
          fetchAndDecorateMedia("movie"),
          fetchAndDecorateMedia("tv"),
        ]);
        setLatestMovies(movies);
        setLatestTvShows(tvShows);
      } catch (error) {
        console.error("Failed to fetch and decorate homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const heroItem = latestMovies[0] || latestTvShows[0];

  return (
    <div className="animate-fade-in-up">
      {heroItem && <Hero item={heroItem} />}
      <div className="p-4 md:p-8 space-y-10">
        <MediaRow title="Latest Movies" items={latestMovies} />
        <MediaRow title="Latest TV Shows" items={latestTvShows} />
      </div>
    </div>
  );
};

export default HomePage;
