import React, { useState, useEffect } from "react";
import { Country, Genre } from "../types";
import { fetchCountries, fetchGenres } from "../api";

// Definisikan tipe untuk semua filter
export interface Filters {
  genre: string;
  year: string;
  sort_by: string;
  region: string; // Filter baru
}

interface FilterControlsProps {
  mediaType: "movie" | "tv";
  onFilterChange: (filters: Filters) => void;
}

const years = Array.from({ length: 30 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

const sortOptions = {
  "popularity.desc": "Popularitas",
  "vote_average.desc": "Rating Tertinggi",
  "primary_release_date.desc": "Terbaru",
};

const FilterControls: React.FC<FilterControlsProps> = ({
  mediaType,
  onFilterChange,
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filters, setFilters] = useState<Filters>({
    genre: "all",
    year: "all",
    sort_by: "popularity.desc",
    region: "all", // Nilai default
  });

  useEffect(() => {
    const getOptions = async () => {
      const genreData = await fetchGenres(mediaType);
      setGenres(genreData.genres);
      const countryData = await fetchCountries();
      // Urutkan negara berdasarkan nama
      const sortedCountries = countryData.sort((a: Country, b: Country) =>
        a.english_name.localeCompare(b.english_name)
      );
      setCountries(sortedCountries);
    };
    getOptions();
  }, [mediaType]);

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-brand-surface p-4 rounded-lg mb-8 flex flex-wrap gap-4 items-center">
      {/* Filter Negara/Wilayah */}
      <select
        value={filters.region}
        onChange={(e) => handleFilterChange("region", e.target.value)}
        className="bg-brand-background border border-brand-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        <option value="all">Semua Wilayah</option>
        {countries.map((c) => (
          <option key={c.iso_3166_1} value={c.iso_3166_1}>
            {c.english_name}
          </option>
        ))}
      </select>

      {/* Filter Genre */}
      <select
        value={filters.genre}
        onChange={(e) => handleFilterChange("genre", e.target.value)}
        className="bg-brand-background border border-brand-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        <option value="all">Semua Genre</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      {/* Filter Tahun */}
      <select
        value={filters.year}
        onChange={(e) => handleFilterChange("year", e.target.value)}
        className="bg-brand-background border border-brand-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        <option value="all">Semua Tahun</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* Sortir */}
      <select
        value={filters.sort_by}
        onChange={(e) => handleFilterChange("sort_by", e.target.value)}
        className="bg-brand-background border border-brand-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        {Object.entries(sortOptions).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterControls;
