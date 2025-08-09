import React, { useState, useEffect } from "react";
import { getWatchlist, removeFromWatchlist } from "../utils/watchlist";
import { MediaItem } from "../types";
import { Link } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";

const WatchlistPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);

  useEffect(() => {
    // Muat watchlist saat komponen pertama kali dirender
    setWatchlist(getWatchlist());
  }, []);

  const handleRemove = (id: number) => {
    removeFromWatchlist(id);
    // Perbarui state untuk me-render ulang UI
    setWatchlist(getWatchlist());
  };

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-20 text-brand-text-secondary max-w-7xl mx-auto px-4">
        <Bookmark size={64} className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-text-primary">
          Daftar Tontonan Anda Kosong
        </h2>
        <p>Tambahkan film dan acara TV untuk melihatnya di sini.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in-up">
      <h1 className="text-4xl font-display tracking-wider mb-6">
        Daftar Tontonan Saya
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {watchlist.map((item) => (
          <div key={item.id} className="group relative">
            <Link
              to={`/${item.media_type || (item.title ? "movie" : "tv")}/${
                item.id
              }`}
            >
              <div className="relative aspect-[2/3] bg-brand-surface rounded-lg overflow-hidden border border-brand-border transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-brand-primary/20">
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-text-secondary bg-brand-surface">
                    <span>Tidak Ada Gambar</span>
                  </div>
                )}
              </div>
              <h3 className="mt-2 font-semibold text-brand-text-primary truncate">
                {item.title || item.name}
              </h3>
            </Link>
            <button
              onClick={() => handleRemove(item.id)}
              className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Hapus dari daftar tontonan"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistPage;
