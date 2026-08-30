import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import LatestSidebar from './components/LatestSidebar';
import MediaRow from './components/MediaRow';
import MoviesPage from './components/MoviesPage';
import { fetchTmdb, getTmdbApiKey, getTmdbPosterUrl, setTmdbApiKey } from './lib/tmdb';

const FALLBACK_HERO_ITEMS = [
  {
    id: 1,
    title: 'COSMIC DRIFT',
    genre: 'SCI-FI',
    year: '2026',
    synopsis: 'A derelict spacecraft drifting on the edge of the solar system holds secrets that could change humanity forever.',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=900&fit=crop&crop=faces&q=85',
    ambientGlow: 'from-blue-600/30 via-purple-600/20 to-pink-600/30',
  },
  {
    id: 2,
    title: 'THE LAST FRONTIER',
    genre: 'DRAMA',
    year: '2025',
    synopsis: 'An isolated outpost crew struggles to maintain order as supplies run low and unseen forces gather.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=900&fit=crop&crop=faces&q=85',
    ambientGlow: 'from-amber-600/30 via-orange-600/20 to-red-600/30',
  },
];

const FALLBACK_SERIES = [
  { id: 1, title: 'Aetherborne', sub: 'S1 • Episode 4', tag: 'Today', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150' },
  { id: 2, title: 'The Last Frontier', sub: 'S2 • Episode 1', tag: 'Yesterday', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150' },
  { id: 3, title: 'Hyperion Drive', sub: 'S1 • Finale', tag: 'Yesterday', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150' },
];

const FALLBACK_MOVIES = [
  { id: 1, title: 'Solstice', sub: '2h 15m • Sci-Fi', tag: 'Today', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=150' },
  { id: 2, title: 'Cosmic Drift', sub: '1h 48m • Action', tag: '2 days ago', img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=150' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [apiKey, setApiKey] = useState(getTmdbApiKey());
  const [heroItems, setHeroItems] = useState(FALLBACK_HERO_ITEMS);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [sidebarSeries, setSidebarSeries] = useState(FALLBACK_SERIES);
  const [sidebarMovies, setSidebarMovies] = useState(FALLBACK_MOVIES);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setHeroItems(FALLBACK_HERO_ITEMS);
      setTrendingMovies([]);
      setPopularSeries([]);
      setTopRated([]);
      setSidebarSeries(FALLBACK_SERIES);
      setSidebarMovies(FALLBACK_MOVIES);
      return;
    }

    const loadAllDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [trendingData, seriesData, topData] = await Promise.all([
          fetchTmdb('/trending/movie/week', {}, apiKey),
          fetchTmdb('/tv/popular', { language: 'en-US', page: 1 }, apiKey),
          fetchTmdb('/movie/top_rated', { language: 'en-US', page: 1 }, apiKey),
        ]);

        const mapMedia = (items) =>
          (items || []).map((item) => ({
            id: item.id,
            title: item.title || item.name,
            rating: Number(item.vote_average || 0).toFixed(1),
            image: getTmdbPosterUrl(item.poster_path),
            overview: item.overview,
            backdrop: item.backdrop_path,
          }));

        const hero = (trendingData.results || []).slice(0, 5).map((item) => ({
          id: item.id,
          title: (item.title || item.name || 'Untitled').toUpperCase(),
          genre: item.genre_ids?.[0] ? `TMDB ${item.genre_ids[0]}` : 'MOVIE',
          year: (item.release_date || item.first_air_date || '2026').slice(0, 4),
          synopsis: item.overview || 'No synopsis available.',
          coverUrl: getTmdbPosterUrl(item.poster_path, 'w780'),
          ambientGlow: 'from-blue-600/30 via-purple-600/20 to-pink-600/30',
        }));

        const mappedSeries = (seriesData.results || []).slice(0, 3).map((item) => ({
          id: item.id,
          title: item.name,
          sub: `${item.first_air_date ? item.first_air_date.slice(0, 4) : 'TV'} • ${item.vote_average?.toFixed(1) || 'N/A'}`,
          tag: 'Live',
          img: getTmdbPosterUrl(item.poster_path),
        }));

        const mappedMovies = (topData.results || []).slice(0, 3).map((item) => ({
          id: item.id,
          title: item.title,
          sub: `${item.release_date ? item.release_date.slice(0, 4) : 'N/A'} • ${Number(item.vote_average || 0).toFixed(1)}`,
          tag: 'Top',
          img: getTmdbPosterUrl(item.poster_path),
        }));

        setHeroItems(hero.length ? hero : FALLBACK_HERO_ITEMS);
        setTrendingMovies(mapMedia(trendingData.results));
        setPopularSeries(mapMedia(seriesData.results));
        setTopRated(mapMedia(topData.results));
        setSidebarSeries(mappedSeries.length ? mappedSeries : FALLBACK_SERIES);
        setSidebarMovies(mappedMovies.length ? mappedMovies : FALLBACK_MOVIES);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load TMDB data.');
        setHeroItems(FALLBACK_HERO_ITEMS);
        setSidebarSeries(FALLBACK_SERIES);
        setSidebarMovies(FALLBACK_MOVIES);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllDashboardData();
  }, [apiKey]);

  const handleSaveApiKey = (event) => {
    event.preventDefault();
    const nextKey = setTmdbApiKey(apiKey);
    setApiKey(nextKey);
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-white pt-28 px-6 md:px-12 pb-16 space-y-10 w-full max-w-[1700px] mx-auto">
      <Navbar activeTab={activeTab} onNavigate={setActiveTab} />

      {activeTab === 'explore' && (
        <>
          <form onSubmit={handleSaveApiKey} className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">TMDB API Connection</p>
              <label htmlFor="tmdb-key" className="mt-1 block text-sm text-gray-200">
                Paste your v3 API Key or v4 Bearer Token
              </label>
            </div>

            <div className="flex w-full max-w-xl gap-3">
              <input
                id="tmdb-key"
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Paste TMDB key or token"
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-500 transition-colors"
              >
                Save Key
              </button>
            </div>
          </form>

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {isLoading && !heroItems.length && (
            <div className="text-sm text-gray-300">Loading TMDB dashboard data...</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-3">
              <HeroCarousel items={heroItems} />
            </div>
            <div className="lg:col-span-1">
              <LatestSidebar seriesItems={sidebarSeries} movieItems={sidebarMovies} />
            </div>
          </div>

          <div className="space-y-8">
            <MediaRow title="Trending Movies" items={trendingMovies} />
            <MediaRow title="Popular TV Series" items={popularSeries} />
            <MediaRow title="Top Rated Classics" items={topRated} />
          </div>
        </>
      )}

      {activeTab === 'movies' && <MoviesPage />}
    </div>
  );
}