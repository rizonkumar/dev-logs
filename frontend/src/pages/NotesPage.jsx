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
import {
  Plus,
  Trash2,
  FileText,
  MoreVertical,
  ArrowLeft,
  Notebook,
} from "lucide-react";
import { useDebounce } from "use-debounce";

const NotesPage = () => {
  const dispatch = useDispatch();
  const { notes, activeNote, status } = useSelector((state) => state.notes);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [debouncedTitle] = useDebounce(title, 1000);
  const [debouncedContent] = useDebounce(content, 1000);

  const [isNoteViewOpen, setIsNoteViewOpen] = useState(false);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setIsNoteViewOpen(true);
      isInitialLoad.current = true;
    } else {
      setTitle("");
      setContent("");
      setIsNoteViewOpen(false);
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

  const handleBackToList = () => {
    dispatch(setActiveNote(null));
    setIsNoteViewOpen(false);
  };

  return (
    <div className="flex h-full text-gray-900 bg-stone-50 overflow-hidden">
      <motion.div
        className={`w-full md:w-1/3 md:max-w-sm bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isNoteViewOpen
            ? "-translate-x-full md:translate-x-0"
            : "translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-stone-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Notebook className="text-yellow-500" /> Your Notes
          </h2>
          <button
            onClick={handleCreateNote}
            className="p-2 rounded-lg bg-gray-800 text-white hover:bg-black transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {status === "loading" && notes.length === 0 && (
            <div className="p-4 text-center text-gray-500">Loading...</div>
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

      <div
        className={`w-full flex-1 flex flex-col p-4 sm:p-6 md:p-10 absolute md:static inset-0 transition-transform duration-300 ease-in-out ${
          isNoteViewOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <AnimatePresence mode="wait">
          {activeNote ? (
            <motion.div
              key={activeNote._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full h-full flex flex-col"
            >
              <div className="flex items-center mb-4">
                <button
                  onClick={handleBackToList}
                  className="md:hidden p-2 mr-2 rounded-full hover:bg-stone-100"
                >
                  <ArrowLeft size={20} />
                </button>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full bg-transparent text-3xl md:text-4xl font-bold focus:outline-none border-b-2 border-transparent focus:border-yellow-500 transition-colors"
                />
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..."
                className="w-full h-full bg-transparent p-2 text-base md:text-lg text-gray-700 resize-none focus:outline-none leading-relaxed"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-gray-400 m-auto"
            >
              <FileText size={64} className="mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl font-semibold text-gray-800">
                Select a note to get started
              </h3>
              <p className="text-gray-500">Your thoughts are safe here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const NoteListItem = ({ note, activeNote, dispatch, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = activeNote?._id === note._id;

  return (
    <div
      onClick={() => dispatch(setActiveNote(note._id))}
      className={`p-4 border-b border-stone-200 cursor-pointer transition-colors relative group ${
        isActive ? "bg-yellow-50" : "hover:bg-stone-100"
      }`}
    >
      <h3
        className={`font-semibold truncate ${
          isActive ? "text-yellow-800" : "text-gray-800"
        }`}
      >
        {note.title}
      </h3>
      <p className="text-sm text-gray-500 truncate mt-1">
        {note.content || "No content"}
      </p>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-1.5 rounded-full hover:bg-stone-200"
        >
          <MoreVertical size={16} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 mt-2 w-36 bg-white border border-stone-200 rounded-lg shadow-xl z-10"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note._id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotesPage;
