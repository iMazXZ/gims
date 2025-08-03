import React from "react";
import { Link } from "react-router-dom";
import { MediaItem } from "../types";
import { PlayCircle } from "lucide-react";

const Hero: React.FC<{ item: MediaItem }> = ({ item }) => {
  const mediaType = item.media_type || (item.title ? "movie" : "tv");
  return (
    <div className="w-full h-[50vh] relative">
      <img
        src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
        className="absolute inset-0 w-full h-full object-cover"
        alt={item.title || item.name}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-background via-brand-background/50 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-16 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-display tracking-wider">
          {item.title || item.name}
        </h1>
        <p className="mt-2 text-brand-text-secondary text-lg line-clamp-3">
          {item.overview}
        </p>
        <Link
          to={`/${mediaType}/${item.id}`}
          className="mt-4 flex items-center gap-2 bg-brand-primary w-fit px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          <PlayCircle /> View Details
        </Link>
      </div>
    </div>
  );
};

export default Hero;
