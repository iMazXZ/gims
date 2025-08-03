import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  type: 'backdrops' | 'posters';
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, type }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const initialImageCount = 6;

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedImages = showAll ? images : images.slice(0, initialImageCount);

  // Handle touch events for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <ImageIcon className="text-purple-400" />
        {type === 'backdrops' ? 'Backdrops' : 'Posters'}
        <span className="text-sm font-normal text-gray-300">({images.length})</span>
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displayedImages.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-video bg-white/5 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => openGallery(index)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${image}`}
              alt={`${type} ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {index + 1} / {images.length}
            </div>
          </div>
        ))}
      </div>
      
      {images.length > initialImageCount && (
        <button
          className="mt-6 flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
          onClick={toggleShowAll}
        >
          {showAll ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
          {showAll ? 'Show Less' : `Show All ${images.length} Images`}
        </button>
      )}
      
      {/* Fullscreen Gallery Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2"
            onClick={closeGallery}
          >
            <X size={24} />
          </button>
          
          {/* Navigation buttons - hidden on small screens, shown on larger screens */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 hidden sm:block"
            onClick={prevImage}
          >
            <ChevronLeft size={32} />
          </button>
          
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 hidden sm:block"
            onClick={nextImage}
          >
            <ChevronRight size={32} />
          </button>
          
          {/* Image container */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={`https://image.tmdb.org/t/p/original${images[currentIndex]}`}
              alt={`${type} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{
                maxWidth: '100vw',
                maxHeight: '100vh',
                width: 'auto',
                height: 'auto'
              }}
            />
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} of {images.length}
            </div>
            
            {/* Mobile navigation hints */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white/70 text-xs text-center sm:hidden">
              <p>Swipe left or right to navigate</p>
              <p>Tap to close</p>
            </div>
          </div>
          
          {/* Mobile tap areas for navigation */}
          <div className="absolute inset-0 flex sm:hidden">
            <div 
              className="flex-1 flex items-center justify-start pl-8"
              onClick={prevImage}
            >
              <ChevronLeft size={24} className="text-white/50" />
            </div>
            <div 
              className="flex-1"
              onClick={closeGallery}
            />
            <div 
              className="flex-1 flex items-center justify-end pr-8"
              onClick={nextImage}
            >
              <ChevronRight size={24} className="text-white/50" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;