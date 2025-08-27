import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteLog, updateLog } from "../app/features/logsSlice";
import ConfirmationModal from "./ConfirmationModal";
import TagInput from "./TagInput";
import { Clock, Type, Hash, Edit, Trash2, Save, X } from "lucide-react";

const TimelineLogEntry = ({ log, index, totalLogs }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(log.entry);
  const [editTags, setEditTags] = useState(log.tags || []);
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
    dispatch(
      updateLog({
        logId: log._id,
        updateData: {
          entry: editText,
          tags: editTags,
        },
      })
    );
    setIsEditing(false);
  };

  const createdTime = new Date(log.createdAt || log.date).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const getWordCount = (text) => {
    return text
      ? text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length
      : 0;
  };

  const getCharacterCount = (text) => {
    return text ? text.length : 0;
  };

  const wordCount = getWordCount(log.entry);
  const charCount = getCharacterCount(log.entry);

  const TagsDisplay = ({ tags }) => {
    if (!tags || tags.length === 0) return null;

    const getTagColor = (tagName) => {
      const predefinedTags = {
        Work: "bg-blue-100 text-blue-800 border-blue-200",
        Personal: "bg-purple-100 text-purple-800 border-purple-200",
        Learning: "bg-green-100 text-green-800 border-green-200",
        "Bug Fix": "bg-red-100 text-red-800 border-red-200",
        Feature: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Urgent: "bg-orange-100 text-orange-800 border-orange-200",
      };
      return (
        predefinedTags[tagName] ||
        "bg-stone-100 text-stone-800 border-stone-200"
      );
    };

    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs border font-medium ${getTagColor(
              tag
            )}`}
          >
            <Hash className="w-3 h-3" />
            <span>{tag}</span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this log entry? This action cannot be undone."
      />

      <li className="group relative">
        <div className="flex">
          <div className="flex flex-col items-center mr-4 sm:mr-6">
            <div className="relative">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs
                            border-2 transition-all duration-300 group-hover:scale-110 ${
                              index === 0
                                ? "bg-gradient-to-br from-blue-500 to-purple-500 border-blue-400 shadow-lg shadow-blue-500/25"
                                : "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                            }`}
              >
                <span
                  className={`transition-colors duration-300 text-xs sm:text-sm ${
                    index === 0
                      ? "text-white"
                      : "text-stone-600 dark:text-stone-200"
                  }`}
                >
                  {index + 1}
                </span>
              </div>

              {index === 0 && (
                <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/20" />
              )}

              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>

            {index < totalLogs - 1 && (
              <div
                className="w-0.5 h-full bg-gradient-to-b from-blue-300 via-stone-300 to-transparent
                            dark:from-blue-700 dark:via-stone-700 dark:to-transparent mt-3 sm:mt-4 min-h-[50px] sm:min-h-[60px]
                            rounded-full opacity-60"
              />
            )}
          </div>

          <div className="flex-grow pb-3 sm:pb-4">
            <div
              className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl
                        border border-stone-200/50 dark:border-stone-700/50 shadow-lg shadow-stone-900/5
                        dark:shadow-stone-100/5"
            >
              <div className="relative">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500
                                      flex items-center justify-center shadow-lg shadow-purple-500/25"
                        >
                          <Hash size={14} className="text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                          Tags
                        </h4>
                      </div>
                      <TagInput
                        selectedTags={editTags}
                        onTagsChange={setEditTags}
                        compact={false}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500
                                      flex items-center justify-center shadow-lg shadow-blue-500/25"
                        >
                          <Type size={14} className="text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                          Content
                        </h4>
                      </div>

                      <div className="relative group">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-stone-50/80 dark:bg-stone-800/80 backdrop-blur-sm p-6 rounded-2xl
                                    border border-stone-200/50 dark:border-stone-700/50 text-stone-800 dark:text-stone-100
                                    placeholder-stone-500 dark:placeholder-stone-400
                                    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500
                                    focus:outline-none transition-all duration-300 resize-none min-h-[140px]
                                    group-hover:bg-white/60 dark:group-hover:bg-stone-900/60"
                          autoFocus
                          placeholder="Update your log entry..."
                        />

                        <div
                          className="absolute bottom-4 right-4 px-3 py-1 bg-stone-100/80 dark:bg-stone-700/80
                                      backdrop-blur-sm rounded-lg border border-stone-200/50 dark:border-stone-600/50"
                        >
                          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                            {editText.length} characters
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-stone-200/50 dark:border-stone-700/50">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-stone-100/80 dark:bg-stone-800/80 backdrop-blur-sm
                                  hover:bg-stone-200/80 dark:hover:bg-stone-700/80 border border-stone-200/50 dark:border-stone-700/50
                                  text-stone-700 dark:text-stone-300 rounded-2xl transition-all duration-300
                                  hover:scale-105 font-semibold flex items-center space-x-2"
                      >
                        <X size={18} />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600
                                  text-white rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg
                                  shadow-green-500/25 font-semibold flex items-center space-x-2"
                      >
                        <Save size={18} />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <TagsDisplay tags={log.tags} />
                    </div>

                    <div className="mb-4">
                      <p
                        className="text-stone-800 dark:text-stone-100 leading-snug whitespace-pre-wrap text-sm
                                  font-medium"
                      >
                        {log.entry}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
                      <div className="flex items-center space-x-4 text-xs text-stone-500 dark:text-stone-400">
                        <div
                          className="flex items-center space-x-2 px-3 py-1 bg-stone-100/80 dark:bg-stone-800/80
                                      backdrop-blur-sm rounded-lg border border-stone-200/50 dark:border-stone-700/50"
                        >
                          <Clock size={12} />
                          <span className="font-medium">{createdTime}</span>
                        </div>

                        <div
                          className="flex items-center space-x-2 px-3 py-1 bg-stone-100/80 dark:bg-stone-800/80
                                      backdrop-blur-sm rounded-lg border border-stone-200/50 dark:border-stone-700/50"
                        >
                          <Type size={12} />
                          <span className="font-medium">{wordCount} words</span>
                        </div>

                        <div
                          className="flex items-center space-x-2 px-3 py-1 bg-stone-100/80 dark:bg-stone-800/80
                                      backdrop-blur-sm rounded-lg border border-stone-200/50 dark:border-stone-700/50"
                        >
                          <Hash size={12} />
                          <span className="font-medium">{charCount} chars</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 text-stone-400 dark:text-stone-500 hover:text-blue-600 dark:hover:text-blue-400
                                    hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300
                                    hover:scale-110 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
                          title="Edit entry"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="p-2 text-stone-400 dark:text-stone-500 hover:text-red-600 dark:hover:text-red-400
                                    hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-300
                                    hover:scale-110 shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
                          title="Delete entry"
                        >
                          <Trash2 size={14} />
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

export default TimelineLogEntry;
