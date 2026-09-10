import React, { useEffect, useState } from 'react';



const FEATURED_ITEMS = [

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



export default function HeroCarousel({ items = FEATURED_ITEMS, onSelectMedia }) {

  const [currentIndex, setCurrentIndex] = useState(0);



  useEffect(() => {

    setCurrentIndex(0);

  }, [items]);



  const safeItems = items?.length ? items : FEATURED_ITEMS;

  const current = safeItems[currentIndex] || safeItems[0];

  const synopsis = (current?.synopsis || 'No description available for this title.').trim();

  const trimmedSynopsis = synopsis.length > 180 ? `${synopsis.slice(0, 177).trim()}...` : synopsis;

  const posterUrl = current?.posterUrl || current?.coverUrl || current?.image || (current?.poster_path ? `https://image.tmdb.org/t/p/w500${current.poster_path}` : 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500');



  const handlePrev = () => {

    setCurrentIndex((prev) => (prev === 0 ? safeItems.length - 1 : prev - 1));

  };



  const handleNext = () => {

    setCurrentIndex((prev) => (prev === safeItems.length - 1 ? 0 : prev + 1));

  };



  return (

    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl sm:p-6 md:p-10">



      <div className="relative z-10 flex flex-row items-center justify-between gap-3 sm:gap-6 md:gap-8">

        <div className="min-w-0 flex-1 space-y-2 text-left sm:space-y-4">

          <div className="inline-block rounded-full bg-white/10 px-2 py-1 text-[9px] font-semibold text-gray-300 sm:px-3 sm:text-xs">

            {current.genre} • {current.year}

          </div>



          <h1 className="line-clamp-2 text-xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl md:text-6xl">

            {current.title}

          </h1>



          <p className="line-clamp-4 min-h-0 max-w-lg text-[11px] leading-5 text-gray-300 sm:min-h-[72px] sm:text-sm sm:leading-relaxed md:text-base">

            {trimmedSynopsis}

          </p>


          <div className="flex items-center gap-2 pt-1 sm:gap-4 sm:pt-2">

            <button
              type="button"
              onClick={() => onSelectMedia?.({ ...current, media_type: current.media_type || 'movie' })}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-black transition-all hover:bg-gray-200 sm:gap-2 sm:px-6 sm:py-3 sm:text-base"
            >

              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>

              <span>Play</span>

            </button>

            <button className="rounded-full border border-white/20 bg-white/10 p-2 text-white transition-all hover:bg-white/20 sm:p-3">

              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>

            </button>

          </div>

        </div>



        <div className="relative w-28 shrink-0 aspect-[2/3] overflow-hidden rounded-xl border border-white/10 shadow-2xl sm:w-40 sm:rounded-2xl md:w-52">

          <img src={posterUrl} alt={current.title} className="w-full h-full object-cover" />

        </div>

      </div>



      <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/70">

        <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>

      </button>



      <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/70">

        <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>

      </button>

    </div>

  );

}