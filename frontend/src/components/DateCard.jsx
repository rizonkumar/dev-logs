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

      <div className="group relative">
        {/* Main Card */}
        <div
          className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-stone-200/50 dark:border-stone-700/50
                      shadow-xl shadow-stone-900/5 dark:shadow-stone-100/5 transition-all duration-500 hover:shadow-2xl
                      hover:shadow-stone-900/10 dark:hover:shadow-stone-100/10 hover:scale-[1.02]"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-stone-200/50 dark:border-stone-700/50">
            <div className="flex items-center justify-between">
              {/* Left Section - Clickable Area */}
              <div
                className="flex items-center space-x-6 cursor-pointer flex-grow group/header"
                onClick={onToggle}
              >
                {/* Expand/Collapse Icon */}
                <div className="flex-shrink-0 relative">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                                ${
                                  isExpanded
                                    ? "bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                                    : "bg-stone-100 dark:bg-stone-800 group-hover/header:bg-blue-100 dark:group-hover/header:bg-blue-950/30"
                                }`}
                  >
                    {isExpanded ? (
                      <ChevronDown
                        size={20}
                        className={`transition-all duration-300 ${
                          isExpanded
                            ? "text-white rotate-0"
                            : "text-stone-400 group-hover/header:text-blue-600"
                        }`}
                      />
                    ) : (
                      <ChevronRight
                        size={20}
                        className="text-stone-400 group-hover/header:text-blue-600 transition-all duration-300 group-hover/header:translate-x-0.5"
                      />
                    )}
                  </div>

                  {/* Pulse effect for today */}
                  {relativeDate === "Today" && (
                    <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-blue-500/20" />
                  )}
                </div>

                {/* Date Info */}
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/40 dark:to-purple-950/40
                                  flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50 shadow-lg shadow-blue-500/10"
                    >
                      <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    {relativeDate === "Today" && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-stone-900 shadow-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300 bg-clip-text text-transparent">
                      {relativeDate}
                    </h3>
                    <p className="text-stone-500 dark:text-stone-400 font-medium">
                      {fullDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section - Stats & Controls */}
              <div className="flex items-center space-x-4">
                {/* Entry Count */}
                <div
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80
                              border border-stone-200/50 dark:border-stone-700/50 backdrop-blur-sm"
                >
                  <BookOpen
                    size={16}
                    className="text-stone-500 dark:text-stone-400"
                  />
                  <span className="text-sm text-stone-700 dark:text-stone-300 font-semibold">
                    {logs.length} {logs.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                {/* View Mode Toggle */}
                {isExpanded && (
                  <div className="flex items-center space-x-1 bg-stone-100/80 dark:bg-stone-800/80 rounded-2xl p-1 border border-stone-200/50 dark:border-stone-700/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode("timeline");
                      }}
                      className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 font-semibold ${
                        viewMode === "timeline"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                          : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/50"
                      }`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode("grid");
                      }}
                      className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 font-semibold ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                          : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/50"
                      }`}
                    >
                      Grid
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expandable Content */}
          <div
            className={`overflow-hidden transition-all duration-700 ease-out ${
              isExpanded ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-6 bg-gradient-to-br from-stone-50/80 to-white/80 dark:from-stone-900/60 dark:to-stone-800/60">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500
                                flex items-center justify-center shadow-lg shadow-blue-500/25"
                  >
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      {viewMode === "timeline" ? "Timeline View" : "Grid View"}
                    </h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {logs.length} {logs.length === 1 ? "entry" : "entries"}{" "}
                      from this day
                    </p>
                  </div>
                </div>

                {/* Content stats */}
                <div className="flex items-center space-x-4 text-sm text-stone-500 dark:text-stone-400">
                  <span className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>
                      Latest:{" "}
                      {new Date(
                        logs[0]?.createdAt || logs[0]?.date
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                </div>
              </div>
              {/* Timeline View */}
              {viewMode === "timeline" ? (
                <div className="relative">
                  <ul className="space-y-4">
                    {logs.map((log, index) => (
                      <TimelineLogEntry
                        key={log._id}
                        log={log}
                        index={index}
                        totalLogs={logs.length}
                      />
                    ))}
                  </ul>
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className="group bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl p-6 rounded-2xl
                                border border-stone-200/50 dark:border-stone-700/50 shadow-lg shadow-stone-900/5
                                dark:shadow-stone-100/5 hover:shadow-xl hover:shadow-stone-900/10 dark:hover:shadow-stone-100/10
                                "
                    >
                      {editingLogId === log._id ? (
                        <div className="space-y-6">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-stone-50/80 dark:bg-stone-800/80 backdrop-blur-sm p-4 rounded-2xl
                                      border border-blue-200/50 dark:border-blue-800/50 text-stone-800 dark:text-stone-100
                                      focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500
                                      focus:outline-none transition-all duration-300 resize-none min-h-[120px]"
                            rows={4}
                            autoFocus
                            placeholder="Update your log entry..."
                          />
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700
                                        text-stone-700 dark:text-stone-300 rounded-xl transition-all duration-300
                                        hover:scale-105 font-medium flex items-center space-x-2"
                            >
                              <X size={16} />
                              <span>Cancel</span>
                            </button>
                            <button
                              onClick={() => handleUpdate(log._id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600
                                        text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg
                                        shadow-green-500/25 font-medium flex items-center space-x-2"
                            >
                              <Save size={16} />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Log Content */}
                          <div className="mb-6">
                            <p className="text-stone-800 dark:text-stone-100 leading-relaxed text-sm whitespace-pre-wrap">
                              {log.entry}
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-stone-200/50 dark:border-stone-700/50">
                            <div className="flex items-center space-x-4 text-xs text-stone-500 dark:text-stone-400">
                              <span className="flex items-center space-x-1">
                                <Clock size={12} />
                                <span className="font-medium">
                                  {new Date(
                                    log.createdAt || log.date
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={() => handleEditClick(log)}
                                className="p-2 text-stone-400 dark:text-stone-500 hover:text-blue-600 dark:hover:text-blue-400
                                          hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300
                                          hover:scale-110"
                                title="Edit entry"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(log)}
                                className="p-2 text-stone-400 dark:text-stone-500 hover:text-red-600 dark:hover:text-red-400
                                          hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-300
                                          hover:scale-110"
                                title="Delete entry"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
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
