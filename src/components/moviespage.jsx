import React, { useEffect, useState } from 'react';
import { fetchTmdb, getTmdbApiKey } from '../lib/tmdb';

export default function MoviesPage({ onSelectMedia }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Genre List
  useEffect(() => {
    const apiKey = getTmdbApiKey();
    if (!apiKey) return;

    fetchTmdb('/genre/movie/list', { language: 'en-US' }, apiKey)
      .then((data) => setGenres(data.genres || []))
      .catch(console.error);
  }, []);

  // Fetch Movies based on Filters
  useEffect(() => {
    const apiKey = getTmdbApiKey();
    if (!apiKey) return;

    setIsLoading(true);
    const params = {
      language: 'en-US',
      page: 1,
      sort_by: sortBy,
      ...(selectedGenre && { with_genres: selectedGenre }),
    };

    fetchTmdb('/discover/movie', params, apiKey)
      .then((data) => {
        setMovies(data.results || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedGenre, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Page Title & Filter Bar Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Explore Movies</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Discover trending and top-rated films</p>
        </div>

        {/* Top Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" className="bg-slate-900">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id} className="bg-slate-900">
                {genre.name}
              </option>
            ))}
          </select>

          {/* Sort By Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popularity.desc" className="bg-slate-900">Most Popular</option>
            <option value="vote_average.desc" className="bg-slate-900">Top Rated</option>
            <option value="primary_release_date.desc" className="bg-slate-900">Newest Releases</option>
            <option value="revenue.desc" className="bg-slate-900">Box Office</option>
          </select>
        </div>
      </div>

      {/* Movie Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-12">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectMedia && onSelectMedia(movie)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <div className="aspect-[2/3] relative overflow-hidden bg-slate-900">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-yellow-400">
                  ★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-100 truncate">{movie.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}