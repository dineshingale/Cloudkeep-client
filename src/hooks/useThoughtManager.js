// src/hooks/useThoughtManager.js
import { useState } from 'react';

export function useThoughtManager() {
  // --- Global State ---
  const [isCreating, setIsCreating] = useState(false);
  const [thoughts, setThoughts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Creation Mode State ---
  const [draftBlocks, setDraftBlocks] = useState([]);

  // --- Edit Mode State ---
  const [editingId, setEditingId] = useState(null);
  const [editBlocks, setEditBlocks] = useState([]);

  // --- Renaming State ---
  const [renamingId, setRenamingId] = useState(null);
  const [renameText, setRenameText] = useState('');

  // ==========================================
  // 1. CREATION ACTIONS
  // ==========================================
  const startCreating = () => {
    setIsCreating(true);
    setEditingId(null); // Close active edits if any
  };

  const closeCreating = () => setIsCreating(false);

  const addDraftNote = () => {
    const newBlock = { id: Date.now().toString(), type: 'note', content: '' };
    setDraftBlocks(prev => [newBlock, ...prev]);
  };

  const handleDraftFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const newBlock = { id: Date.now().toString(), type: 'media', content: objectUrl };
      setDraftBlocks(prev => [newBlock, ...prev]);
    }
    event.target.value = null; // Reset input
  };

  const updateDraftNote = (id, newText) => {
    setDraftBlocks(blocks => blocks.map(b => b.id === id ? { ...b, content: newText } : b));
  };

  const removeDraftBlock = (id) => {
    setDraftBlocks(blocks => blocks.filter(b => b.id !== id));
  };

  const postThought = () => {
    if (draftBlocks.length === 0) return;

    const newThought = {
      id: Date.now(),
      title: "My Thought",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      blocks: [...draftBlocks]
    };

    setThoughts(prev => [newThought, ...prev]);
    setDraftBlocks([]);
    setIsCreating(false);
  };

  // ==========================================
  // 2. EDITING ACTIONS
  // ==========================================
  const startEditing = (thought) => {
    setEditingId(thought.id);
    setEditBlocks([...thought.blocks]); // Load existing blocks into buffer
    setIsCreating(false); // Close creation mode
    setRenamingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBlocks([]);
  };

  const saveEdit = () => {
    setThoughts(prev => prev.map(t => 
      t.id === editingId ? { ...t, blocks: editBlocks } : t
    ));
    setEditingId(null);
    setEditBlocks([]);
  };

  const addEditNote = () => {
    const newBlock = { id: Date.now().toString(), type: 'note', content: '' };
    setEditBlocks(prev => [newBlock, ...prev]);
  };

  const handleEditFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const newBlock = { id: Date.now().toString(), type: 'media', content: objectUrl };
      setEditBlocks(prev => [newBlock, ...prev]);
    }
    event.target.value = null;
  };

  const updateEditNote = (id, newText) => {
    setEditBlocks(blocks => blocks.map(b => b.id === id ? { ...b, content: newText } : b));
  };

  const removeEditBlock = (id) => {
    setEditBlocks(blocks => blocks.filter(b => b.id !== id));
  };

  // ==========================================
  // 3. RENAMING ACTIONS
  // ==========================================
  const startRenaming = (e, thought) => {
    e.stopPropagation();
    setRenamingId(thought.id);
    setRenameText(thought.title);
  };

  const saveRename = () => {
    if (renamingId) {
      setThoughts(prev => prev.map(t => 
        t.id === renamingId ? { ...t, title: renameText.trim() || "Untitled Thought" } : t
      ));
      setRenamingId(null);
    }
  };

  // ==========================================
  // 4. GENERAL ACTIONS & FILTERING
  // ==========================================
  const deleteThought = (e, thoughtId) => {
    e.stopPropagation();
    setThoughts(prev => prev.filter(t => t.id !== thoughtId));
    if (editingId === thoughtId) cancelEdit();
  };

  const filteredThoughts = thoughts.filter(thought => {
    const searchLower = searchQuery.toLowerCase();
    if (thought.title.toLowerCase().includes(searchLower)) return true;
    return thought.blocks.some(block => 
      block.type === 'note' && block.content.toLowerCase().includes(searchLower)
    );
  });

  // Return everything needed by the components
  return {
    // State
    isCreating,
    searchQuery, setSearchQuery,
    filteredThoughts,
    draftBlocks,
    editingId,
    editBlocks,
    renamingId,
    renameText, setRenameText,
    
    // Actions
    startCreating, closeCreating,
    addDraftNote, handleDraftFile, updateDraftNote, removeDraftBlock, postThought,
    startEditing, cancelEdit, saveEdit,
    addEditNote, handleEditFile, updateEditNote, removeEditBlock,
    startRenaming, saveRename,
    deleteThought
  };
}