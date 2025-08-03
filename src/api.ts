const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const MOVIESAPI_BASE_URL = 'https://moviesapi.to/api';

/**
 * Fetch data from The Movie Database (TMDB) API.
 */
export const tmdbFetch = async (endpoint: string, params: Record<string, string> = {}) => {
  if (!TMDB_API_KEY) {
    throw new Error("VITE_TMDB_API_KEY is not defined in .env.local");
  }

  const url = new URL(TMDB_BASE_URL + endpoint);
  url.searchParams.append('api_key', TMDB_API_KEY);
  for (const key in params) {
    url.searchParams.append(key, params[key]);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.status_message || 'TMDB API request failed');
  }
  return response.json();
};

/**
 * Fetch data from MoviesAPI.club API.
 */
export const moviesApiFetch = async (endpoint: string, params: Record<string, string> = {}) => {
  const url = new URL(MOVIESAPI_BASE_URL + endpoint);
  for (const key in params) {
    url.searchParams.append(key, params[key]);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'MoviesAPI.club request failed');
  }
  return response.json();
};

/**
 * Fetches season details for a TV show from TMDB.
 */
export const fetchTvSeason = async (tvId: string, seasonNumber: number) => {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
};
