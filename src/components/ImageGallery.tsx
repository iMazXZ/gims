import React, { useState } from "react";
import { ChevronsDown, ChevronsUp } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  type: "backdrops" | "posters";
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, type }) => {
  const [showAll, setShowAll] = useState(false);

  const initialImageCount = 6;
  const displayedImages = showAll ? images : images.slice(0, initialImageCount);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-display tracking-wider mb-4">
        {type === "backdrops" ? "Backdrops" : "Posters"}
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayedImages.map((image, index) => (
          <a
            key={index}
            href={`https://image.tmdb.org/t/p/original${image}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative ${
              type === "backdrops" ? "aspect-video" : "aspect-[2/3]"
            } bg-brand-surface rounded-lg overflow-hidden cursor-pointer border border-brand-border`}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${image}`}
              alt={`${type} #${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white font-bold text-xs uppercase">
                View Full
              </p>
            </div>
          </a>
        ))}
      </div>

      {images.length > initialImageCount && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 mx-auto px-4 py-2 text-sm bg-brand-surface hover:bg-brand-border text-brand-text-secondary rounded-lg transition-colors"
          >
            {showAll ? <ChevronsUp size={16} /> : <ChevronsDown size={16} />}
            {showAll ? "Show Less" : `Show All ${images.length} Images`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
