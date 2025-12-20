// src/components/CreateThought.jsx
import React, { useRef } from 'react';
import { FileText, Image as ImageIcon, X } from 'lucide-react';

export default function CreateThought({
  draftBlocks,
  addDraftNote,
  handleDraftFile,
  updateDraftNote,
  removeDraftBlock,
  postThought,
  closeCreating
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="w-full bg-white rounded-xl shadow-xl border border-blue-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ring-4 ring-blue-50/30">
      
      {/* --- Creation Header --- */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <button 
          onClick={addDraftNote} 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
        >
          <FileText className="h-4 w-4" /> Add note
        </button>
        
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold hidden sm:block">
          Builder
        </span>
        
        <div>
           <button 
             onClick={() => fileInputRef.current?.click()} 
             className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm"
           >
            <ImageIcon className="h-4 w-4" /> Add media
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleDraftFile} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* --- Creation Body --- */}
      <div className="p-4 bg-slate-50/50 flex flex-col gap-4 min-h-[150px]">
        {draftBlocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-white">
            <p className="text-sm font-medium">Add blocks to build your thought</p>
          </div>
        ) : (
          draftBlocks.map((block) => (
            <div key={block.id} className="relative group animate-in slide-in-from-top-2 duration-300">
              <button 
                onClick={() => removeDraftBlock(block.id)} 
                className="absolute -right-2 -top-2 z-10 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-full p-1.5 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
              >
                <X className="h-3 w-3" />
              </button>
              
              {block.type === 'note' ? (
                <textarea 
                  autoFocus 
                  value={block.content} 
                  onChange={(e) => updateDraftNote(block.id, e.target.value)} 
                  className="w-full min-h-[120px] p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-y text-sm leading-relaxed shadow-sm" 
                  placeholder="Type note..." 
                />
              ) : (
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <img src={block.content} alt="Draft" className="w-full max-h-96 object-contain bg-slate-100" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- Creation Footer --- */}
      <div className="p-3 bg-white border-t border-slate-100 flex justify-end gap-3">
         <button 
           onClick={closeCreating} 
           className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg"
         >
           Cancel
         </button>
         <button 
           onClick={postThought} 
           disabled={draftBlocks.length === 0} 
           className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md"
         >
           Post Thought
         </button>
      </div>
    </div>
  );
}