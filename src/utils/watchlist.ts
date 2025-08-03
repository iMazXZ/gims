import { MediaItem } from '../types';

const WATCHLIST_KEY = 'cineScopeWatchlist';

export const getWatchlist = (): MediaItem[] => {
  const saved = localStorage.getItem(WATCHLIST_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveWatchlist = (watchlist: MediaItem[]) => {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
};

export const addToWatchlist = (item: MediaItem) => {
  const watchlist = getWatchlist();
  if (!watchlist.some(i => i.id === item.id)) {
    const newWatchlist = [item, ...watchlist];
    saveWatchlist(newWatchlist);
  }
};

export const removeFromWatchlist = (id: number) => {
  const watchlist = getWatchlist();
  const newWatchlist = watchlist.filter(item => item.id !== id);
  saveWatchlist(newWatchlist);
};

export const isInWatchlist = (id: number): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id === id);
};

/**
 * Fungsi baru untuk menambah/menghapus dari watchlist.
 * @param {MediaItem} item - Item media yang akan di-toggle.
 */
export const toggleWatchlist = (item: MediaItem) => {
  if (isInWatchlist(item.id)) {
    removeFromWatchlist(item.id);
  } else {
    // Pastikan media_type ada saat menambahkan
    const itemToAdd = {
      ...item,
      media_type: item.media_type || (item.title ? 'movie' : 'tv')
    };
    addToWatchlist(itemToAdd);
  }
};
