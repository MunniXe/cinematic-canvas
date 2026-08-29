import React from 'react';

export default function MediaRow({ title, items, showProgress = false }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-bold tracking-wide text-white uppercase text-left">{title}</h3>

      <div className="flex items-center gap-4 overflow-x-auto py-4 px-1 scrollbar-hide">
        {items.map((item) => (
          <div key={item.id} className="relative flex-shrink-0 w-44 md:w-52 group cursor-pointer hover:z-20">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-transform duration-300 group-hover:scale-105">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />

              {item.rating && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs font-semibold flex items-center gap-1 border border-white/10">
                  <span className="text-yellow-400">★</span> {item.rating}
                </div>
              )}
            </div>

            {showProgress && item.progress !== undefined && (
              <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.progress}%` }} />
              </div>
            )}

            <p className="mt-2 text-sm font-medium text-gray-200 truncate text-left">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}