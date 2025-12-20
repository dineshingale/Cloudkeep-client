// src/components/Navbar.jsx
import React from 'react';
import { Search, Plus, LogOut } from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  startCreating, 
  user,     // New Prop
  onLogout  // New Prop
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
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search thoughts..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 py-2 w-full rounded-full border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
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
            <span className="text-[10px] text-slate-400">ID: {user?.uid?.slice(0,4)}...</span>
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