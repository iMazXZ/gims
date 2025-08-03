const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const apiFetch = async (endpoint: string, params: Record<string, string> = {}) => {
  if (!API_KEY) {
    throw new Error("VITE_TMDB_API_KEY is not defined in .env.local");
  }

  const url = new URL(BASE_URL + endpoint);
  url.searchParams.append('api_key', API_KEY);
  for (const key in params) {
    url.searchParams.append(key, params[key]);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.status_message || 'API request failed');
  }
  return response.json();
};
