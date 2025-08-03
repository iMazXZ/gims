import React, { useEffect, useState } from "react";
import { MediaItem } from "../types";
import { apiFetch } from "../api";
import MediaRow from "../components/MediaRow";
import Hero from "../components/Hero";

const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTv, setPopularTv] = useState<MediaItem[]>([]);
  const [upcoming, setUpcoming] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendingRes, popularMoviesRes, popularTvRes, upcomingRes] =
          await Promise.all([
            apiFetch("/trending/all/week"),
            apiFetch("/movie/popular"),
            apiFetch("/tv/popular"),
            apiFetch("/movie/upcoming"),
          ]);
        setTrending(trendingRes.results);
        setPopularMovies(popularMoviesRes.results);
        setPopularTv(popularTvRes.results);
        setUpcoming(upcomingRes.results);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
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

  return (
    <div className="animate-fade-in-up">
      {trending.length > 0 && <Hero item={trending[0]} />}
      <div className="p-4 md:p-8 space-y-10">
        <MediaRow title="Trending This Week" items={trending} />
        <MediaRow title="Popular Movies" items={popularMovies} />
        <MediaRow title="Popular TV Shows" items={popularTv} />
        <MediaRow title="Upcoming Movies" items={upcoming} />
      </div>
    </div>
  );
};

export default HomePage;
