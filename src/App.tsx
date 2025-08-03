import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import PersonPage from "./pages/PersonPage";
import SearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";
import WatchlistPage from "./pages/WatchlistPage";
import DiscoverPage from "./pages/DiscoverPage"; // Impor halaman baru
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Tambahkan route baru untuk discover */}
          <Route path="/discover/:type" element={<DiscoverPage />} />
          <Route path="/movie/:id" element={<DetailPage type="movie" />} />
          <Route path="/tv/:id" element={<DetailPage type="tv" />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
