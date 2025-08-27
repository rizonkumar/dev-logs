import React from "react";
import { ListTodo, Search, CalendarRange, RotateCcw, Plus } from "lucide-react";
import TagInput from "../TagInput";

const BoardHeader = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  clearFilters,
  onAddTask,
  searchInputRef,
  selectedTags = [],
  setSelectedTags = () => {},
}) => {
  return (
    <header className="mb-4 sm:mb-6">
      {/* Single Consolidated Card */}
      <div
        className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-stone-200/50 dark:border-stone-700/50
                      shadow-xl shadow-stone-900/5 dark:shadow-stone-100/5 p-4 sm:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* DevBoard Title and Description */}
          <div className="flex-1 space-y-2">
            <h1
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900
                           dark:from-stone-100 dark:via-stone-200 dark:to-stone-100 bg-clip-text text-transparent flex items-center gap-3"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg">
                <ListTodo size={20} className="text-white sm:w-5 sm:h-5" />
              </div>
              Dev Board
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-medium">
              Organize your tasks with drag & drop
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-xl p-1 border border-stone-200/50 dark:border-stone-700/50 shadow-sm">
            <button
              onClick={() => setViewMode("today")}
              aria-pressed={viewMode === "today"}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                viewMode === "today"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode("all")}
              aria-pressed={viewMode === "all"}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                viewMode === "all"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              All Tasks
            </button>
          </div>

          {/* Search Input - Compact */}
          <div className="flex-1 max-w-sm">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  size={16}
                  className="text-blue-500 dark:text-blue-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-300 transition-colors duration-200"
                />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks"
                ref={searchInputRef}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm
                           border border-stone-200/50 dark:border-stone-700/50 text-stone-900 dark:text-stone-100
                           placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2
                           focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500
                           transition-all duration-300 shadow-sm text-sm font-medium"
              />
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex-1 max-w-xs">
            <TagInput
              compact
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          </div>

          {/* Date Range Filter */}
          <div
            className="flex items-center gap-1.5 p-2 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm
                          rounded-lg border border-stone-200/50 dark:border-stone-700/50 shadow-sm"
          >
            <CalendarRange
              size={14}
              className="text-green-500 dark:text-green-400 flex-shrink-0"
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              aria-label="From date"
              className="px-1.5 py-1 bg-transparent border-0 text-xs text-stone-900 dark:text-stone-100
                         focus:outline-none focus:ring-1 focus:ring-green-500/50 rounded focus:bg-green-50/50
                         dark:focus:bg-green-950/30 transition-all duration-200 font-medium cursor-pointer"
            />
            <span className="text-stone-400 dark:text-stone-500 text-xs">
              –
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              aria-label="To date"
              className="px-1.5 py-1 bg-transparent border-0 text-xs text-stone-900 dark:text-stone-100
                         focus:outline-none focus:ring-1 focus:ring-green-500/50 rounded focus:bg-green-50/50
                         dark:focus:bg-green-950/30 transition-all duration-200 font-medium cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onAddTask}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                         text-white px-3 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg
                         shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer text-sm"
            >
              <Plus size={16} /> Add
            </button>

            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-100/80 dark:bg-stone-800/80
                         hover:bg-stone-200/80 dark:hover:bg-stone-700/80 text-stone-700 dark:text-stone-300
                         border border-stone-200/50 dark:border-stone-700/50 backdrop-blur-sm font-semibold
                         transition-all duration-300 cursor-pointer text-sm"
              title="Clear filters"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BoardHeader;
