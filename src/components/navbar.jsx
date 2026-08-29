import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl w-[90%] max-w-2xl">
      {/* Brand Icon */}
      <div className="w-7 h-7 rounded-full bg-blue-500" />

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
        <a href="#" className="text-white font-semibold">Explore</a>
        <a href="#" className="hover:text-white transition-colors">Movies</a>
        <a href="#" className="hover:text-white transition-colors">Series</a>
        <a href="#" className="hover:text-white transition-colors">Live</a>
      </div>

      {/* Search & User Profile */}
      <div className="flex items-center gap-3">
        <button className="p-1.5 text-gray-400 hover:text-white">
            <i className="bi-search"></i>
        </button>
        <div className="w-7 h-7 rounded-full bg-gray-600 ring-2 ring-white/20 overflow-hidden">
          <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </nav>
  );
}