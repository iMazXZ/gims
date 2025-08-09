import React, { useState, useEffect } from 'react';
import { Season, Episode } from '../types';
import { fetchTvSeason } from '../api';
import { PlayCircle } from 'lucide-react';

interface EpisodeGuideProps {
  tvId: string;
  seasons: Season[];
  currentSeasonNumber: number;
  currentEpisodeNumber: number;
  onSeasonChange: (seasonNumber: number) => void;
  onEpisodeChange: (episodeNumber: number) => void;
}

const EpisodeGuide: React.FC<EpisodeGuideProps> = ({
  tvId,
  seasons,
  currentSeasonNumber,
  currentEpisodeNumber,
  onSeasonChange,
  onEpisodeChange,
}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getEpisodes = async () => {
      setIsLoading(true);
      try {
        const seasonDetail = await fetchTvSeason(tvId, currentSeasonNumber);
        setEpisodes(seasonDetail.episodes || []);
      } catch (error) {
        console.error("Gagal mengambil daftar episode:", error);
        setEpisodes([]);
      } finally {
        setIsLoading(false);
      }
    };

    getEpisodes();
  }, [tvId, currentSeasonNumber]);

  const availableSeasons = seasons.filter(s => s.season_number > 0);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-display tracking-wider mb-4">Episode</h3>
      
      <div className="flex border-b border-brand-border mb-4 overflow-x-auto">
        {availableSeasons.map(season => (
          <button
            key={season.id}
            onClick={() => onSeasonChange(season.season_number)}
            className={`px-4 py-2 text-sm font-semibold flex-shrink-0 ${
              currentSeasonNumber === season.season_number
                ? 'border-b-2 border-brand-primary text-brand-text-primary'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            {season.name}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {isLoading ? (
          <p className="text-brand-text-secondary">Memuat episode...</p>
        ) : (
          episodes.map(episode => (
            <div
              key={episode.id}
              onClick={() => onEpisodeChange(episode.episode_number)}
              className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors ${
                currentEpisodeNumber === episode.episode_number
                  ? 'bg-brand-primary/20'
                  : 'hover:bg-brand-surface'
              }`}
            >
              <div className="flex-shrink-0 w-32 aspect-video bg-brand-surface rounded-md overflow-hidden relative">
                <img 
                  src={episode.still_path ? `https://image.tmdb.org/t/p/w300${episode.still_path}` : "https://placehold.co/300x169/161B22/7D8590?text=CineScope"}
                  alt={episode.name}
                  className="w-full h-full object-cover"
                />
                {currentEpisodeNumber === episode.episode_number && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <PlayCircle className="text-white" size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-brand-text-primary text-sm">
                  E{episode.episode_number} - {episode.name}
                </h4>
                <p className="text-xs text-brand-text-secondary line-clamp-2 mt-1">
                  {episode.overview}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EpisodeGuide;
