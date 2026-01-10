import React from 'react';
import { Search, Plus, LogOut, Sparkles, Loader2 } from 'lucide-react'; // Imports

export default function Navbar({
  searchQuery,
  setSearchQuery,
  searchMode, setSearchMode, isAiSearching, // New props
  startCreating,
  user,
  onLogout
}) {
  return (
    <nav className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-50 shadow-sm gap-4">

      {/* Logo */}
      <div className="text-blue-600 flex-shrink-0 flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <span className="hidden md:block font-bold text-slate-800 tracking-tight">Cloudkeep</span>
      </div>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-md flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-2.5 h-4 w-4 ${searchMode === 'ai' ? 'text-purple-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder={searchMode === 'ai' ? "Ask your second brain..." : "Search thoughts..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-9 pr-10 py-2 w-full rounded-full border text-sm focus:outline-none focus:ring-2 transition-all
                ${searchMode === 'ai'
                ? 'border-purple-300 bg-purple-50 focus:ring-purple-500 text-purple-900 placeholder-purple-300'
                : 'border-slate-300 bg-slate-50 focus:ring-blue-500'}`}
          />
          {isAiSearching && (
            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-purple-500 animate-spin" />
          )}
        </div>

        {/* AI Toggle Button */}
        <button
          onClick={() => setSearchMode(prev => prev === 'standard' ? 'ai' : 'standard')}
          className={`p-2 rounded-full transition-all border ${searchMode === 'ai'
              ? 'bg-purple-600 text-white border-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]'
              : 'bg-white text-slate-400 border-slate-200 hover:text-purple-600 hover:border-purple-200'
            }`}
          title={searchMode === 'ai' ? "Switch to Standard Search" : "Enable AI Search"}
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={startCreating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs font-bold text-slate-700">{user?.displayName}</span>
            <span className="text-[10px] text-slate-400">ID: {user?.uid?.slice(0, 4)}...</span>
          </div>

          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-full border border-slate-200 shadow-sm" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border border-white shadow-sm">
              {user?.displayName ? user.displayName[0] : 'U'}
            </div>
          )}

          <button
            onClick={onLogout}
            title="Logout"
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}