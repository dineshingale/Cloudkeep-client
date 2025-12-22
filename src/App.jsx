// src/App.jsx
import React from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';

// Logic Hooks
import { useThoughtManager } from './hooks/useThoughtManager';
import { useAuth } from './hooks/useAuth';

// Components
import Navbar from './components/Navbar';
import CreateThought from './components/CreateThought';
import ThoughtCard from './components/ThoughtCard';
import LandingPage from './components/LandingPage';

export default function App() {
  // --- 1. Auth Hook (Real Firebase) ---
  const { user, isAuthLoading, authError, signInWithGoogle, logout } = useAuth();

  // --- 2. Thought Manager Hook ---
  const {
    isCreating,
    searchQuery, setSearchQuery,
    filteredThoughts,
    draftBlocks,
    editingId,
    editBlocks,
    renamingId,
    renameText, setRenameText,
    startCreating, closeCreating,
    addDraftNote, handleDraftFile, updateDraftNote, removeDraftBlock, postThought,
    startEditing, cancelEdit, saveEdit,
    addEditNote, handleEditFile, updateEditNote, removeEditBlock,
    startRenaming, saveRename,
    deleteThought
  } = useThoughtManager(user);

  // --- 3. LOADING STATE (While Firebase checks session) ---
  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // --- 4. LANDING PAGE (If not logged in) ---
  if (!user) {
    return (
      <>
        {/* Pass the real Firebase signIn function here */}
        <LandingPage onLogin={signInWithGoogle} />
        
        {/* Simple Error Toast if redirect fails */}
        {authError && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2">
            {authError}
          </div>
        )}
      </>
    );
  }

  // --- 5. MAIN APP (If logged in) ---
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col items-center pb-20">
      
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startCreating={startCreating}
        user={user}         // Pass Real Firebase User
        onLogout={logout}   // Pass Real Logout
      />

      <main className="mt-20 w-full max-w-xl px-4 flex flex-col items-center gap-6">
        
        {/* Creation Card */}
        {isCreating && (
          <CreateThought 
            draftBlocks={draftBlocks}
            addDraftNote={addDraftNote}
            handleDraftFile={handleDraftFile}
            updateDraftNote={updateDraftNote}
            removeDraftBlock={removeDraftBlock}
            postThought={postThought}
            closeCreating={closeCreating}
          />
        )}

        {/* Timeline Feed */}
        <div className="w-full flex flex-col gap-6 pb-10">
          
          <div className="flex items-center justify-between px-2 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-widest">
              {searchQuery ? 'Search Results' : 'Your Timeline'}
            </span>
            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">
              {filteredThoughts.length} Thoughts
            </span>
          </div>

          {filteredThoughts.length === 0 && !isCreating && !searchQuery && (
            <div className="text-center mt-12 p-8 border border-dashed border-slate-300 rounded-xl">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Welcome, {user.displayName?.split(' ')[0]}!</p>
              <p className="text-sm text-slate-400">Start your journey by adding a thought.</p>
            </div>
          )}

          {filteredThoughts.map(thought => (
            <ThoughtCard 
              key={thought.id}
              thought={thought}
              editingId={editingId}
              editBlocks={editBlocks}
              renamingId={renamingId}
              renameText={renameText}
              setRenameText={setRenameText}
              startEditing={startEditing}
              cancelEdit={cancelEdit}
              saveEdit={saveEdit}
              deleteThought={deleteThought}
              addEditNote={addEditNote}
              handleEditFile={handleEditFile}
              updateEditNote={updateEditNote}
              removeEditBlock={removeEditBlock}
              startRenaming={startRenaming}
              saveRename={saveRename}
            />
          ))}
        </div>
      </main>
    </div>
  );
}