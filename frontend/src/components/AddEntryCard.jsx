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
    <div className="mb-8 relative overflow-hidden">
      <div
        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg 
                   rounded-2xl border border-gray-700/40 shadow-xl 
                   hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500"
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-teal-600/10 via-transparent to-green-600/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-6 border-b border-gray-700/30">
          <button
            type="button"
            onClick={handleToggleClick}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-green-500/20 flex items-center justify-center border border-teal-500/30">
                <PlusCircle className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                  Add New Entry
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
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

            {isOpen ? (
              <ChevronDown
                size={24}
                className="text-teal-400 transition-transform duration-300 rotate-0"
              />
            ) : (
              <ChevronRight
                size={24}
                className="text-gray-500 group-hover:text-teal-400 transition-all duration-300"
              />
            )}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="mb-4">
                <TagInput
                  selectedTags={selectedTags}
                  onTagsChange={onTagsChange}
                  compact={false}
                />
              </div>

              <div className="relative">
                <textarea
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  className="w-full bg-gray-900/70 p-4 rounded-xl border border-gray-600/50 
                            focus:ring-2 focus:ring-teal-400 focus:border-transparent focus:outline-none 
                            transition-all duration-300 text-gray-300 placeholder-gray-500 resize-none
                            min-h-[120px] shadow-inner"
                  placeholder="What did you discover today? Share your coding insights, challenges overcome, or features built..."
                  autoFocus
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {newEntry.length} characters
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertTriangle size={16} className="mr-2" />
                    {error}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar size={14} />
                  <span>{selectedDate || getTodayDateString()}</span>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 
                              hover:border-gray-500 rounded-lg transition-all duration-300 text-sm"
                  >
                    <X size={16} className="inline mr-1" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!newEntry.trim() || isLoading}
                    className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 
                              text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 
                              flex items-center space-x-2 text-sm shadow-lg shadow-teal-500/25
                              disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
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
