import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon, X } from "lucide-react";

function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

function LogFilterBar({ range, setRange }) {
  const [fromPickerOpen, setFromPickerOpen] = useState(false);
  const [toPickerOpen, setToPickerOpen] = useState(false);
  const fromWrapperRef = useRef(null);
  const toWrapperRef = useRef(null);

  useOutsideAlerter(fromWrapperRef, () => setFromPickerOpen(false));
  useOutsideAlerter(toWrapperRef, () => setToPickerOpen(false));

  const handleClear = () => {
    setRange({ from: undefined, to: undefined });
  };

  const css = `
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { 
      background-color: var(--color-stone-100, #f5f5f4);
    }
    .rdp-day_selected, .rdp-day_selected:hover { 
      background-color: #1e293b !important; /* slate-800 */
      color: #fff; 
    }
    .dark .rdp { color: #e7e5e4; }
    .dark .rdp-day { color: #e7e5e4; }
    .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: rgba(255,255,255,0.06);
    }
    .rdp-caption_label { font-weight: 600; }
  `;

  return (
    <div className="relative z-30">
      <style>{css}</style>
      <div className="flex flex-col space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-500
                          flex items-center justify-center shadow-lg shadow-blue-500/25"
            >
              <CalendarIcon size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                Date Range Filter
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Filter your development logs by date
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative" ref={fromWrapperRef}>
              <button
                onClick={() => setFromPickerOpen((p) => !p)}
                className="group flex items-center gap-2 sm:gap-3 bg-white/60 dark:bg-stone-800/60 backdrop-blur-xl
                          border border-stone-200/50 dark:border-stone-700/50 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3
                          text-stone-700 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800
                          hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-300
                          hover:shadow-lg hover:scale-105 min-w-[120px] sm:min-w-[140px] justify-start w-full sm:w-auto"
              >
                <div className="p-1 sm:p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors">
                  <CalendarIcon
                    size={14}
                    className="text-blue-600 dark:text-blue-300"
                  />
                </div>
                <span className="font-medium text-sm">
                  {range.from
                    ? format(range.from, "MMM dd, yyyy")
                    : "From date"}
                </span>
              </button>
              {fromPickerOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/20 backdrop-blur-sm"
                  onClick={() => setFromPickerOpen(false)}
                >
                  <div
                    className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200/50 dark:border-stone-700/50
                                rounded-2xl p-4 shadow-2xl shadow-stone-900/20 dark:shadow-stone-100/20 max-w-sm mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DayPicker
                      mode="single"
                      selected={range.from}
                      onSelect={(date) => {
                        setRange((prev) => ({ ...prev, from: date }));
                        setFromPickerOpen(false);
                      }}
                      initialFocus
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center px-2 py-1 sm:px-3 sm:py-2 bg-stone-100/50 dark:bg-stone-700/50 rounded-lg sm:rounded-xl">
              <span className="text-stone-400 dark:text-stone-500 font-medium text-sm">
                to
              </span>
            </div>

            <div className="relative" ref={toWrapperRef}>
              <button
                onClick={() => setToPickerOpen((p) => !p)}
                className="group flex items-center gap-2 sm:gap-3 bg-white/60 dark:bg-stone-800/60 backdrop-blur-xl
                          border border-stone-200/50 dark:border-stone-700/50 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3
                          text-stone-700 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800
                          hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-300
                          hover:shadow-lg hover:scale-105 min-w-[120px] sm:min-w-[140px] justify-start w-full sm:w-auto"
              >
                <div className="p-1 sm:p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/60 transition-colors">
                  <CalendarIcon
                    size={14}
                    className="text-purple-600 dark:text-purple-300"
                  />
                </div>
                <span className="font-medium text-sm">
                  {range.to ? format(range.to, "MMM dd, yyyy") : "To date"}
                </span>
              </button>
              {toPickerOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/20 backdrop-blur-sm"
                  onClick={() => setToPickerOpen(false)}
                >
                  <div
                    className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200/50 dark:border-stone-700/50
                                rounded-2xl p-4 shadow-2xl shadow-stone-900/20 dark:shadow-stone-100/20 max-w-sm mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DayPicker
                      mode="single"
                      selected={range.to}
                      onSelect={(date) => {
                        setRange((prev) => ({ ...prev, to: date }));
                        setToPickerOpen(false);
                      }}
                      initialFocus
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {(range.from || range.to) && (
            <button
              onClick={handleClear}
              className="group flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-50 dark:bg-red-950/30
                        hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200/50 dark:border-red-800/50
                        rounded-xl sm:rounded-2xl text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200
                        transition-all duration-300 hover:scale-105 font-medium text-sm w-full sm:w-auto justify-center"
            >
              <X
                size={14}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogFilterBar;
