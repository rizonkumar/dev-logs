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
  };

  return (
    <div className="flex h-full text-gray-900 dark:text-stone-100 bg-stone-50 dark:bg-stone-950 overflow-hidden relative">
      <div className="w-full h-full md:w-1/3 md:max-w-sm flex-shrink-0 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-700 flex flex-col">
        <div className="p-4 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Notebook className="text-yellow-500" /> Your Notes
          </h2>
          <button
            onClick={handleCreateNote}
            aria-label="Create note"
            className="p-2 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 ring-1 ring-yellow-300/30 dark:ring-yellow-400/30 shadow-sm transition-all duration-150 hover:scale-105"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {status === "loading" && notes.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-stone-400">
              Loading...
            </div>
          )}
          {status === "succeeded" && notes.length === 0 && (
            <div className="text-center p-8 flex flex-col items-center justify-center h-full">
              <FileText size={48} className="mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                No notes yet
              </h3>
              <p className="text-gray-500 dark:text-stone-400 text-sm mb-4">
                Create your first note to get started.
              </p>
              <button
                onClick={handleCreateNote}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <Plus size={16} /> Create Note
              </button>
            </div>
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
      </div>

      <div
        className={`absolute inset-0 md:static w-full flex-1 flex flex-col bg-stone-50 dark:bg-stone-950 transition-transform duration-300 ease-in-out ${
          isNoteViewOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <AnimatePresence mode="wait">
          {activeNote ? (
            <EditorView
              activeNote={activeNote}
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              handleBackToList={handleBackToList}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-gray-400 dark:text-stone-400 m-auto hidden md:flex flex-col items-center"
            >
              <FileText size={64} className="mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Select a note to get started
              </h3>
              <p className="text-gray-500 dark:text-stone-400">
                Your thoughts are safe here.
              </p>
              <button
                onClick={handleCreateNote}
                className="mt-4 px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Create a new note
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const EditorView = ({
  activeNote,
  title,
  setTitle,
  content,
  setContent,
  handleBackToList,
}) => (
  <motion.div
    key={activeNote._id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full h-full flex flex-col p-4 sm:p-6 md:p-10"
  >
    <div className="flex items-center mb-4 flex-shrink-0">
      <button
        onClick={handleBackToList}
        className="md:hidden p-2 -ml-2 mr-2 rounded-full text-gray-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
      >
        <ArrowLeft size={24} />
      </button>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note Title"
        className="w-full bg-transparent text-2xl sm:text-3xl md:text-4xl font-bold focus:outline-none border-b-2 border-transparent focus:border-yellow-500 transition-colors text-gray-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500"
      />
    </div>
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Start writing..."
      className="w-full h-full bg-transparent p-2 text-base md:text-lg text-gray-700 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-500 resize-none focus:outline-none leading-relaxed"
    />
  </motion.div>
);

const NoteListItem = ({ note, activeNote, dispatch, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = activeNote?._id === note._id;

  return (
    <div
      onClick={() => dispatch(setActiveNote(note._id))}
      className={`p-4 border-b border-stone-200 dark:border-stone-700 cursor-pointer transition-colors relative group ${
        isActive
          ? "bg-yellow-50 dark:bg-yellow-950/20"
          : "hover:bg-stone-100 dark:hover:bg-stone-800"
      }`}
    >
      <h3
        className={`font-semibold truncate ${
          isActive
            ? "text-yellow-800 dark:text-yellow-200"
            : "text-gray-800 dark:text-stone-200"
        }`}
      >
        {note.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-stone-400 truncate mt-1">
        {note.content || "No content"}
      </p>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700"
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
              className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-xl z-10"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note._id);
                  setMenuOpen(false);
                }}
                className="group w-full text-left px-3 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-800 dark:hover:text-red-200 ring-1 ring-transparent hover:ring-red-300/50 dark:hover:ring-red-500/30 rounded-md transition-all flex items-center gap-2"
              >
                <Trash2
                  size={14}
                  className="transition-transform group-hover:scale-110"
                />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotesPage;
