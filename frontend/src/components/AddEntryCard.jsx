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
    <div className="mb-8">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm transition-all duration-500">
        <div className="p-6 border-b border-stone-200">
          <button
            type="button"
            onClick={handleToggleClick}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                <PlusCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Add New Entry
                </h3>
                <p className="text-sm text-gray-500">
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
                className="text-blue-600 transition-transform duration-300"
              />
            ) : (
              <ChevronRight
                size={24}
                className="text-gray-400 group-hover:text-gray-600 transition-all duration-300"
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
                  className="w-full bg-stone-50 p-4 rounded-xl border border-stone-300
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none 
                            transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none
                            min-h-[120px]"
                  placeholder="What did you discover today? Share your coding insights, challenges overcome, or features built..."
                  autoFocus
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {newEntry.length} characters
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm flex items-center">
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
                    className="px-4 py-2 text-gray-700 bg-white hover:bg-stone-100 border border-stone-300
                              rounded-lg transition-all duration-300 text-sm font-medium
                              flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!newEntry.trim() || isLoading}
                    className="bg-gray-800 hover:bg-black
                              text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 
                              flex items-center space-x-2 text-sm shadow-sm
                              disabled:bg-gray-400 disabled:cursor-not-allowed"
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
