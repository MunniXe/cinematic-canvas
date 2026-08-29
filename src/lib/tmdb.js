const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_STORAGE_KEY = 'cinematic-canvas-tmdb-key';

export function getTmdbApiKey() {
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_TMDB_API_KEY || '';
  }

  return localStorage.getItem(TMDB_STORAGE_KEY) || import.meta.env.VITE_TMDB_API_KEY || '';
}

export function setTmdbApiKey(apiKey) {
  const trimmedKey = (apiKey || '').trim();

  if (typeof window !== 'undefined') {
    if (trimmedKey) {
      localStorage.setItem(TMDB_STORAGE_KEY, trimmedKey);
      return trimmedKey;
    }

    localStorage.removeItem(TMDB_STORAGE_KEY);
  }

  return trimmedKey;
}

export async function fetchTmdb(endpoint, params = {}, apiKeyOverride = getTmdbApiKey()) {
  const key = (apiKeyOverride || '').trim();

  if (!key) {
    throw new Error('TMDB API key is missing. Add your key in the app or in a VITE_TMDB_API_KEY environment variable.');
  }

  const searchParams = new URLSearchParams({
    api_key: key,
    ...params,
  });

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }

  return response.json();
}

export function getTmdbPosterUrl(path, size = 'w500') {
  if (!path) {
    return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500';
  }

  return `https://image.tmdb.org/t/p/${size}${path}`;
}
