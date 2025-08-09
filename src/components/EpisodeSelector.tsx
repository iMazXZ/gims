import React from "react";
import { Season } from "../types";

interface EpisodeSelectorProps {
  seasons: Season[];
  selectedSeason: number;
  selectedEpisode: number;
  onSeasonChange: (seasonNumber: number) => void;
  onEpisodeChange: (episodeNumber: number) => void;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  seasons,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
}) => {
  const currentSeason = seasons.find((s) => s.season_number === selectedSeason);

  return (
    <div className="p-4 bg-brand-surface rounded-lg my-6">
      <h3 className="text-xl font-display tracking-wider mb-4">
        Select Episode
      </h3>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Season Selector */}
        <div className="flex-1">
          <label
            htmlFor="season-select"
            className="block text-sm font-medium text-brand-text-secondary mb-1"
          >
            Season
          </label>
          <select
            id="season-select"
            value={selectedSeason}
            onChange={(e) => onSeasonChange(Number(e.target.value))}
            className="w-full bg-brand-background border border-brand-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {seasons
              .filter((s) => s.season_number > 0)
              .map((season) => (
                <option key={season.id} value={season.season_number}>
                  {season.name}
                </option>
              ))}
          </select>
        </div>

        {/* Episode Selector */}
        <div className="flex-1">
          <label
            htmlFor="episode-select"
            className="block text-sm font-medium text-brand-text-secondary mb-1"
          >
            Episode
          </label>
          <select
            id="episode-select"
            value={selectedEpisode}
            onChange={(e) => onEpisodeChange(Number(e.target.value))}
            className="w-full bg-brand-background border border-brand-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            disabled={!currentSeason}
          >
            {currentSeason &&
              Array.from(
                { length: currentSeason.episode_count },
                (_, i) => i + 1
              ).map((epNum) => (
                <option key={epNum} value={epNum}>
                  Episode {epNum}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EpisodeSelector;
