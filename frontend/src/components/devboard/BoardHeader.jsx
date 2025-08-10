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
    <header className="mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ListTodo size={28} /> Dev Board
          </h1>
          <p className="text-gray-500 dark:text-stone-300">
            Drag & drop to organize your tasks.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-stone-200 dark:bg-stone-800 rounded-lg p-1 border border-transparent dark:border-stone-700">
            <button
              onClick={() => setViewMode("today")}
              aria-pressed={viewMode === "today"}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
                viewMode === "today"
                  ? "bg-white text-gray-800 shadow-sm ring-1 ring-stone-300 dark:bg-stone-700 dark:text-white dark:ring-stone-500"
                  : "text-gray-600 dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-700/40 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode("all")}
              aria-pressed={viewMode === "all"}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
                viewMode === "all"
                  ? "bg-white text-gray-800 shadow-sm ring-1 ring-stone-300 dark:bg-stone-700 dark:text-white dark:ring-stone-500"
                  : "text-gray-600 dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-700/40 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              All Tasks
            </button>
          </div>
          <button
            onClick={onAddTask}
            className="flex items-center gap-2 bg-gray-800 hover:bg-black dark:bg-stone-200 dark:hover:bg-white text-white dark:text-stone-900 px-4 py-2 rounded-lg font-semibold transition-colors text-sm cursor-pointer"
          >
            <Plus size={18} /> Add Task
          </button>
          <button
            onClick={clearFilters}
            className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-sm font-semibold cursor-pointer"
            title="Clear filters"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="relative w-full sm:max-w-md md:max-w-lg">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            ref={searchInputRef}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm text-gray-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
          <div className="w-full sm:w-auto">
            <TagInput compact selectedTags={selectedTags} onTagsChange={setSelectedTags} />
          </div>
          <div className="flex items-center gap-1">
            <CalendarRange
              size={16}
              className="text-stone-400 dark:text-stone-500"
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              aria-label="From date"
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm text-gray-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-stone-400">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              aria-label="To date"
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm text-gray-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={clearFilters}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-sm font-semibold cursor-pointer"
            title="Clear filters"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>
    </header>
  );
};

export default BoardHeader;
