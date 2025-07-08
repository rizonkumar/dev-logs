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
        Work: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        Personal: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        Learning: "bg-green-500/20 text-green-400 border-green-500/30",
        "Bug Fix": "bg-red-500/20 text-red-400 border-red-500/30",
        Feature: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        Urgent: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      };
      return (
        predefinedTags[tagName] ||
        "bg-gray-500/20 text-gray-400 border-gray-500/30"
      );
    };

    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs border transition-all duration-200 hover:scale-105 ${getTagColor(
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

      <li
        className="group relative"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex">
          <div className="flex flex-col items-center mr-6">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                            flex items-center justify-center font-bold text-sm border border-purple-500/30
                            group-hover:scale-110 transition-transform duration-300"
              >
                <span className="text-purple-300">{index + 1}</span>
              </div>
              {index === 0 && (
                <div className="absolute inset-0 w-10 h-10 rounded-xl bg-purple-400/20 animate-ping" />
              )}
            </div>
            {index < totalLogs - 1 && (
              <div className="w-px h-full bg-gradient-to-b from-purple-500/30 to-transparent mt-4 min-h-[60px]" />
            )}
          </div>

          <div className="flex-grow">
            <div
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg 
                        p-6 rounded-2xl border border-gray-700/40 shadow-xl
                        hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500
                        group-hover:border-gray-600/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                      >
                        <Save size={16} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <TagsDisplay tags={log.tags} />
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm group-hover:text-white transition-colors duration-300">
                        {log.entry}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {createdTime}
                        </span>
                        <span className="flex items-center">
                          <Type size={12} className="mr-1" />
                          {wordCount} words
                        </span>
                        <span className="flex items-center">
                          <Hash size={12} className="mr-1" />
                          {charCount} chars
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 
                                    rounded-lg transition-all duration-300 group/btn"
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

export default TimelineLogEntry;
