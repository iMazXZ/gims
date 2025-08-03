import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, History } from "lucide-react";
import SearchForm from "./SearchForm";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="py-4 px-4 md:px-8 border-b border-brand-border sticky top-0 bg-brand-background/80 backdrop-blur-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <Film className="text-brand-primary" size={28} />
          <h1 className="text-3xl font-display text-brand-text-primary tracking-wider">
            CineScope
          </h1>
        </Link>
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="w-full md:w-72">
            <SearchForm onSearch={handleSearch} />
          </div>
          <Link
            to="/history"
            title="History"
            className="p-2.5 rounded-lg hover:bg-brand-surface transition-colors"
          >
            <History size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
