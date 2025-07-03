import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteLog, updateLog } from "../app/features/logsSlice";
import ConfirmationModal from "./ConfirmationModal";
import {
  Clock,
  Type,
  Hash,
  Edit,
  Trash2,
  Save,
  X,
  Briefcase,
  User,
  MoreHorizontal,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "Work",
    icon: Briefcase,
    color: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    hoverColor: "hover:text-blue-300 hover:border-blue-400/50",
  },
  {
    id: "Personal",
    icon: User,
    color: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    hoverColor: "hover:text-purple-300 hover:border-purple-400/50",
  },
  {
    id: "Others",
    icon: MoreHorizontal,
    color: "text-gray-400 bg-gray-400/10 border-gray-400/30",
    hoverColor: "hover:text-gray-300 hover:border-gray-400/50",
  },
];

const TimelineLogEntry = ({ log, index, totalLogs }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(log.entry);
  const [editCategory, setEditCategory] = useState(log.category || "Work");
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
          category: editCategory,
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

  const CategoryBadge = ({ category, isEditing = false, onSelect = null }) => {
    const categoryInfo =
      CATEGORIES.find((c) => c.id === category) || CATEGORIES[2]; // Default to Others
    const Icon = categoryInfo.icon;

    if (isEditing) {
      return (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onSelect && onSelect(cat.id)}
                className={`cursor-pointer flex items-center space-x-2 px-3 py-1 rounded-lg border transition-all duration-300
                          ${
                            isSelected
                              ? `${cat.color} shadow-lg scale-105`
                              : `text-gray-400 border-gray-600/50 ${cat.hoverColor}`
                          }`}
              >
                <CatIcon size={14} />
                <span>{cat.id}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <span
        className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${categoryInfo.color}`}
      >
        <Icon size={14} />
        <span>{category}</span>
      </span>
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
                    <CategoryBadge
                      category={editCategory}
                      isEditing={true}
                      onSelect={setEditCategory}
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
                      <CategoryBadge category={log.category || "Work"} />
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
