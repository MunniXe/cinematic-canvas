import React, { useEffect, useState } from 'react';
import { fetchYoutubeLiveStreams } from '../lib/youtube';

const LIVE_SEARCHES = [
  {
    title: 'NBA',
    query: 'NBA live',
  },
  {
    title: 'NFL',
    query: 'NFL live',
  },
  {
    title: 'News',
    query: 'live news',
  },
  {
    title: 'Sports',
    query: 'live sports',
  },
];

function ChannelCard({ channel, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(channel)}
      className="relative flex-shrink-0 w-64 md:w-72 group cursor-pointer text-left"
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-transform duration-300 group-hover:scale-105">
        <img
          src={channel.thumbnail}
          alt={channel.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-500/90 text-white text-[10px] font-bold tracking-wider border border-red-400/20">
          LIVE
        </div>
      </div>

      <div className="mt-2">
        <p className="text-sm font-medium text-gray-200 truncate">
          {channel.title}
        </p>

        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {channel.channel}
        </p>
      </div>
    </button>
  );
}

function LoadingRow() {
  return (
    <section className="space-y-3">
      <div className="h-5 w-24 rounded bg-white/5 animate-pulse" />

      <div className="flex gap-4 overflow-hidden py-4 px-1">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex-shrink-0 w-64 md:w-72"
          >
            <div className="aspect-video rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
            <div className="mt-2 h-4 w-40 rounded bg-white/5 animate-pulse" />
            <div className="mt-1 h-3 w-24 rounded bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LivePage({ onSelectMedia }) {
  const [liveStreams, setLiveStreams] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLiveStreams = async () => {
      try {
        setIsLoading(true);
        setError('');

        const results = await Promise.all(
          LIVE_SEARCHES.map(async (search) => {
            const streams = await fetchYoutubeLiveStreams(search.query, 6);

            return {
              title: search.title,
              streams,
            };
          })
        );

        const groupedStreams = {};

        results.forEach((result) => {
          groupedStreams[result.title] = result.streams;
        });

        setLiveStreams(groupedStreams);
      } catch (loadError) {
        console.error('YouTube Live error:', loadError);
        setError(loadError.message || 'Unable to load live streams.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLiveStreams();
  }, []);

  const handleSelectChannel = (channel) => {
  onSelectMedia?.({
    ...channel,
    id: channel.videoId,
    media_type: 'live',
    title: channel.title,
    overview: channel.description,
    poster_path: null,
    backdrop_path: null,
  });
};

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-white uppercase">
            Live
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Watch live sports, news and more
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Live now
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <>
          <LoadingRow />
          <LoadingRow />
        </>
      )}

      {/* Live streams */}
      {!isLoading &&
        Object.entries(liveStreams).map(([category, streams]) => (
          streams.length > 0 && (
            <section key={category} className="space-y-3">
              <h2 className="text-lg font-bold tracking-wide text-white uppercase text-left">
                {category}
              </h2>

              <div className="flex items-center gap-4 overflow-x-auto py-4 px-1 scrollbar-hide">
                {streams.map((stream) => (
                  <ChannelCard
                    key={stream.videoId}
                    channel={stream}
                    onSelect={handleSelectChannel}
                  />
                ))}
              </div>
            </section>
          )
        ))}

      {/* No results */}
      {!isLoading &&
        !error &&
        Object.values(liveStreams).every((streams) => streams.length === 0) && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <p className="text-sm text-gray-400">
              No live streams are available right now.
            </p>
          </div>
        )}
    </div>
  );
}