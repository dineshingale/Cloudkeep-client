import { useState, useEffect } from 'react';

// Configuration
// -----------------------------------------------------------------------------
// AUTOMATIC SWITCH:
// 1. If running locally (npm run dev), use localhost:3000
// 2. If deployed (on Vercel/Render), use your live Render Backend
// -----------------------------------------------------------------------------
const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:3000/api/records'
  : 'https://cloudkeep-server.onrender.com/api/records';

  
export function useThoughtManager(user) {
  // --- Global State ---
  const [isCreating, setIsCreating] = useState(false);
  const [thoughts, setThoughts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  // --- Creation Mode State ---
  const [draftBlocks, setDraftBlocks] = useState([]);

  // --- Edit Mode State ---
  const [editingId, setEditingId] = useState(null);
  const [editBlocks, setEditBlocks] = useState([]);

  // --- Renaming State ---
  const [renamingId, setRenamingId] = useState(null);
  const [renameText, setRenameText] = useState('');

  // ==========================================
  // 0. SERVER CONNECTION (Fetch Data)
  // ==========================================
  
  useEffect(() => {
    if (user) {
      fetchThoughts();
    } else {
      setThoughts([]); // Clear thoughts if no user is logged in
    }
  }, [user]);

  const fetchThoughts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log("Fetching thoughts for user:", user.uid); 
      
      // Correct: Includes userId in query
      const response = await fetch(`${API_URL}?userId=${user.uid}`);
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const json = await response.json(); 
      const records = json.data || []; 
      
      const formattedThoughts = records.map(record => ({
        id: record._id, 
        title: record.title || "Untitled",
        timestamp: new Date(record.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        blocks: [
            ...(record.fileUrl ? [{ id: 'img-'+record._id, type: 'media', content: record.fileUrl }] : []),
            ...(record.body ? [{ id: 'txt-'+record._id, type: 'note', content: record.body }] : [])
        ]
      }));

      setThoughts(formattedThoughts);
    } catch (error) {
      console.error("Error loading thoughts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 1. CREATION ACTIONS
  // ==========================================
  const startCreating = () => {
    setIsCreating(true);
    setEditingId(null);
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
      const newBlock = { 
        id: Date.now().toString(), 
        type: 'media', 
        content: objectUrl,
        file: file 
      };
      setDraftBlocks(prev => [newBlock, ...prev]);
    }
    event.target.value = null;
  };

  const updateDraftNote = (id, newText) => {
    setDraftBlocks(blocks => blocks.map(b => b.id === id ? { ...b, content: newText } : b));
  };

  const removeDraftBlock = (id) => {
    setDraftBlocks(blocks => blocks.filter(b => b.id !== id));
  };

  // --- SEND DATA TO SERVER ---
  const postThought = async () => {
    if (draftBlocks.length === 0) return;
    if (!user) {
        console.error("User not authenticated");
        return;
    }

    try {
        const formData = new FormData();
        
        // Correct: Appends userId to FormData
        formData.append('userId', user.uid); 
        formData.append('title', "My Thought"); 

        const textContent = draftBlocks
            .filter(b => b.type === 'note')
            .map(b => b.content)
            .join('\n');
        
        formData.append('body', textContent);

        const mediaBlock = draftBlocks.find(b => b.type === 'media' && b.file);
        if (mediaBlock) {
            formData.append('file', mediaBlock.file);
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData, 
        });

        if (response.ok) {
            await fetchThoughts(); 
            setDraftBlocks([]);
            setIsCreating(false);
        } else {
            console.error("Failed to save thought. Status:", response.status);
        }

    } catch (error) {
        console.error("Error posting thought:", error);
    }
  };

  // ==========================================
  // 2. EDITING ACTIONS (With Server PUT)
  // ==========================================
  const startEditing = (thought) => {
    setEditingId(thought.id);
    setEditBlocks([...thought.blocks]); 
    setIsCreating(false); 
    setRenamingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBlocks([]);
  };

  // Save Content Edits
  const saveEdit = async () => {
    try {
        const textContent = editBlocks
            .filter(b => b.type === 'note')
            .map(b => b.content)
            .join('\n');

        // --- UPDATED: Sending userId in body ---
        const response = await fetch(`${API_URL}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                body: textContent,
                userId: user.uid // <--- ADDED for Security
            })
        });

        if (response.ok) {
            setThoughts(prev => prev.map(t => 
                t.id === editingId ? { ...t, blocks: editBlocks } : t
            ));
            setEditingId(null);
            setEditBlocks([]);
        } else {
            console.error("Failed to save edit");
        }
    } catch (error) {
        console.error("Error saving edit:", error);
    }
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
  // 3. RENAMING ACTIONS (With Server PUT)
  // ==========================================
  const startRenaming = (e, thought) => {
    e.stopPropagation();
    setRenamingId(thought.id);
    setRenameText(thought.title);
  };

  // Save Rename
  const saveRename = async () => {
    if (!renamingId) return;

    try {
        const newTitle = renameText.trim() || "Untitled Thought";

        // --- UPDATED: Sending userId in body ---
        const response = await fetch(`${API_URL}/${renamingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: newTitle,
                userId: user.uid // <--- ADDED for Security
            })
        });

        if (response.ok) {
            setThoughts(prev => prev.map(t => 
                t.id === renamingId ? { ...t, title: newTitle } : t
            ));
            setRenamingId(null);
        } else {
            console.error("Failed to save rename");
        }
    } catch (error) {
        console.error("Error saving rename:", error);
    }
  };

  // ==========================================
  // 4. GENERAL ACTIONS
  // ==========================================
  const deleteThought = async (e, thoughtId) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this thought?")) return;

    try {
        // --- UPDATED: Sending userId in body ---
        // DELETE requests usually don't have bodies, but Express supports it.
        // We add headers to ensure the server parses the JSON.
        const response = await fetch(`${API_URL}/${thoughtId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid }) // <--- ADDED for Security
        });

        if (response.ok) {
            setThoughts(prev => prev.filter(t => t.id !== thoughtId));
            if (editingId === thoughtId) cancelEdit();
        } else {
            console.error("Failed to delete thought on server");
        }
    } catch (error) {
        console.error("Error deleting thought:", error);
    }
  };

  const filteredThoughts = thoughts.filter(thought => {
    const searchLower = searchQuery.toLowerCase();
    if (thought.title.toLowerCase().includes(searchLower)) return true;
    return thought.blocks.some(block => 
      block.type === 'note' && block.content.toLowerCase().includes(searchLower)
    );
  });

  return {
    isCreating, isLoading,
    searchQuery, setSearchQuery,
    filteredThoughts,
    draftBlocks,
    editingId, editBlocks,
    renamingId, renameText, setRenameText,
    startCreating, closeCreating,
    addDraftNote, handleDraftFile, updateDraftNote, removeDraftBlock, postThought,
    startEditing, cancelEdit, saveEdit,
    addEditNote, handleEditFile, updateEditNote, removeEditBlock,
    startRenaming, saveRename,
    deleteThought
  };
}