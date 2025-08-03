import React, { useState, useEffect } from "react";
import { HistoryItem } from "../types";
import HistoryPanel from "../components/HistoryPanel";

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("movieTvHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("movieTvHistory");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <HistoryPanel history={history} onClearHistory={clearHistory} />
    </div>
  );
};

export default HistoryPage;
