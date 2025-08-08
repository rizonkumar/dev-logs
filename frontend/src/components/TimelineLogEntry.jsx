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
          <div className="flex flex-col items-center mr-6">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 
                            flex items-center justify-center font-bold text-sm border border-stone-200 dark:border-stone-700
                            group-hover:scale-110 transition-transform duration-300"
              >
                <span className="text-gray-600 dark:text-stone-200">
                  {index + 1}
                </span>
              </div>
              {index === 0 && (
                <div className="absolute inset-0 w-10 h-10 rounded-xl bg-blue-500/20 animate-ping" />
              )}
            </div>
            {index < totalLogs - 1 && (
              <div className="w-px h-full bg-stone-200 dark:bg-stone-700 mt-4 min-h-[60px]" />
            )}
          </div>

          {/* Log Content Card */}
          <div className="flex-grow">
            <div
              className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm
                        transition-all duration-500 group-hover:border-stone-300 dark:group-hover:border-stone-600"
            >
              <div className="relative">
                {isEditing ? (
                  <div className="space-y-4">
                    <TagInput
                      selectedTags={editTags}
                      onTagsChange={setEditTags}
                      compact={false}
                    />

                    <div className="relative">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-900 p-4 rounded-xl border border-stone-300 dark:border-stone-700
                                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none 
                                  transition-all duration-300 text-gray-800 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-400 resize-none
                                  min-h-[120px]"
                        autoFocus
                        placeholder="Update your log entry..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-stone-400">
                        {editText.length} characters
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-700 dark:text-stone-300 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700
                                  rounded-lg transition-all duration-300 text-sm font-medium
                                  flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-lg 
                                  transition-all duration-300 text-sm flex items-center space-x-2
                                  font-semibold"
                      >
                        <Save size={16} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <TagsDisplay tags={log.tags} />
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-stone-100 leading-relaxed whitespace-pre-wrap text-sm">
                        {log.entry}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-700">
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-stone-400">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1.5" />
                          {createdTime}
                        </span>
                        <span className="flex items-center">
                          <Type size={12} className="mr-1.5" />
                          {wordCount} words
                        </span>
                        <span className="flex items-center">
                          <Hash size={12} className="mr-1.5" />
                          {charCount} chars
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 text-gray-500 dark:text-stone-300 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950/30 
                                    rounded-lg transition-all duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="p-2 text-gray-500 dark:text-stone-300 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-950/30 
                                    rounded-lg transition-all duration-300"
                        >
                          <Trash2 size={16} />
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
