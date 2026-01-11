import React, { useRef, ChangeEvent, Dispatch, SetStateAction, MouseEvent } from 'react';
import {
    Plus, Edit2, Trash2, X, Save, Check, AlertCircle
} from 'lucide-react';
import { Thought, Block } from '../types';

interface ThoughtCardProps {
    thought: Thought;
    // Global State
    editingId: string | null;
    renamingId: string | null;
    renameText: string;
    setRenameText: Dispatch<SetStateAction<string>>;
    // Edit Buffer State
    editBlocks: Block[];
    // Actions
    startEditing: (thought: Thought) => void;
    cancelEdit: () => void;
    saveEdit: () => void;
    deleteThought: (e: MouseEvent, id: string) => void;
    // Edit Actions
    addEditNote: () => void;
    handleEditFile: (event: ChangeEvent<HTMLInputElement>) => void;
    updateEditNote: (id: string, text: string) => void;
    removeEditBlock: (id: string) => void;
    // Rename Actions
    startRenaming: (e: MouseEvent, thought: Thought) => void;
    saveRename: () => void;
}

export default function ThoughtCard({
    thought,
    // Global State
    editingId,
    renamingId,
    renameText,
    setRenameText,
    // Edit Buffer State
    editBlocks,
    // Actions
    startEditing,
    cancelEdit,
    saveEdit,
    deleteThought,
    // Edit Actions
    addEditNote,
    handleEditFile,
    updateEditNote,
    removeEditBlock,
    // Rename Actions
    startRenaming,
    saveRename
}: ThoughtCardProps) {
    const editFileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = editingId === thought.id;

    // Local helper for Enter key on rename
    const handleRenameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') saveRename();
    };

    return (
        <div
            onDoubleClick={() => !isEditing && startEditing(thought)}
            className={`w-full bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isEditing ? 'border-blue-400 ring-4 ring-blue-50' : 'border-slate-200 hover:shadow-md'
                }`}
        >

            {/* --- HEADER --- */}
            <div className={`p-4 border-b flex items-center justify-between ${isEditing ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-50'
                }`}>

                {/* EDIT MODE HEADER */}
                {isEditing ? (
                    <div className="flex w-full justify-between items-center animate-in fade-in duration-200">
                        <button
                            onClick={addEditNote}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100"
                        >
                            <Plus className="h-3 w-3" /> Note
                        </button>

                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                            <Edit2 className="h-3 w-3" /> Editing
                        </span>

                        <div>
                            <button
                                onClick={() => editFileInputRef.current?.click()}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100"
                            >
                                <Plus className="h-3 w-3" /> Media
                            </button>
                            <input
                                type="file"
                                ref={editFileInputRef}
                                onChange={handleEditFile}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>
                ) : (
                    /* DISPLAY MODE HEADER */
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 text-xs font-bold border border-white shadow-sm">
                            ME
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            {/* Renaming Logic */}
                            {renamingId === thought.id ? (
                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={renameText}
                                        onChange={(e) => setRenameText(e.target.value)}
                                        onBlur={saveRename}
                                        onKeyDown={handleRenameKeyDown}
                                        className="text-sm font-bold text-slate-800 border-b-2 border-blue-500 outline-none bg-transparent w-full"
                                    />
                                    <button onMouseDown={saveRename} className="text-green-600">
                                        <Check className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={(e) => startRenaming(e, thought)}
                                    className="group flex items-center gap-2 cursor-pointer w-fit"
                                >
                                    <span className="text-sm font-bold text-slate-700 truncate hover:text-blue-600">
                                        {thought.title}
                                    </span>
                                    <Edit2 className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                                {thought.timestamp}
                            </span>
                        </div>
                    </div>
                )}

                {/* Delete Button (Only visible when NOT editing) */}
                {!isEditing && (
                    <button
                        onClick={(e) => deleteThought(e, thought.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors p-2 flex-shrink-0"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* --- BODY --- */}
            <div className={`p-5 flex flex-col gap-4 ${isEditing ? 'bg-slate-50 min-h-[150px]' : 'bg-slate-50/10'
                }`}>

                {/* EDIT MODE BODY */}
                {isEditing ? (
                    editBlocks.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 italic text-sm">
                            Empty thought... add something?
                        </div>
                    ) : (
                        editBlocks.map((block) => (
                            <div key={block.id} className="relative group animate-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => removeEditBlock(block.id)}
                                    className="absolute -right-2 -top-2 z-10 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-full p-1 shadow-sm"
                                >
                                    <X className="h-3 w-3" />
                                </button>

                                {block.type === 'note' ? (
                                    <textarea
                                        autoFocus
                                        value={block.content}
                                        onChange={(e) => updateEditNote(block.id, e.target.value)}
                                        className="w-full min-h-[100px] p-3 rounded-lg border border-blue-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30 resize-y text-sm shadow-sm"
                                    />
                                ) : (
                                    <div className="rounded-lg overflow-hidden border border-blue-200 bg-white p-1">
                                        <img src={block.content} alt="Edit Media" className="w-full max-h-80 object-contain" />
                                    </div>
                                )}
                            </div>
                        ))
                    )
                ) : (
                    /* DISPLAY MODE BODY */
                    thought.blocks.map((block) => (
                        <div key={block.id} className="w-full">
                            {block.type === 'note' ? (
                                <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-100/50 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
                                    {block.content}
                                </div>
                            ) : (
                                <div className="rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                                    <img src={block.content} alt="Thought media" className="w-full object-cover max-h-[500px]" />
                                </div>
                            )}
                        </div>
                    ))
                )}

                {/* Hint for Double Tap */}
                {!isEditing && (
                    <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-slate-300 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-100">
                            <AlertCircle className="h-3 w-3" /> Double-tap card to edit
                        </span>
                    </div>
                )}
            </div>

            {/* --- EDIT MODE FOOTER --- */}
            {isEditing && (
                <div className="p-3 bg-white border-t border-blue-100 flex justify-end gap-3 animate-in slide-in-from-bottom-2">
                    <button
                        onClick={cancelEdit}
                        className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={saveEdit}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md"
                    >
                        <Save className="h-4 w-4" /> Save Changes
                    </button>
                </div>
            )}
        </div>
    );
}
