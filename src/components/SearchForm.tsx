import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (query: string, type: "movie" | "tv") => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const type = "multi"; // Tipe pencarian bisa disederhanakan untuk header

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, "movie"); // Default ke movie atau bisa diubah
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary"
        size={18}
      />
      <input
        className="w-full bg-brand-surface border border-brand-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm"
        type="text"
        placeholder="Search movies & tv shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

export default SearchForm;
