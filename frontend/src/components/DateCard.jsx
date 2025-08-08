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
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm transition-all duration-500">
          <div className="relative p-6 border-b border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center space-x-4 cursor-pointer flex-grow"
                onClick={onToggle}
              >
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown
                      size={24}
                      className="text-blue-600 transition-transform duration-300"
                    />
                  ) : (
                    <ChevronRight
                      size={24}
                      className="text-gray-400 group-hover:text-gray-600 transition-all duration-300"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center border border-blue-200 dark:border-blue-900/40">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    {relativeDate === "Today" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-stone-900" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {relativeDate}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-stone-300">
                      {fullDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <BookOpen
                    size={14}
                    className="text-gray-500 dark:text-stone-300"
                  />
                  <span className="text-sm text-gray-600 dark:text-stone-300 font-medium">
                    {logs.length} {logs.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="flex items-center space-x-1 bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode("timeline");
                      }}
                      className={`px-3 py-1 rounded-md text-xs transition-all duration-300 font-medium ${
                        viewMode === "timeline"
                          ? "bg-gray-800 text-white"
                          : "text-gray-500 dark:text-stone-300 hover:text-gray-800 dark:hover:text-white"
                      }`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode("grid");
                      }}
                      className={`px-3 py-1 rounded-md text-xs transition-all duration-300 font-medium ${
                        viewMode === "grid"
                          ? "bg-gray-800 text-white"
                          : "text-gray-500 dark:text-stone-300 hover:text-gray-800 dark:hover:text-white"
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
            <div className="p-6 bg-stone-50/50 dark:bg-stone-900/40">
              <h4 className="font-semibold text-gray-500 dark:text-stone-400 mb-6 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-blue-600" />
                {viewMode === "timeline" ? "Timeline View" : "Grid View"}
              </h4>
              {viewMode === "timeline" ? (
                <ul className="space-y-8">
                  {logs.map((log, index) => (
                    <TimelineLogEntry
                      key={log._id}
                      log={log}
                      index={index}
                      totalLogs={logs.length}
                    />
                  ))}
                </ul>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-700"
                    >
                      {editingLogId === log._id ? (
                        <div className="space-y-4">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-white dark:bg-stone-900 p-3 rounded-lg border border-blue-500 dark:border-blue-500/60 text-gray-800 dark:text-stone-100
                                      focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={4}
                            autoFocus
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-gray-500 dark:text-stone-300 hover:text-gray-800 dark:hover:text-white"
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdate(log._id)}
                              className="p-2 text-green-600 hover:text-green-700"
                            >
                              <Save size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-800 dark:text-stone-100 text-sm mb-4">
                            {log.entry}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-stone-400 pt-3 border-t border-stone-200 dark:border-stone-700">
                            <span className="flex items-center">
                              <Clock size={12} className="inline mr-1" />
                              {new Date(
                                log.createdAt || log.date
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditClick(log)}
                                className="text-gray-400 dark:text-stone-400 hover:text-blue-600"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(log)}
                                className="text-gray-400 dark:text-stone-400 hover:text-red-600"
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
