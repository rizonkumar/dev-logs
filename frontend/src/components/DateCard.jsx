import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteLog, updateLog } from "../app/features/logsSlice";
import TimelineLogEntry from "./TimelineLogEntry";
import {
  ChevronDown,
  ChevronRight,
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
        {/* Compact Header */}
        <div
          className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-2xl border border-stone-200/50 dark:border-stone-700/50
                      shadow-lg shadow-stone-900/5 dark:shadow-stone-100/5 cursor-pointer"
          onClick={onToggle}
        >
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                {/* Expand/Collapse Icon */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center transition-all duration-300
                                ${
                                  isExpanded
                                    ? "bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                                    : "bg-stone-100 dark:bg-stone-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/30"
                                }`}
                  >
                    {isExpanded ? (
                      <ChevronDown
                        size={12}
                        className={`transition-all duration-300 ${
                          isExpanded
                            ? "text-white rotate-0"
                            : "text-stone-400 group-hover:text-blue-600"
                        }`}
                      />
                    ) : (
                      <ChevronRight
                        size={12}
                        className="text-stone-400 group-hover:text-blue-600 transition-all duration-300 group-hover:translate-x-0.5"
                      />
                    )}
                  </div>
                  {/* Pulse effect for today */}
                  {relativeDate === "Today" && (
                    <div className="absolute inset-0 w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-blue-500/20" />
                  )}
                </div>

                {/* Date Info */}
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {relativeDate}
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 text-xs">
                    {logs.length} {logs.length === 1 ? "entry" : "entries"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                {/* Date */}
                <div className="text-right hidden sm:block">
                  <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* View Mode Toggle */}
                {isExpanded && (
                  <div className="flex items-center space-x-0.5 sm:space-x-1 bg-stone-100/80 dark:bg-stone-800/80 rounded-md sm:rounded-lg p-0.5 border border-stone-200/50 dark:border-stone-700/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode("timeline");
                      }}
                      className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs transition-all duration-300 font-medium ${
                        viewMode === "timeline"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm"
                          : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
                      }`}
                    >
                      <span className="hidden sm:inline">Timeline</span>
                      <span className="sm:hidden">TL</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode("grid");
                      }}
                      className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs transition-all duration-300 font-medium ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm"
                          : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
                      }`}
                    >
                      <span className="hidden sm:inline">Grid</span>
                      <span className="sm:hidden">GR</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expandable Content */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              isExpanded ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-3 sm:p-4 bg-gradient-to-br from-stone-50/80 to-white/80 dark:from-stone-900/60 dark:to-stone-800/60">
              {/* Compact Section Header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <Hash
                    size={14}
                    className="text-blue-500 dark:text-blue-400"
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
                      {viewMode === "timeline" ? "Timeline" : "Grid"} View
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {logs.length} {logs.length === 1 ? "entry" : "entries"}
                    </p>
                  </div>
                </div>

                {/* Latest time */}
                <div className="flex items-center space-x-1 text-xs text-stone-500 dark:text-stone-400">
                  <Clock size={11} />
                  <span className="hidden sm:inline">
                    {new Date(
                      logs[0]?.createdAt || logs[0]?.date
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="sm:hidden">
                    {new Date(
                      logs[0]?.createdAt || logs[0]?.date
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              {/* Timeline View */}
              {viewMode === "timeline" ? (
                <div className="relative">
                  <ul className="space-y-3">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className="group bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl p-4 rounded-xl
                                border border-stone-200/50 dark:border-stone-700/50 shadow-lg shadow-stone-900/5
                                dark:shadow-stone-100/5
                                "
                    >
                      {editingLogId === log._id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-stone-50/80 dark:bg-stone-800/80 backdrop-blur-sm p-3 rounded-xl
                                      border border-blue-200/50 dark:border-blue-800/50 text-stone-800 dark:text-stone-100
                                      focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500
                                      focus:outline-none transition-all duration-300 resize-none min-h-[80px] text-sm"
                            rows={3}
                            autoFocus
                            placeholder="Update your log entry..."
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700
                                        text-stone-700 dark:text-stone-300 rounded-lg transition-all duration-300
                                        text-sm font-medium flex items-center space-x-1"
                            >
                              <X size={14} />
                              <span>Cancel</span>
                            </button>
                            <button
                              onClick={() => handleUpdate(log._id)}
                              className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600
                                        text-white rounded-lg transition-all duration-300 shadow-lg
                                        shadow-green-500/25 text-sm font-medium flex items-center space-x-1"
                            >
                              <Save size={14} />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Log Content */}
                          <div className="mb-4">
                            <p className="text-stone-800 dark:text-stone-100 leading-snug text-sm whitespace-pre-wrap line-clamp-4">
                              {log.entry}
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
                            <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400">
                              <Clock size={12} />
                              <span className="font-medium">
                                {new Date(
                                  log.createdAt || log.date
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={() => handleEditClick(log)}
                                className="p-1.5 text-stone-400 dark:text-stone-500 hover:text-blue-600 dark:hover:text-blue-400
                                          hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded transition-all duration-300"
                                title="Edit entry"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(log)}
                                className="p-1.5 text-stone-400 dark:text-stone-500 hover:text-red-600 dark:hover:text-red-400
                                          hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-all duration-300"
                                title="Delete entry"
                              >
                                <Trash2 size={12} />
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
