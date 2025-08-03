import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MediaDetails } from "../types";
// Impor VIDSRC_EMBED_URL
import { tmdbFetch, VIDSRC_EMBED_URL } from "../api";
import EpisodeSelector from "../components/EpisodeSelector";
import ImageGallery from "../components/ImageGallery";
// Impor ikon Server, Bookmark, dll.
import { Calendar, Clock, Star, Bookmark, Server } from "lucide-react";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "../utils/watchlist";

// Tipe untuk server yang tersedia
type StreamingServer = "moviesapi" | "vidsrc";

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl shadow-brand-primary/20">
      <iframe
        // Tambahkan key untuk memaksa iframe memuat ulang saat src berubah
        key={src}
        src={src}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        title="Video Player"
      ></iframe>
    </div>
  );
};

const DetailPage: React.FC<{ type: "movie" | "tv" }> = ({ type }) => {
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  // State baru untuk mengelola server yang dipilih, defaultnya diubah ke 'vidsrc'
  const [selectedServer, setSelectedServer] =
    useState<StreamingServer>("vidsrc");

  useEffect(() => {
    const fetchAllDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await tmdbFetch(`/${type}/${id}`, {
          append_to_response: "videos,credits,watch/providers,images",
        });
        setDetails(data);
        setInWatchlist(isInWatchlist(Number(id)));

        if (type === "tv") {
          const lastWatched = localStorage.getItem(`last-watched-${id}`);
          if (lastWatched) {
            const { season, episode } = JSON.parse(lastWatched);
            setSelectedSeason(season);
            setSelectedEpisode(episode);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllDetails();
  }, [id, type]);

  useEffect(() => {
    if (type === "tv" && id) {
      localStorage.setItem(
        `last-watched-${id}`,
        JSON.stringify({ season: selectedSeason, episode: selectedEpisode })
      );
    }
  }, [selectedSeason, selectedEpisode, id, type]);

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
  };

  const toggleWatchlist = () => {
    if (!details) return;
    if (inWatchlist) {
      removeFromWatchlist(details.id);
    } else {
      addToWatchlist({ ...details, media_type: type });
    }
    setInWatchlist(!inWatchlist);
  };

  // Logika untuk membuat URL video berdasarkan server yang dipilih
  const getVideoSrc = (): string => {
    if (!id) return "";
    if (selectedServer === "moviesapi") {
      return type === "movie"
        ? `https://moviesapi.to/movie/${id}`
        : `https://moviesapi.to/tv/${id}-${selectedSeason}-${selectedEpisode}`;
    }
    if (selectedServer === "vidsrc") {
      // Tambahkan parameter ds_lang=id untuk subtitle Bahasa Indonesia
      return type === "movie"
        ? `${VIDSRC_EMBED_URL}/movie?tmdb=${id}&ds_lang=id`
        : `${VIDSRC_EMBED_URL}/tv?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode}&ds_lang=id`;
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Detail tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {details.backdrop_path && (
        <div className="absolute top-0 left-0 w-full h-[60vh] -z-10">
          <img
            src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
            className="w-full h-full object-cover"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background to-brand-background/50" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <img
              src={
                details.poster_path
                  ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                  : "https://placehold.co/500x750/161B22/7D8590?text=No+Poster"
              }
              alt={details.title || details.name}
              className="rounded-lg shadow-2xl w-64 lg:w-full"
            />
            <div className="mt-4 text-center lg:text-left w-full">
              <h1 className="text-4xl font-display tracking-wider">
                {details.title || details.name}
              </h1>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-4 gap-y-1 mt-2 text-brand-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />{" "}
                  {
                    (details.release_date || details.first_air_date)?.split(
                      "-"
                    )[0]
                  }
                </span>
                {details.runtime && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {details.runtime} min
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <Star size={14} className="fill-current" />{" "}
                  {details.vote_average?.toFixed(1)}
                </span>
              </div>
              <button
                onClick={toggleWatchlist}
                className={`mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  inWatchlist
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-brand-surface hover:bg-brand-border"
                }`}
              >
                <Bookmark
                  size={20}
                  className={inWatchlist ? "fill-current" : ""}
                />
                {inWatchlist ? "Hapus dari Watchlist" : "Tambah ke Watchlist"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-3xl font-display tracking-wider mb-4">
              Tonton Sekarang
            </h2>

            {/* Komponen Pilihan Server */}
            <div className="mb-4 p-2 bg-brand-surface rounded-lg flex items-center gap-2">
              <Server
                size={18}
                className="text-brand-text-secondary flex-shrink-0"
              />
              <button
                onClick={() => setSelectedServer("moviesapi")}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                  selectedServer === "moviesapi"
                    ? "bg-brand-primary text-white"
                    : "hover:bg-brand-border"
                }`}
              >
                Server 1
              </button>
              <button
                onClick={() => setSelectedServer("vidsrc")}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                  selectedServer === "vidsrc"
                    ? "bg-brand-primary text-white"
                    : "hover:bg-brand-border"
                }`}
              >
                Server 2
              </button>
            </div>

            <VideoPlayer src={getVideoSrc()} />

            {type === "tv" && details.seasons && (
              <EpisodeSelector
                seasons={details.seasons}
                selectedSeason={selectedSeason}
                selectedEpisode={selectedEpisode}
                onSeasonChange={handleSeasonChange}
                onEpisodeChange={setSelectedEpisode}
              />
            )}
            <div className="mt-8">
              <h3 className="text-2xl font-display tracking-wider mb-2">
                Sinopsis
              </h3>
              <p className="text-brand-text-secondary leading-relaxed">
                {details.overview}
              </p>
            </div>
            {details.credits?.cast && details.credits.cast.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-display tracking-wider mb-4">
                  Pemeran
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                  {details.credits.cast.slice(0, 10).map((actor) => (
                    <Link
                      to={`/person/${actor.id}`}
                      key={actor.id}
                      className="flex-shrink-0 w-24 text-center group"
                    >
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "https://placehold.co/185x185/161B22/7D8590?text=N/A"
                        }
                        className="w-20 h-20 object-cover rounded-full mx-auto mb-2 border-2 border-brand-border group-hover:border-brand-primary transition"
                        alt={actor.name}
                      />
                      <p className="font-semibold text-sm truncate text-brand-text-primary group-hover:text-brand-primary transition">
                        {actor.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12">
          {details.images?.backdrops && details.images.backdrops.length > 0 && (
            <ImageGallery
              images={details.images.backdrops.map((img) => img.file_path)}
              type="backdrops"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
