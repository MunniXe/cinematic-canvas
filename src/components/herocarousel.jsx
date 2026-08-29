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



export default function HeroCarousel({ items = FEATURED_ITEMS }) {

  const [currentIndex, setCurrentIndex] = useState(0);



  useEffect(() => {

    setCurrentIndex(0);

  }, [items]);



  const safeItems = items?.length ? items : FEATURED_ITEMS;

  const current = safeItems[currentIndex] || safeItems[0];

  const synopsis = (current?.synopsis || 'No description available for this title.').trim();

  const trimmedSynopsis = synopsis.length > 180 ? `${synopsis.slice(0, 177).trim()}...` : synopsis;



  const handlePrev = () => {

    setCurrentIndex((prev) => (prev === 0 ? safeItems.length - 1 : prev - 1));

  };



  const handleNext = () => {

    setCurrentIndex((prev) => (prev === safeItems.length - 1 ? 0 : prev + 1));

  };



  return (

    <div className="relative w-full rounded-3xl p-6 md:p-10 bg-white/5 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl">

      <div className={`absolute -inset-10 bg-gradient-to-r ${current.ambientGlow || 'from-blue-600/30 via-purple-600/20 to-pink-600/30'} blur-3xl opacity-50 pointer-events-none transition-all duration-700`} />



      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

        <div className="flex-1 space-y-4 text-left min-h-[260px] flex flex-col justify-center">

          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-gray-300">

            {current.genre} • {current.year}

          </div>



          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none line-clamp-2">

            {current.title}

          </h1>



          <p className="text-sm md:text-base text-gray-300 max-w-lg leading-relaxed min-h-[72px]">

            {trimmedSynopsis}

          </p>



          <div className="flex items-center gap-4 pt-2">

            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all">

              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>

              <span>Play</span>

            </button>

            <button className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all">

              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>

            </button>

          </div>

        </div>



        <div className="relative w-44 md:w-52 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0">

          <img src={current.coverUrl} alt={current.title} className="w-full h-full object-cover" />

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