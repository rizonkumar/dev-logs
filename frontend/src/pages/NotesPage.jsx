import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotes,
  createNewNote,
  updateExistingNote,
  deleteExistingNote,
  setActiveNote,
} from "../app/features/notesSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, FileText, MoreVertical } from "lucide-react";
import { useDebounce } from "use-debounce";

const NotesPage = () => {
  const dispatch = useDispatch();
  const { notes, activeNote, status } = useSelector((state) => state.notes);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [debouncedTitle] = useDebounce(title, 1000);
  const [debouncedContent] = useDebounce(content, 1000);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      isInitialLoad.current = true;
    } else {
      setTitle("");
      setContent("");
    }
  }, [activeNote]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (
      activeNote &&
      (debouncedTitle !== activeNote.title ||
        debouncedContent !== activeNote.content)
    ) {
      dispatch(
        updateExistingNote({
          noteId: activeNote._id,
          updateData: { title: debouncedTitle, content: debouncedContent },
        })
      );
    }
  }, [debouncedTitle, debouncedContent, activeNote, dispatch]);

  const handleCreateNote = () => {
    dispatch(createNewNote({ title: "Untitled Note", content: "" }));
  };

  const handleDeleteNote = (noteId) => {
    dispatch(deleteExistingNote(noteId));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] text-white">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-1/3 max-w-xs bg-black/20 border-r border-white/10 flex flex-col"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Notes</h2>
          <button
            onClick={handleCreateNote}
            className="p-2 rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {status === "loading" && (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          )}
          {notes.map((note) => (
            <NoteListItem
              key={note._id}
              note={note}
              activeNote={activeNote}
              dispatch={dispatch}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {activeNote ? (
            <motion.div
              key={activeNote._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full h-full flex flex-col"
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full bg-transparent text-4xl font-bold p-2 mb-4 focus:outline-none border-b-2 border-gray-800 focus:border-violet-500 transition-colors"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..."
                className="w-full h-full bg-transparent p-2 text-lg text-gray-300 resize-none focus:outline-none"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-gray-500"
            >
              <FileText size={64} className="mx-auto mb-4" />
              <h3 className="text-2xl font-semibold">
                Select a note or create a new one
              </h3>
              <p>Your thoughts are safe here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const NoteListItem = ({ note, activeNote, dispatch, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      onClick={() => dispatch(setActiveNote(note._id))}
      className={`p-4 border-b border-white/10 cursor-pointer transition-colors relative ${
        activeNote?._id === note._id ? "bg-violet-600/20" : "hover:bg-white/5"
      }`}
    >
      <h3 className="font-semibold truncate">{note.title}</h3>
      <p className="text-sm text-gray-400 truncate">
        {note.content || "No content"}
      </p>
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-1 rounded-full hover:bg-white/10"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note._id);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
