import React, { useEffect, useRef, useState } from 'react';
import { fetchTmdb, getTmdbApiKey } from '../lib/tmdb';

export default function Navbar({ onSelectMedia, activeTab = 'explore', onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const apiKey = getTmdbApiKey();

    if (!apiKey) {
      setResults([]);
      setIsOpen(true);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        const data = await fetchTmdb(
          '/search/multi',
          {
            query: trimmedQuery,
            include_adult: 'false',
            language: 'en-US',
            page: 1,
          },
          apiKey
        );

        const nextResults = (data.results || [])
          .filter((item) => item.media_type !== 'person')
          .slice(0, 5)
          .map((item) => ({
            id: item.id,
            title: item.title || item.name || 'Untitled',
            type: item.media_type === 'movie' ? 'Movie' : item.media_type === 'tv' ? 'TV' : 'Title',
            rating: item.vote_average ? Number(item.vote_average).toFixed(1) : 'N/A',
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null,
            raw: item,
          }));

        setResults(nextResults);
        setIsOpen(true);
      } catch (error) {
        setResults([]);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearchClick = () => {
    setIsOpen((current) => !current);
  };

  const handleClearQuery = () => {
    setQuery('');
    setResults([]);
  };

  const handleSelectResult = (item) => {
    setQuery(item.title);
    setIsOpen(false);
    if (onSelectMedia) {
      onSelectMedia(item.raw);
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl w-[95%] sm:w-[90%] max-w-2xl">
      {/* Brand Icon */}
      <button 
        type="button" 
        onClick={() => onNavigate && onNavigate('explore')}
        className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-blue-500 shrink-0 cursor-pointer"
        aria-label="Go to Home"
      />

      {/* Navigation Links */}
      <div className="flex items-center gap-4 sm:gap-5 md:gap-6 text-sm font-medium text-gray-300 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink min-w-0 px-1">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('explore')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'explore' ? 'text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Explore
        </button>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('movies')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'movies' ? 'text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Movies
        </button>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('series')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'series' ? 'text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Series
        </button>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('live')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'live' ? 'text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Live
        </button>
      </div>

      {/* Search & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 relative" ref={searchRef}>
        <div className="relative">
          <button
            className="p-1 sm:p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            onClick={handleSearchClick}
            aria-label="Search TMDB"
          >
            <i className="bi-search"></i>
          </button>

          {isOpen && (
            <div className="absolute right-0 top-10 sm:top-11 w-[280px] sm:w-[320px] rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl ring-1 ring-white/10 overflow-hidden z-[100]">
              <div className="relative border-b border-white/10 px-3 py-2 flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search movies or shows..."
                  className="w-full bg-transparent pr-6 text-xs sm:text-sm text-white placeholder:text-gray-400 outline-none"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    className="absolute right-3 text-xs text-gray-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/5 [scrollbar-width:none]">
                {isLoading && (
                  <div className="px-3 py-2 text-xs text-gray-300">Searching TMDB...</div>
                )}

                {!isLoading && !results.length && query.trim() && (
                  <div className="px-3 py-2 text-xs text-gray-300">No matches found</div>
                )}

                {!isLoading && !query.trim() && (
                  <div className="px-3 py-2 text-xs text-gray-300">Type to search TMDB</div>
                )}

                {!isLoading &&
                  results.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-left text-xs sm:text-sm text-white hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => handleSelectResult(item)}
                    >
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="h-10 sm:h-12 w-7 sm:w-8 rounded-md object-cover shrink-0 border border-white/10"
                        />
                      ) : (
                        <div className="h-10 sm:h-12 w-7 sm:w-8 rounded-md bg-white/10 shrink-0 flex items-center justify-center text-[8px] sm:text-[10px] text-gray-400">
                          N/A
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-xs sm:text-sm text-gray-100">{item.title}</div>
                        <div className="mt-0.5 sm:mt-1 flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] text-gray-300">
                          <span className="rounded bg-white/10 px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[9px] uppercase tracking-wider text-gray-200">
                            {item.type}
                          </span>
                          <span className="text-yellow-400">★</span>
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-gray-600 ring-2 ring-white/20 overflow-hidden shrink-0">
          <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </nav>
  );
}