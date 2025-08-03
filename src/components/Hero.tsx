import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { MediaItem } from "../types";
import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

// Mengubah props untuk menerima array item
interface HeroProps {
  items: MediaItem[];
}

const Hero: React.FC<HeroProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fungsi untuk pindah ke slide berikutnya, dibungkus useCallback
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  // Fungsi untuk pindah ke slide sebelumnya
  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  // Efek untuk slideshow otomatis
  useEffect(() => {
    if (items.length > 1) {
      const timer = setInterval(goToNext, 7000); // Ganti slide setiap 7 detik
      return () => clearInterval(timer); // Bersihkan timer saat komponen unmount
    }
  }, [items.length, goToNext]);

  // Jika tidak ada item, jangan render apapun
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-[60vh] relative overflow-hidden bg-brand-surface">
      {/* Kontainer untuk semua slide */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              className="absolute inset-0 w-full h-full object-cover"
              alt={item.title || item.name}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-background via-brand-background/60 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-16 max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-display tracking-wider text-shadow-lg animate-fade-in-up">
                {item.title || item.name}
              </h1>
              <p
                className="mt-2 text-brand-text-secondary text-lg line-clamp-3 text-shadow animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                {item.overview}
              </p>
              <Link
                to={`/${item.media_type || (item.title ? "movie" : "tv")}/${
                  item.id
                }`}
                className="mt-4 flex items-center gap-2 bg-brand-primary w-fit px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <PlayCircle /> Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Navigasi */}
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

      {/* Indikator Titik */}
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
