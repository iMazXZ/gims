export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average?: number;
  release_date: string;
  runtime?: number;
  cast?: CastMember[];
  backdrops?: string[];
  posters?: string[];
}

export interface TVShowDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average?: number;
  first_air_date: string;
  cast?: CastMember[];
  backdrops?: string[];
  posters?: string[];
}

export type MediaDetails = MovieDetails | TVShowDetails;

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
}

export interface HistoryItem {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  poster_path: string | null;
  viewedAt: string;
  vote_average?: number;
}