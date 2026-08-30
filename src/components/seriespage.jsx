import React, { useEffect, useState, useRef } from 'react';
import { fetchTmdb, getTmdbApiKey } from '../lib/tmdb';

// Custom Glassmorphic Dropdown Component
function GlassDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-gray-200 shadow-2xl hover:bg-white/15 hover:border-white/25 transition-all cursor-pointer"
      >
        <span>{displayLabel}</span>
        <span className={`text-[10px] text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 min-w-[180px] py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl ring-1 ring-white/10 z-[100] max-h-60 overflow-y-auto space-y-0.5 [scrollbar-width:none]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs sm:text-sm transition-colors cursor-pointer ${
                String(value) === String(option.value)
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SeriesPage({ onSelectMedia }) {
  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch TV Genre List
  useEffect(() => {
    const apiKey = getTmdbApiKey();
    if (!apiKey) return;

    fetchTmdb('/genre/tv/list', { language: 'en-US' }, apiKey)
      .then((data) => setGenres(data.genres || []))
      .catch(console.error);
  }, []);

  // Fetch TV Series based on Filters
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

    fetchTmdb('/discover/tv', params, apiKey)
      .then((data) => {
        setSeries(data.results || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedGenre, sortBy]);

  const genreOptions = [
    { label: 'All Genres', value: '' },
    ...genres.map((g) => ({ label: g.name, value: g.id })),
  ];

  const sortOptions = [
    { label: 'Most Popular', value: 'popularity.desc' },
    { label: 'Top Rated', value: 'vote_average.desc' },
    { label: 'First Air Date', value: 'first_air_date.desc' },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Page Title & Filter Bar Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-white uppercase">
            Explore TV Series
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Discover trending shows and top-rated series
          </p>
        </div>

        {/* Custom Glassmorphic Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 z-30">
          <GlassDropdown
            label="All Genres"
            options={genreOptions}
            value={selectedGenre}
            onChange={(val) => setSelectedGenre(val)}
          />

          <GlassDropdown
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={(val) => setSortBy(val)}
          />
        </div>
      </div>

      {/* Series Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-2xl border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {series.map((show) => (
            <div
              key={show.id}
              onClick={() => onSelectMedia && onSelectMedia({ ...show, media_type: 'tv' })}
              className="group cursor-pointer text-left space-y-2"
            >
              <div className="aspect-[2/3] relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-transform duration-300 group-hover:scale-105">
                {show.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 border border-white/10">
                  <span className="text-yellow-400">★</span>
                  <span>{show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
              </div>
              <div className="px-1">
                <h3 className="font-medium text-sm text-gray-200 truncate">{show.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}