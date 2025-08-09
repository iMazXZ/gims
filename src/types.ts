// Tipe untuk video/trailer
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette';
}

// Tipe untuk data pemeran
export interface CastMember {
  id:number;
  name: string;
  character: string;
  profile_path: string | null;
}

// Tipe untuk penyedia layanan streaming
export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviders {
  flatrate?: WatchProvider[]; // Subscription
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

// Tipe dasar untuk film atau acara TV
export interface MediaItem {
  id: number;
  title?: string; // Untuk film
  name?: string; // Untuk acara TV
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average?: number;
  release_date?: string; // Untuk film
  first_air_date?: string; // Untuk acara TV
  media_type?: 'movie' | 'tv';
  overview?: string;
}

// Tipe untuk detail media yang lebih lengkap
export interface MediaDetails extends MediaItem {
  runtime?: number; // Durasi film
  genres: { id: number; name: string }[];
  credits?: {
    cast: CastMember[];
  };
  videos?: {
    results: Video[];
  };
  images?: {
    backdrops: { file_path: string }[];
    posters: { file_path: string }[];
  };
  'watch/providers'?: {
    results: {
      [countryCode: string]: WatchProviders;
    };
  };
}

// Tipe untuk hasil pencarian
export type SearchResult = MediaItem;

// Tipe untuk item di riwayat
export interface HistoryItem extends MediaItem {
  viewedAt: string;
}

// Tipe untuk detail orang/aktor
export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
}

// Tipe untuk kredit film/TV seorang aktor
export interface PersonCredits {
  cast: MediaItem[];
}
