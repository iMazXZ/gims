import React from 'react';
import { Star, Calendar, Clock, Copy, Film, Tv, Hash, Award, Users, Languages } from 'lucide-react';
import { MediaDetails } from '../types';
import ImageGallery from './ImageGallery';

interface DetailCardProps {
  details: MediaDetails;
}

const DetailCard: React.FC<DetailCardProps> = ({ details }) => {
  const isMovie = 'title' in details;

  const translateText = async (text: string): Promise<string> => {
    try {
      // Using MyMemory Translation API (free, no API key required)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|id`
      );
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
      
      // Fallback: try Google Translate API alternative
      const fallbackResponse = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q=${encodeURIComponent(text)}`
      );
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData && fallbackData[0] && fallbackData[0][0]) {
        return fallbackData[0][0][0];
      }
      
      return text; // Return original if translation fails
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Return original text if translation fails
    }
  };

  const copyDetails = async () => {
    // Show loading notification
    const loadingNotification = document.createElement('div');
    loadingNotification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 flex items-center gap-2';
    loadingNotification.innerHTML = `
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <span>Translating to Bahasa Indonesia...</span>
    `;
    document.body.appendChild(loadingNotification);

    try {
      // Translate the synopsis to Bahasa Indonesia
      const translatedSynopsis = details.overview ? await translateText(details.overview) : 'N/A';
      
      const detailsText = `
${isMovie ? 'Film' : 'Acara TV'}: ${isMovie ? details.title : details.name}
Sinopsis: ${translatedSynopsis}
${isMovie ? 'Tanggal Rilis' : 'Tanggal Tayang Perdana'}: ${isMovie ? details.release_date : details.first_air_date}
${isMovie && details.runtime ? `Durasi: ${details.runtime} menit` : ''}
Pemeran: ${details.cast ? details.cast.map(actor => actor.name).join(', ') : 'N/A'}
Rating: ${details.vote_average ? details.vote_average.toFixed(1) + '/10' : 'N/A'}
      `.trim();

      await navigator.clipboard.writeText(detailsText);
      
      // Remove loading notification
      document.body.removeChild(loadingNotification);
      
      // Show success notification
      const successNotification = document.createElement('div');
      successNotification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 flex items-center gap-2';
      successNotification.innerHTML = `
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <span>Detail berhasil disalin dalam Bahasa Indonesia!</span>
      `;
      document.body.appendChild(successNotification);
      
      setTimeout(() => {
        successNotification.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(successNotification)) {
            document.body.removeChild(successNotification);
          }
        }, 300);
      }, 3000);
      
    } catch (error) {
      // Remove loading notification
      if (document.body.contains(loadingNotification)) {
        document.body.removeChild(loadingNotification);
      }
      
      console.error('Failed to copy details: ', error);
      
      // Show error notification
      const errorNotification = document.createElement('div');
      errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 flex items-center gap-2';
      errorNotification.innerHTML = `
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span>Gagal menyalin detail. Silakan coba lagi.</span>
      `;
      document.body.appendChild(errorNotification);
      
      setTimeout(() => {
        errorNotification.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(errorNotification)) {
            document.body.removeChild(errorNotification);
          }
        }, 300);
      }, 3000);
    }
  };

  return (
    <div className="w-full mt-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
        {details.backdrop_path && (
          <div className="relative h-96 sm:h-[500px]">
            <img
              className="w-full h-full object-cover"
              src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
              alt={isMovie ? details.title : details.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
            {details.poster_path && (
              <div className="flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
                  alt={isMovie ? details.title : details.name}
                  className="w-32 sm:w-48 rounded-xl shadow-2xl border-4 border-white/20"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {isMovie ? details.title : details.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  {isMovie ? <Film size={16} /> : <Tv size={16} />}
                  <span className="text-sm font-medium">{isMovie ? 'Movie' : 'TV Show'}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Hash size={16} />
                  <span className="text-sm">{details.id}</span>
                </div>
                
                {details.vote_average !== undefined && (
                  <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-sm font-semibold">{details.vote_average.toFixed(1)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Calendar size={16} />
                  <span className="text-sm">{isMovie ? details.release_date : details.first_air_date}</span>
                </div>
                
                {isMovie && details.runtime && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <Clock size={16} />
                    <span className="text-sm">{details.runtime} min</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={copyDetails}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Languages size={18} />
                Salin Detail (Bahasa Indonesia)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        {/* Synopsis */}
        {details.overview && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="text-purple-400" />
              Synopsis
            </h2>
            <p className="text-gray-200 leading-relaxed text-lg">{details.overview}</p>
          </div>
        )}

        {/* Cast */}
        {details.cast && details.cast.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="text-purple-400" />
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {details.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="group text-center">
                  <div className="relative mb-3">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full aspect-square object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white/50">{actor.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{actor.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Galleries */}
        {details.backdrops && details.backdrops.length > 0 && (
          <ImageGallery images={details.backdrops} type="backdrops" />
        )}
        
        {details.posters && details.posters.length > 0 && (
          <ImageGallery images={details.posters} type="posters" />
        )}
      </div>
    </div>
  );
};

export default DetailCard;