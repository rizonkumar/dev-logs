import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  createLog,
  deleteLog,
  updateLog,
  fetchLogs,
} from "../app/features/logsSlice";
import {
  ArrowLeft,
  Calendar,
  PlusCircle,
  Trash2,
  Edit,
  X,
  AlertTriangle,
  Clock,
  Save,
  BookOpen,
  Sparkles,
  FileText,
  Hash,
} from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-700/50">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/30">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white mb-2">Delete Entry</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button
            type="button"
            className="flex-1 px-4 py-3 text-gray-300 border border-gray-600 hover:border-gray-500 
                      hover:text-white rounded-xl transition-all duration-300 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 
                      hover:from-red-600 hover:to-pink-600 text-white rounded-xl 
                      transition-all duration-300 font-medium shadow-lg shadow-red-500/25"
            onClick={onConfirm}
          >
            Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
};

const LogItem = ({ log, index, totalLogs }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(log.entry);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteLog(log._id));
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    if (editText.trim() === "") return;
    dispatch(updateLog({ logId: log._id, updateData: { entry: editText } }));
    setIsEditing(false);
  };

  const createdTime = new Date(log.createdAt || log.date).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this log entry? This action cannot be undone."
      />

      <li
        className="group relative"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex">
          {/* Timeline */}
          <div className="flex flex-col items-center mr-6">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                            flex items-center justify-center font-bold text-sm border border-purple-500/30
                            group-hover:scale-110 transition-transform duration-300"
              >
                <span className="text-purple-300">{index + 1}</span>
              </div>
              {/* Pulse animation for the first item */}
              {index === 0 && (
                <div className="absolute inset-0 w-10 h-10 rounded-xl bg-purple-400/20 animate-ping" />
              )}
            </div>
            {/* Connecting line */}
            {index < totalLogs - 1 && (
              <div className="w-px h-full bg-gradient-to-b from-purple-500/30 to-transparent mt-4 min-h-[60px]" />
            )}
          </div>

          {/* Content */}
          <div className="flex-grow">
            <div
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg 
                        p-6 rounded-2xl border border-gray-700/40 shadow-xl
                        hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500
                        group-hover:border-gray-600/50"
            >
              {/* Animated background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-gray-900/70 p-4 rounded-xl border border-purple-500/50 
                                  focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none 
                                  transition-all duration-300 text-gray-300 placeholder-gray-500 resize-none
                                  min-h-[120px] shadow-inner"
                        autoFocus
                        placeholder="Update your log entry..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                        {editText.length} characters
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 
                                  hover:border-gray-500 rounded-lg transition-all duration-300 text-sm
                                  flex items-center space-x-2"
                        title="Cancel editing"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 
                                  hover:from-purple-600 hover:to-pink-600 text-white rounded-lg 
                                  transition-all duration-300 text-sm flex items-center space-x-2
                                  shadow-lg shadow-purple-500/25"
                        title="Save changes"
                      >
                        <Save size={16} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Entry content */}
                    <div className="mb-4">
                      <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm group-hover:text-white transition-colors duration-300">
                        {log.entry}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{createdTime}</span>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 
                                    rounded-lg transition-all duration-300 group/btn"
                          title="Edit entry"
                        >
                          <Edit
                            size={16}
                            className="group-hover/btn:scale-110 transition-transform duration-200"
                          />
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 
                                    rounded-lg transition-all duration-300 group/btn"
                          title="Delete entry"
                        >
                          <Trash2
                            size={16}
                            className="group-hover/btn:scale-110 transition-transform duration-200"
                          />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

