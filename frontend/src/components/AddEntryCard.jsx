import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  PlusCircle,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";
import TagInput from "./TagInput";

const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayInTimezone = new Date(today.getTime() - offset * 60 * 1000);
  return todayInTimezone.toISOString().split("T")[0];
};

const AddEntryCard = ({
  isOpen,
  onToggle,
  newEntry,
  setNewEntry,
  onSubmit,
  isLoading,
  selectedDate,
  error,
  selectedTags,
  onTagsChange,
}) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleToggleClick = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <div className="relative">
      <div
        className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-stone-200/50 dark:border-stone-700/50
                    shadow-xl shadow-stone-900/5 dark:shadow-stone-100/5"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200/50 dark:border-stone-700/50">
          <button
            type="button"
            onClick={handleToggleClick}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-6">
              {/* Icon */}
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                              ${
                                isOpen
                                  ? "bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                                  : "bg-blue-100 dark:bg-blue-950/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60"
                              }`}
                >
                  <PlusCircle
                    className={`w-8 h-8 transition-all duration-300 ${
                      isOpen ? "text-white" : "text-blue-600 dark:text-blue-400"
                    }`}
                  />
                </div>

                {/* Pulse effect when closed */}
                {!isOpen && (
                  <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-blue-500/20 " />
                )}
              </div>

              {/* Title and Description */}
              <div className="space-y-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300 bg-clip-text text-transparent">
                  {isOpen ? "Write New Entry" : "Add New Entry"}
                </h3>
                <p className="text-stone-600 dark:text-stone-300 font-medium">
                  {selectedDate
                    ? `For ${new Date(selectedDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}`
                    : "Document your development journey"}
                </p>
              </div>
            </div>

            {/* Toggle Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                          ${
                            isOpen
                              ? "bg-blue-100 dark:bg-blue-950/40"
                              : "bg-stone-100 dark:bg-stone-800 group-hover:bg-stone-200 dark:group-hover:bg-stone-700"
                          }`}
            >
              {isOpen ? (
                <ChevronDown
                  size={20}
                  className="text-blue-600 dark:text-blue-400 transition-transform duration-300"
                />
              ) : (
                <ChevronRight
                  size={20}
                  className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 transition-all duration-300 group-hover:translate-x-0.5"
                />
              )}
            </div>
          </button>
        </div>

        {/* Expandable Form */}
        <div
          className={`overflow-hidden transition-all duration-700 ease-out ${
            isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 bg-gradient-to-br from-stone-50/80 to-white/80 dark:from-stone-900/60 dark:to-stone-800/60">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Tags Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500
                                flex items-center justify-center shadow-lg shadow-purple-500/25"
                  >
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <h4 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Tags & Categories
                  </h4>
                </div>
                <TagInput
                  selectedTags={selectedTags}
                  onTagsChange={onTagsChange}
                  compact={false}
                />
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500
                                flex items-center justify-center shadow-lg shadow-blue-500/25"
                  >
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <h4 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Your Entry
                  </h4>
                </div>

                <div className="relative">
                  <textarea
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    className="w-full bg-stone-50/80 dark:bg-stone-800/80 backdrop-blur-sm p-6 rounded-2xl
                              border border-stone-200/50 dark:border-stone-700/50 text-stone-800 dark:text-stone-100
                              placeholder-stone-500 dark:placeholder-stone-400
                              focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500
                              focus:outline-none transition-all duration-300 resize-none min-h-[140px]"
                    placeholder="What did you discover today? Share your coding insights, challenges overcome, or features built..."
                    autoFocus
                  />

                  {/* Character Count */}
                  <div
                    className="absolute bottom-3 right-3 px-2 py-1 bg-stone-100/80 dark:bg-stone-700/80
                                backdrop-blur-sm rounded-lg border border-stone-200/50 dark:border-stone-600/50"
                  >
                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                      {newEntry.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="p-4 bg-red-50/80 dark:bg-red-950/30 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50
                              rounded-2xl shadow-lg shadow-red-500/10"
                >
                  <p className="text-red-700 dark:text-red-300 font-medium flex items-center">
                    <AlertTriangle size={18} className="mr-3 text-red-500" />
                    {error}
                  </p>
                </div>
              )}

              {/* Form Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-4 border-t border-stone-200/50 dark:border-stone-700/50">
                {/* Date Info */}
                <div
                  className="flex items-center space-x-3 px-4 py-2 bg-stone-100/80 dark:bg-stone-800/80
                              backdrop-blur-sm rounded-2xl border border-stone-200/50 dark:border-stone-700/50"
                >
                  <Calendar
                    size={16}
                    className="text-stone-500 dark:text-stone-400"
                  />
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    {selectedDate || getTodayDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="px-6 py-3 bg-stone-100/80 dark:bg-stone-800/80 backdrop-blur-sm
                              hover:bg-stone-200/80 dark:hover:bg-stone-700/80 border border-stone-200/50 dark:border-stone-700/50
                              text-stone-700 dark:text-stone-300 rounded-2xl transition-all duration-300
                              hover:scale-105 font-semibold flex items-center space-x-2"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!newEntry.trim() || isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                              disabled:from-stone-400 disabled:to-stone-500 text-white rounded-2xl transition-all duration-300
                              hover:scale-105 shadow-lg shadow-blue-500/25 disabled:shadow-none disabled:cursor-not-allowed
                              font-semibold flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Entry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEntryCard;
