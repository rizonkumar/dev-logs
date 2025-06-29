import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteLog, updateLog } from "../app/features/logsSlice";
import TimelineLogEntry from "./TimelineLogEntry";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  BookOpen,
  Clock,
  Type,
  Hash,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

const getDateRelativeDisplay = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (daysAgo <= 7) {
    return `${daysAgo} days ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

const DateCard = ({
  date,
  logs,
  isExpanded,
  onToggle,
  viewMode,
  setViewMode,
}) => {
  const dispatch = useDispatch();
  const [editingLogId, setEditingLogId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

  const relativeDate = getDateRelativeDisplay(date);
  const fullDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const handleEditClick = (log) => {
    setEditingLogId(log._id);
    setEditText(log.entry);
  };

  const handleDeleteClick = (log) => {
    setLogToDelete(log);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (logToDelete) {
      dispatch(deleteLog(logToDelete._id));
      setLogToDelete(null);
    }
    setIsModalOpen(false);
  };

  const handleUpdate = (logId) => {
    if (editText.trim() === "") return;
    dispatch(updateLog({ logId, updateData: { entry: editText } }));
    setEditingLogId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingLogId(null);
    setEditText("");
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this log entry? This action cannot be undone."
      />

      <div className="group relative overflow-hidden">
        <div
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg 
                     rounded-2xl border border-gray-700/40 shadow-xl 
                     hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-6 border-b border-gray-700/30">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center space-x-4 cursor-pointer flex-grow"
                onClick={onToggle}
              >
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown
                      size={24}
                      className="text-purple-400 transition-transform duration-300 rotate-0"
                    />
                  ) : (
                    <ChevronRight
                      size={24}
                      className="text-gray-500 group-hover:text-purple-400 transition-all duration-300"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    {relativeDate === "Today" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {relativeDate}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {fullDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-700/50 border border-gray-600/50">
                  <BookOpen size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-300 font-medium">
                    {logs.length} {logs.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="flex items-center space-x-1 bg-gray-700/50 rounded-lg p-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode("timeline");
                      }}
                      className={`px-3 py-1 rounded-md text-xs transition-all duration-300 ${
                        viewMode === "timeline"
                          ? "bg-purple-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode("grid");
                      }}
                      className={`px-3 py-1 rounded-md text-xs transition-all duration-300 ${
                        viewMode === "grid"
                          ? "bg-purple-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Grid
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-6">
              {viewMode === "timeline" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <Hash className="w-5 h-5 text-purple-400" />
                      <span>Timeline View</span>
                    </h4>
                  </div>
                  <ol className="space-y-6">
                    {logs.map((log, index) => (
                      <TimelineLogEntry
                        key={log._id || index}
                        log={log}
                        index={index}
                        totalLogs={logs.length}
                      />
                    ))}
                  </ol>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log, index) => (
                    <div
                      key={log._id || index}
                      className="group relative p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 
                               border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 
                               hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.01]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        {editingLogId === log._id ? (
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
                                onClick={cancelEdit}
                                className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 
                                        hover:border-gray-500 rounded-lg transition-all duration-300 text-sm
                                        flex items-center space-x-2"
                              >
                                <X size={16} />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={() => handleUpdate(log._id)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 
                                        hover:from-purple-600 hover:to-pink-600 text-white rounded-lg 
                                        transition-all duration-300 text-sm flex items-center space-x-2
                                        shadow-lg shadow-purple-500/25"
                              >
                                <Save size={16} />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2" />
                              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm group-hover:text-white transition-colors duration-300 flex-grow">
                                {log.entry}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/30">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock size={12} className="mr-1" />
                                  {new Date(
                                    log.createdAt || log.date
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <span className="flex items-center">
                                  <Type size={12} className="mr-1" />
                                  {log.entry
                                    ? log.entry
                                        .trim()
                                        .split(/\s+/)
                                        .filter((word) => word.length > 0)
                                        .length
                                    : 0}{" "}
                                  words
                                </span>
                                <span className="flex items-center">
                                  <Hash size={12} className="mr-1" />
                                  {log.entry ? log.entry.length : 0} chars
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => handleEditClick(log)}
                                  className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 
                                          rounded-lg transition-all duration-300 group/btn"
                                >
                                  <Edit
                                    size={16}
                                    className="group-hover/btn:scale-110 transition-transform duration-200"
                                  />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(log)}
                                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 
                                          rounded-lg transition-all duration-300 group/btn"
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DateCard;