const AddEntryForm = ({ date, newEntry, setNewEntry, onSubmit, isLoading }) => (
  <div className="mb-12 relative overflow-hidden">
    <div
      className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg 
                 rounded-2xl border border-gray-700/40 shadow-xl 
                 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 p-6"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-transparent to-green-600/10 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="relative">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-green-500/20 flex items-center justify-center border border-teal-500/30">
            <PlusCircle className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Add New Entry</h3>
            <p className="text-sm text-gray-400">
              Document your thoughts and progress for this day
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="w-full bg-gray-900/70 p-4 rounded-xl border border-gray-600/50 
                        focus:ring-2 focus:ring-teal-400 focus:border-transparent focus:outline-none 
                        transition-all duration-300 text-gray-300 placeholder-gray-500 resize-none
                        min-h-[120px] shadow-inner"
              placeholder="What did you accomplish today? Share your insights, challenges, and victories..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {newEntry.length} characters
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar size={14} />
              <span>
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <button
              type="submit"
              disabled={!newEntry.trim() || isLoading}
              className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 
                        text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 
                        flex items-center space-x-2 text-sm shadow-lg shadow-teal-500/25
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Add Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

const DateHeader = ({ date, entryCount }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const weekday = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  const isToday = new Date(date).toDateString() === new Date().toDateString();
  const isYesterday =
    new Date(date).toDateString() ===
    new Date(Date.now() - 86400000).toDateString();

  let relativeDate = formattedDate;
  if (isToday) relativeDate = "Today";
  else if (isYesterday) relativeDate = "Yesterday";

  return (
    <div className="mb-12 relative">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                         flex items-center justify-center border border-purple-500/30"
          >
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
          {isToday && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            {relativeDate}
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-xl text-gray-400">{weekday}</p>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <FileText size={14} className="text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">
                {entryCount} {entryCount === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>
          {!isToday && !isYesterday && (
            <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ onAddEntry }) => (
  <div className="text-center py-20">
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-12 border border-gray-700/40">
      <div
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 
                     flex items-center justify-center mx-auto mb-6 border border-gray-600/30"
      >
        <BookOpen size={32} className="text-gray-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">No entries yet</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
        This day is waiting for your story. Start documenting your development
        journey!
      </p>
      <button
        onClick={onAddEntry}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                  text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 
                  shadow-lg shadow-purple-500/25 flex items-center space-x-2 mx-auto"
      >
        <Sparkles size={18} />
        <span>Write Your First Entry</span>
      </button>
    </div>
  </div>
);

function LogDetailPage() {
  const { date } = useParams();
  const dispatch = useDispatch();
  const [newEntry, setNewEntry] = useState("");

  const { logs, status, error } = useSelector((state) => state.logs);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLogs());
    }
  }, [status, dispatch]);

  const logsForDate = logs.filter(
    (log) => new Date(log.date).toISOString().split("T")[0] === date
  );

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (newEntry.trim() === "") return;
    dispatch(createLog({ date: date, entry: newEntry }));
    setNewEntry("");
  };

  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading entries for this date...</p>
        </div>
      </div>
    );
  }

  if (status === "failed" && error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-12">
            <X size={48} className="mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-bold text-red-400 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-teal-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <Link
          to="/logs"
          className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 
                    transition-all duration-300 font-semibold mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
          />
          Back to All Logs
        </Link>

        {/* Date Header */}
        <DateHeader date={date} entryCount={logsForDate.length} />

        {/* Add Entry Form */}
        <AddEntryForm
          date={date}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onSubmit={handleAddEntry}
          isLoading={status === "loading"}
        />

        {/* Entries */}
        <div>
          {logsForDate.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <Hash className="w-6 h-6 text-purple-400" />
                  <span>Timeline</span>
                </h2>
                <div className="text-sm text-gray-400">
                  {logsForDate.length}{" "}
                  {logsForDate.length === 1 ? "entry" : "entries"} total
                </div>
              </div>

              <ol className="space-y-8">
                {logsForDate.map((log, index) => (
                  <LogItem
                    key={log._id}
                    log={log}
                    index={index}
                    totalLogs={logsForDate.length}
                  />
                ))}
              </ol>
            </>
          ) : (
            <EmptyState onAddEntry={scrollToForm} />
          )}
        </div>
      </div>
    </div>
  );
}

export default LogDetailPage;
