import React, { useState } from "react";
import { X, Plus, Tag, Hash } from "lucide-react";

const PRE_DEFINED_TAGS = [
  { id: "Work", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  {
    id: "Personal",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "Learning",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  { id: "Bug Fix", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  {
    id: "Feature",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    id: "Urgent",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
];

const TagInput = ({ selectedTags = [], onTagsChange, compact = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customTagInput, setCustomTagInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleToggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      // Remove tag
      onTagsChange(selectedTags.filter((tag) => tag !== tagId));
    } else {
      // Add tag
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmedTag = customTagInput.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onTagsChange([...selectedTags, trimmedTag]);
      setCustomTagInput("");
      setShowCustomInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTag();
    } else if (e.key === "Escape") {
      setCustomTagInput("");
      setShowCustomInput(false);
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const getTagColor = (tagId) => {
    const predefinedTag = PRE_DEFINED_TAGS.find((tag) => tag.id === tagId);
    return predefinedTag
      ? predefinedTag.color
      : "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const TagChip = ({ tag, onRemove, size = "normal" }) => (
    <span
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg border transition-all duration-200 ${getTagColor(
        tag
      )} ${size === "small" ? "text-xs" : "text-sm"}`}
    >
      <Hash className={size === "small" ? "w-3 h-3" : "w-4 h-4"} />
      <span>{tag}</span>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(tag);
        }}
        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
      >
        <X className={size === "small" ? "w-3 h-3" : "w-4 h-4"} />
      </button>
    </span>
  );

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <TagChip key={tag} tag={tag} onRemove={removeTag} size="small" />
        ))}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg border border-gray-600/50 text-gray-400 hover:text-gray-300 hover:border-gray-500/50 transition-all duration-200 text-xs"
        >
          <Plus className="w-3 h-3" />
          <span>Tag</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-6 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl p-3 w-64">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {PRE_DEFINED_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag(tag.id)}
                    className={`px-2 py-1 rounded text-xs border transition-all duration-200 ${
                      selectedTags.includes(tag.id)
                        ? tag.color
                        : "text-gray-400 border-gray-600/50 hover:text-gray-300"
                    }`}
                  >
                    {tag.id}
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-700/50 pt-2">
                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create custom tag</span>
                  </button>
                ) : (
                  <div className="flex space-x-1">
                    <input
                      type="text"
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Custom tag name"
                      className="flex-1 bg-gray-900/70 px-2 py-1 rounded text-xs border border-gray-600 focus:ring-1 focus:ring-teal-400 focus:outline-none text-gray-300"
                      autoFocus
                    />
                    <button
                      onClick={handleAddCustomTag}
                      className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs hover:bg-teal-500/30"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <TagChip key={tag} tag={tag} onRemove={removeTag} />
          ))}
        </div>
      )}

      {/* Tag Selection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Tag className="w-4 h-4" />
          <span>Tags</span>
        </div>

        {/* Pre-defined Tags */}
        <div className="flex flex-wrap gap-2">
          {PRE_DEFINED_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleToggleTag(tag.id)}
              className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                selectedTags.includes(tag.id)
                  ? tag.color
                  : "text-gray-400 border-gray-600/50 hover:text-gray-300 hover:border-gray-500/50"
              }`}
            >
              {tag.id}
            </button>
          ))}
        </div>

        {/* Custom Tag Input */}
        <div className="space-y-2">
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="text-sm text-teal-400 hover:text-teal-300 flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create custom tag</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter custom tag name (e.g., DSA, React, etc.)"
                className="flex-1 bg-gray-900/70 px-3 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all text-gray-300 placeholder-gray-500"
                autoFocus
              />
              <button
                onClick={handleAddCustomTag}
                className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomTagInput("");
                }}
                className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagInput;
