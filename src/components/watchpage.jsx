import React, { useEffect, useState } from 'react';
import { fetchTmdb, getTmdbApiKey, getTmdbPosterUrl } from '../lib/tmdb';

function formatRuntime(minutes) {
  if (!minutes) return 'Runtime unavailable';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

function WatchDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const selectedOption = options.find((option) => String(option.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-gray-200 shadow-2xl backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/25"
      >
        <span>{selectedOption?.label || label}</span>
        <span className={`text-[10px] text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-11 z-[100] w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-md">
          <div className="max-h-60 space-y-0.5 overflow-y-auto py-2 [scrollbar-width:none]">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-xs transition-colors ${
                  String(value) === String(option.value)
                    ? 'bg-white/20 font-semibold text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WatchPage({ media, onBack, onSelectMedia }) {
  const [details, setDetails] = useState(media);
  const [similar, setSimilar] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const mediaType = media?.media_type === 'live'
  ? 'live'
  : media?.media_type === 'tv' || media?.name
    ? 'tv'
    : 'movie';
  const title = details?.title || details?.name || 'Untitled';
  const embedUrl = mediaType === 'live'
  ? details?.videoId
    ? `https://www.youtube.com/embed/${details.videoId}?autoplay=1`
    : ''
  : details?.id
    ? mediaType === 'tv'
      ? `https://vidsrc.me/embed/tv?tmdb=${details.id}&season=${selectedSeason}&episode=${selectedEpisode}`
      : `https://vidsrc.me/embed/movie?tmdb=${details.id}`
    : '';
  const posterUrl = mediaType === 'live'
  ? details?.thumbnail || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500'
  : getTmdbPosterUrl(details?.poster_path, 'w500');
  const backdropUrl = mediaType === 'live'
  ? details?.thumbnail || posterUrl
  : details?.backdrop_path
    ? getTmdbPosterUrl(details.backdrop_path, 'w1280')
    : posterUrl;

  useEffect(() => {
    let isCurrent = true;

    const loadWatchData = async () => {
      if (media?.media_type === 'live') {
  setDetails(media);
  setSimilar([]);
  setIsLoading(false);
  return;
}

const apiKey = getTmdbApiKey();
if (!apiKey || !media?.id) {
  setIsLoading(false);
  return;
}

      try {
        setIsLoading(true);
        setError('');
        const [fullDetails, recommendations] = await Promise.all([
          fetchTmdb(`/${mediaType}/${media.id}`, { language: 'en-US' }, apiKey),
          fetchTmdb(`/${mediaType}/${media.id}/similar`, { language: 'en-US', page: 1 }, apiKey),
        ]);

        if (!isCurrent) return;
        setDetails({ ...media, ...fullDetails, media_type: mediaType });
        setSimilar((recommendations.results || []).slice(0, 6));
        setSelectedSeason(1);
        setSelectedEpisode(1);
      } catch (loadError) {
        if (isCurrent) setError(loadError.message || 'Unable to load title details.');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    loadWatchData();
    return () => {
      isCurrent = false;
    };
  }, [media, mediaType]);

  useEffect(() => {
    if (mediaType !== 'tv' || !details?.id) return;

    const apiKey = getTmdbApiKey();
    if (!apiKey) return;

    setSelectedEpisode(1);
    fetchTmdb(`/${mediaType}/${details.id}/season/${selectedSeason}`, { language: 'en-US' }, apiKey)
      .then((seasonData) => setEpisodes(seasonData.episodes || []))
      .catch(() => setEpisodes([]));
  }, [details?.id, mediaType, selectedSeason]);

  if (!media) return null;

  const year = (details?.release_date || details?.first_air_date || '').slice(0, 4);
  const genres = details?.genres?.map((genre) => genre.name).join(' / ');
  const similarItems = similar.map((item) => ({ ...item, media_type: mediaType }));

  return (
    <main className="w-full space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-gray-300 hover:text-white transition-colors"
      >
        ← Back
      </button>

      <section className="space-y-3">
        <h2 className="text-left text-lg font-bold uppercase tracking-wide text-white">Watch</h2>
        {mediaType === 'tv' && (
          <div className="flex flex-wrap items-center gap-3">
            <WatchDropdown
              label="Season 1"
              value={selectedSeason}
              options={Array.from({ length: details?.number_of_seasons || 1 }, (_, index) => ({
                value: index + 1,
                label: `Season ${index + 1}`,
              }))}
              onChange={setSelectedSeason}
            />
            <WatchDropdown
              label="Episode 1"
              value={selectedEpisode}
              options={(episodes.length ? episodes : [{ episode_number: 1, name: 'Episode 1' }]).map((episode) => ({
                value: episode.episode_number,
                label: `${episode.episode_number}. ${episode.name}`,
              }))}
              onChange={setSelectedEpisode}
            />
          </div>
        )}
        <div className="relative aspect-video min-h-[220px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl sm:min-h-[360px] md:min-h-[480px]">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="h-full w-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400 sm:text-sm">
              Loading player...
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080A0F] via-[#080A0F]/90 to-[#080A0F]/50" />

        <div className="relative z-10 grid grid-cols-[88px_minmax(0,1fr)] items-start gap-4 p-4 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-5 sm:p-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8 md:p-10">
          <img
            src={posterUrl}
            alt={title}
            className="aspect-[2/3] w-full rounded-xl border border-white/10 object-cover shadow-2xl md:rounded-2xl"
          />

          <div className="min-w-0 text-left md:flex md:flex-col md:justify-center">
            <p className="text-[9px] uppercase tracking-[0.12em] text-gray-400 sm:text-xs sm:tracking-[0.2em]">
              {mediaType === 'live'
                 ? 'LIVE'
                 : mediaType === 'tv'
                  ? 'TV Series'
                  : 'Movie'}{' '}
              {mediaType !== 'live' && year && `• ${year}`}
            </p>
            <h1 className="mt-1 line-clamp-2 text-lg font-black uppercase leading-tight tracking-tight text-white sm:text-2xl md:mt-3 md:text-5xl">{title}</h1>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-gray-300 sm:mt-4 sm:gap-3 sm:text-sm">
              {mediaType !== 'live' && (
               <>
                 <span>★ {details?.vote_average ? Number(details.vote_average).toFixed(1) : 'N/A'}</span>
                  {genres && <span>{genres}</span>}
                  {mediaType === 'movie' && <span>{formatRuntime(details?.runtime)}</span>}
                  {mediaType === 'tv' && details?.number_of_seasons && (
                    <span>{details.number_of_seasons} seasons</span>
                  )}
                </>
              )}

               {mediaType === 'live' && details?.channel && (
                 <span>{details.channel}</span>
               )}
            </div>
            <p className="mt-3 line-clamp-4 max-w-2xl text-[11px] leading-5 text-gray-300 sm:mt-5 sm:text-sm sm:leading-7">
              {details?.overview || 'No description is available for this title.'}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {isLoading && <p className="text-left text-sm text-gray-400">Loading title details...</p>}
     {mediaType !== 'live' && (
      <section className="space-y-3">
        <h2 className="text-left text-lg font-bold uppercase tracking-wide text-white">Similar Films & Shows</h2>
        {similarItems.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {similarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectMedia?.(item)}
                className="group text-left"
              >
                <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={getTmdbPosterUrl(item.poster_path)}
                    alt={item.title || item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 truncate text-sm text-gray-200">{item.title || item.name}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-left text-sm text-gray-400">Similar titles will appear here.</p>
        )}
      </section>
     )}
    </main>
  );
}
