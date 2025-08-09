import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MediaDetails, HistoryItem } from "../types";
import {
  Star,
  Calendar,
  Clock,
  PlayCircle,
  Globe,
  Copy,
  Check,
  Hash,
} from "lucide-react";
import TrailerModal from "./TrailerModal";
import ImageGallery from "./ImageGallery";

const DetailCard: React.FC<{ details: MediaDetails }> = ({ details }) => {
  const [isTrailerOpen, setTrailerOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isMovie = "title" in details;
  const trailer = details.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const providers = details["watch/providers"]?.results.ID;

  useEffect(() => {
    const savedHistory = localStorage.getItem("movieTvHistory");
    const history: HistoryItem[] = savedHistory ? JSON.parse(savedHistory) : [];
    const newItem = {
      id: details.id,
      title: isMovie ? details.title : details.name,
      type: isMovie ? "movie" : "tv",
      poster_path: details.poster_path,
      viewedAt: new Date().toISOString(),
      vote_average: details.vote_average,
    };
    const newHistory = [
      newItem,
      ...history.filter((item) => item.id !== newItem.id),
    ].slice(0, 20);
    localStorage.setItem("movieTvHistory", JSON.stringify(newHistory));
  }, [details, isMovie]);

  const copyDetails = () => {
    // Menyiapkan daftar pemeran untuk disalin
    const castInfo = details.credits?.cast
      ?.slice(0, 5) // Ambil 5 pemeran utama
      ?.map((actor) => `${actor.name} as ${actor.character}`)
      ?.join("\n"); // Pisahkan dengan baris baru

    const title = (isMovie ? details.title : details.name) || "";
    const detailsText = `
    ${title.toUpperCase()} (${
      (details.release_date || details.first_air_date)?.split("-")[0] || "N/A"
    })

Synopsis: ${details.overview || "N/A"}
Release Year: ${
      (details.release_date || details.first_air_date)?.split("-")[0] || "N/A"
    }
Rating: ${
      details.vote_average ? details.vote_average.toFixed(1) + "/10" : "N/A"
    }

Cast:
${castInfo || "N/A"}
    `.trim();

    navigator.clipboard.writeText(detailsText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <>
      {/* === HERO SECTION === */}
      <div className="relative w-full h-[60vh] -mt-10">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
            className="w-full h-full object-cover"
            alt={isMovie ? details.title : details.name}
          />
          <div className="absolute inset-0 bg-brand-background/60 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-center p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              className="w-40 md:w-52 rounded-lg shadow-2xl border-4 border-brand-border flex-shrink-0"
              alt="Poster"
            />
            <div className="flex flex-col items-center">
              <h1 className="text-4xl md:text-6xl font-display tracking-wider">
                {isMovie ? details.title : details.name}
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-4 mt-2 text-brand-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />{" "}
                  {
                    (details.release_date || details.first_air_date)?.split(
                      "-"
                    )[0]
                  }
                </span>
                {details.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {details.runtime} min
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Hash size={14} /> {details.id}
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} className="fill-current" />{" "}
                  {details.vote_average?.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                {trailer && (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="flex items-center gap-2 bg-brand-primary px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    <PlayCircle /> Trailer
                  </button>
                )}
                <button
                  onClick={copyDetails}
                  title="Copy Details"
                  className={`flex items-center gap-2 bg-brand-primary px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition ${
                    isCopied
                      ? "bg-green-500 text-white"
                      : "bg-brand-surface hover:bg-brand-border text-brand-text-secondary"
                  }`}
                >
                  Copy Detail{" "}
                  {isCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === KONTEN DI BAWAH HERO (DIDESAIN ULANG) === */}
      <div className="p-8 max-w-5xl mx-auto">
        {/* Synopsis Section */}
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-display tracking-wider mb-4">
            Synopsis
          </h2>
          <p className="text-brand-text-secondary leading-relaxed max-w-3xl mx-auto">
            {details.overview}
          </p>
        </section>

        {/* Cast Section */}
        {details.credits?.cast && details.credits.cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-display tracking-wider mb-6 text-center">
              Cast
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4 justify-start md:justify-center">
              {details.credits.cast.slice(0, 12).map((actor) => (
                <Link
                  to={`/person/${actor.id}`}
                  key={actor.id}
                  className="flex-shrink-0 w-28 text-center group"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-2 border-2 border-brand-border group-hover:border-brand-primary transition"
                    alt={actor.name}
                  />
                  <p className="font-semibold text-sm truncate text-brand-text-primary group-hover:text-brand-primary transition">
                    {actor.name}
                  </p>
                  <p className="text-xs text-brand-text-secondary truncate">
                    {actor.character}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Where to Watch Section */}
        {providers &&
          (providers.flatrate || providers.buy || providers.rent) && (
            <section className="mb-12 text-center">
              <h2 className="text-3xl font-display tracking-wider flex items-center justify-center gap-2 mb-4">
                <Globe size={28} /> Where to Watch (ID)
              </h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {providers.flatrate?.map((p) => (
                  <img
                    key={p.provider_id}
                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-14 h-14 rounded-lg"
                    title={`${p.provider_name} (Stream)`}
                  />
                ))}
                {providers.buy?.map((p) => (
                  <img
                    key={p.provider_id}
                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-14 h-14 rounded-lg"
                    title={`${p.provider_name} (Buy)`}
                  />
                ))}
                {providers.rent?.map((p) => (
                  <img
                    key={p.provider_id}
                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-14 h-14 rounded-lg"
                    title={`${p.provider_name} (Rent)`}
                  />
                ))}
              </div>
            </section>
          )}
      </div>

      <div className="px-8 max-w-7xl mx-auto">
        {details.images?.backdrops && details.images.backdrops.length > 0 && (
          <ImageGallery
            images={details.images.backdrops.map((img) => img.file_path)}
            type="backdrops"
          />
        )}
        {details.images?.posters && details.images.posters.length > 0 && (
          <ImageGallery
            images={details.images.posters.map((img) => img.file_path)}
            type="posters"
          />
        )}
      </div>

      {trailer && (
        <TrailerModal
          videoKey={trailer.key}
          isOpen={isTrailerOpen}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </>
  );
};

export default DetailCard;
