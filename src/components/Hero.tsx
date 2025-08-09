import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { MediaItem, Genre, Country } from "../types";
import { PlayCircle, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { fetchGenres, fetchCountries } from "../api";

interface HeroProps {
  items: MediaItem[];
}

const Hero: React.FC<HeroProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const getGenresAndCountries = async () => {
      const [movieGenreData, tvGenreData, countryData] = await Promise.all([
        fetchGenres("movie"),
        fetchGenres("tv"),
        fetchCountries(),
      ]);
      setMovieGenres(movieGenreData.genres);
      setTvGenres(tvGenreData.genres);
      setCountries(countryData);
    };
    getGenresAndCountries();
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  useEffect(() => {
    if (items.length > 1) {
      const timer = setInterval(goToNext, 7000);
      return () => clearInterval(timer);
    }
  }, [items.length, goToNext]);

  const getGenreNames = (
    genreIds: number[] = [],
    mediaType?: "movie" | "tv"
  ) => {
    const genreMap = mediaType === "tv" ? tvGenres : movieGenres;
    return genreIds
      .map((id) => genreMap.find((g) => g.id === id))
      .filter((g): g is Genre => g !== undefined)
      .slice(0, 2);
  };

  const getCountry = (countryCodes: string[] = []) => {
    if (!countryCodes || countryCodes.length === 0 || countries.length === 0)
      return null;
    return countries.find((c) => c.iso_3166_1 === countryCodes[0]) || null;
  };

  if (
    !items ||
    items.length === 0 ||
    movieGenres.length === 0 ||
    tvGenres.length === 0 ||
    countries.length === 0
  ) {
    return (
      <div className="w-full h-[60vh] bg-brand-surface animate-pulse"></div>
    );
  }

  return (
    <div className="w-full h-[60vh] relative overflow-hidden bg-brand-surface">
      <div
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => {
          const itemMediaType =
            item.media_type || (item.title ? "movie" : "tv");
          const genres = getGenreNames(item.genre_ids, itemMediaType);
          const country = getCountry(item.origin_country);
          const releaseYear = (item.release_date || item.first_air_date)?.split(
            "-"
          )[0];

          return (
            <div key={item.id} className="w-full h-full flex-shrink-0 relative">
              <img
                src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
                className="absolute inset-0 w-full h-full object-cover"
                alt={item.title || item.name}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-background via-brand-background/60 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-16 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-display tracking-wider text-shadow-lg">
                  {item.title || item.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
                  <div className="flex items-center gap-2">
                    {genres.map((genre) => (
                      <Link
                        key={genre.id}
                        to={`/discover/${itemMediaType}?genre=${
                          genre.id
                        }&genre_name=${encodeURIComponent(genre.name)}`}
                        className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm hover:bg-brand-primary transition-colors"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-brand-text-primary font-semibold">
                    {item.vote_average && (
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Star size={16} className="fill-current" />{" "}
                        {item.vote_average.toFixed(1)} / 10
                      </span>
                    )}
                    {releaseYear && (
                      <Link
                        to={`/discover/${itemMediaType}?year=${releaseYear}`}
                        className="hover:text-brand-primary"
                      >
                        {releaseYear}
                      </Link>
                    )}
                    {country && (
                      <Link
                        to={`/discover/${itemMediaType}?region=${
                          country.iso_3166_1
                        }&region_name=${encodeURIComponent(
                          country.english_name
                        )}`}
                        className="hover:text-brand-primary"
                      >
                        {country.english_name}
                      </Link>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-brand-text-secondary text-lg line-clamp-3 text-shadow">
                  {item.overview}
                </p>
                <Link
                  to={`/${itemMediaType}/${item.id}`}
                  className="mt-6 flex items-center gap-2 bg-brand-primary w-fit px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  <PlayCircle /> Lihat Detail
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-brand-primary transition z-20"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-brand-primary transition z-20"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {items.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
              currentIndex === index
                ? "bg-brand-primary scale-125"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
