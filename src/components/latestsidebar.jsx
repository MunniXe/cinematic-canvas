import React, { useState } from 'react';

const LATEST_SERIES = [
  { id: 1, title: 'Aetherborne', sub: 'S1 • Episode 4', tag: 'Today', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150' },
  { id: 2, title: 'The Last Frontier', sub: 'S2 • Episode 1', tag: 'Yesterday', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150' },
  { id: 3, title: 'Hyperion Drive', sub: 'S1 • Finale', tag: 'Yesterday', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150' },
];

const LATEST_MOVIES = [
  { id: 1, title: 'Solstice', sub: '2h 15m • Sci-Fi', tag: 'Today', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=150' },
  { id: 2, title: 'Cosmic Drift', sub: '1h 48m • Action', tag: '2 days ago', img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=150' },
];

export default function LatestSidebar({ seriesItems = LATEST_SERIES, movieItems = LATEST_MOVIES, onSelectMedia }) {
  const [activeTab, setActiveTab] = useState('series');
  const items = activeTab === 'series' ? (seriesItems?.length ? seriesItems : LATEST_SERIES) : (movieItems?.length ? movieItems : LATEST_MOVIES);

  return (
    <aside className="w-full h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
      <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mb-4">
        <button
          onClick={() => setActiveTab('series')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'series' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Latest Series
        </button>
        <button
          onClick={() => setActiveTab('movies')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'movies' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Latest Movies
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectMedia?.({ ...item, media_type: item.media_type || (activeTab === 'series' ? 'tv' : 'movie') })}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/5 cursor-pointer group"
          >
            <img src={item.img} alt={item.title} className="w-12 aspect-[2/3] rounded-lg object-cover group-hover:scale-105 transition-transform" />
            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
            <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-1 rounded-md">{item.tag}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}