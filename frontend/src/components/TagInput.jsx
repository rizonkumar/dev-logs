import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Tag, Hash } from "lucide-react";

// Add dropdown animation styles
const dropdownAnimation = `
  @keyframes dropdownIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = dropdownAnimation;
  document.head.appendChild(style);
}

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
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 320,
  });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Calculate dropdown position with viewport boundary checking
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0, width: 320 };

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = compact ? 320 : 320;
    const dropdownHeight = 400; // Approximate height

    let left = rect.left;
    let top = rect.bottom + 8;

    // Check if dropdown would go off the right edge of viewport
    if (left + dropdownWidth > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - 8;
    }

    // Check if dropdown would go off the bottom edge of viewport
    if (top + dropdownHeight > window.innerHeight) {
      top = rect.top - dropdownHeight - 8;
    }

    // Ensure dropdown doesn't go off the left edge
    if (left < 8) {
      left = 8;
    }

    return {
      top: Math.max(8, top),
      left: Math.max(8, left),
      width: dropdownWidth,
    };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleToggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      // Remove tag
      onTagsChange(selectedTags.filter((tag) => tag !== tagId));
    } else {
      // Add tag
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      // Calculate position when opening
      setDropdownPosition(getDropdownPosition());
    }
    setIsDropdownOpen(!isDropdownOpen);
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
      <div className="relative" ref={dropdownRef}>
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <TagChip key={tag} tag={tag} onRemove={removeTag} size="small" />
          ))}
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm
                       text-stone-700 dark:text-stone-300 rounded-xl border border-stone-200/60 dark:border-stone-700/60
                       hover:border-stone-300/80 dark:hover:border-stone-600/80 hover:bg-white/95 dark:hover:bg-stone-900/95
                       transition-all duration-300 shadow-lg shadow-stone-900/5 dark:shadow-stone-100/5
                       hover:shadow-xl hover:shadow-stone-900/10 dark:hover:shadow-stone-100/10 text-sm font-medium
                       transform hover:scale-105 ${
                         isDropdownOpen
                           ? "ring-2 ring-purple-500/50 border-purple-400/70"
                           : ""
                       }`}
          >
            <div className="p-1 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
              <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <span>Tags</span>
            <div
              className={`transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            >
              <svg
                className="w-3 h-3 text-stone-400 dark:text-stone-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
        </div>

        {isDropdownOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={dropdownRef}
              className="fixed inset-0 z-[99999] pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl
                          border border-stone-200/60 dark:border-stone-700/60 rounded-xl shadow-2xl
                          shadow-stone-900/10 dark:shadow-stone-100/10 p-4 transform translate-x-0
                          pointer-events-auto"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                  transformOrigin: "top left",
                  animation: "dropdownIn 0.15s ease-out",
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {PRE_DEFINED_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleToggleTag(tag.id)}
                        className={`px-3 py-1.5 rounded-lg border transition-all duration-300 text-sm font-medium transform hover:scale-105 ${
                          selectedTags.includes(tag.id)
                            ? `${tag.color} shadow-lg scale-105 border-opacity-70`
                            : "text-stone-600 dark:text-stone-300 border-stone-200/60 dark:border-stone-700/60 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-300/70 dark:hover:border-stone-600/70 hover:bg-stone-50/80 dark:hover:bg-stone-800/80"
                        }`}
                      >
                        {tag.id}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-stone-200/50 dark:border-stone-700/50 pt-3">
                    {!showCustomInput ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCustomInput(true);
                        }}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300
                               flex items-center space-x-2 transition-all duration-200 hover:scale-105 font-medium"
                      >
                        <div className="p-0.5 rounded bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span>Create custom tag</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={customTagInput}
                          onChange={(e) => {
                            e.stopPropagation();
                            setCustomTagInput(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            handleKeyPress(e);
                          }}
                          placeholder="Custom tag name"
                          className="flex-1 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm px-3 py-2 rounded-lg
                                 border border-stone-200/50 dark:border-stone-700/50 focus:ring-2 focus:ring-purple-500/50
                                 focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none
                                 transition-all duration-300 text-stone-900 dark:text-stone-100
                                 placeholder-stone-500 dark:placeholder-stone-400 shadow-sm hover:shadow-md text-sm"
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddCustomTag();
                          }}
                          className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                                 text-white rounded-lg font-medium transition-all duration-300 shadow-lg
                                 shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-105"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm rounded-xl p-4 border border-stone-200/60 dark:border-stone-700/60
                      shadow-lg shadow-stone-900/5 dark:shadow-stone-100/5 hover:shadow-xl hover:shadow-stone-900/10
                      dark:hover:shadow-stone-100/10 transition-all duration-300 space-y-3"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
        onInput={(e) => e.stopPropagation()}
      >
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
          <div className="flex items-center space-x-2 text-sm text-stone-600 dark:text-stone-300 font-medium">
            <div className="p-1 rounded bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
              <Tag className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            </div>
            <span>Filter by Tags</span>
          </div>

          {/* Pre-defined Tags */}
          <div className="flex flex-wrap gap-2">
            {PRE_DEFINED_TAGS.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleToggleTag(tag.id)}
                className={`px-3 py-2 rounded-lg border transition-all duration-300 text-sm font-medium transform hover:scale-105 ${
                  selectedTags.includes(tag.id)
                    ? `${tag.color} shadow-lg scale-105 border-opacity-70`
                    : "text-stone-600 dark:text-stone-300 border-stone-200/60 dark:border-stone-700/60 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-300/70 dark:hover:border-stone-600/70 hover:bg-stone-50/80 dark:hover:bg-stone-800/80"
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
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300
                         flex items-center space-x-2 transition-all duration-200 hover:scale-105 font-medium"
              >
                <div className="p-0.5 rounded bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Create custom tag</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => {
                    e.stopPropagation();
                    setCustomTagInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    handleKeyPress(e);
                  }}
                  placeholder="Enter custom tag name (e.g., DSA, React, etc.)"
                  className="flex-1 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm px-3 py-2 rounded-lg
                           border border-stone-200/50 dark:border-stone-700/50 focus:ring-2 focus:ring-purple-500/50
                           focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none
                           transition-all duration-300 text-stone-900 dark:text-stone-100
                           placeholder-stone-500 dark:placeholder-stone-400 shadow-sm hover:shadow-md"
                  autoFocus
                />
                <button
                  onClick={handleAddCustomTag}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                           text-white rounded-lg font-medium transition-all duration-300 shadow-lg
                           shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-105"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomTagInput("");
                  }}
                  className="px-4 py-2 bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200/80 dark:hover:bg-stone-700/80
                           text-stone-700 dark:text-stone-300 rounded-lg font-medium transition-all duration-300
                           border border-stone-200/50 dark:border-stone-700/50 backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagInput;
