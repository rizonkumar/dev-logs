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
      background-color: #f5f5f4; /* stone-100 */ 
    }
    .rdp-day_selected, .rdp-day_selected:hover { 
      background-color: #1e293b !important; /* slate-800 */
      color: #fff; 
    }
    .rdp-caption_label {
      font-weight: 600;
    }
  `;

  return (
    <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm mb-8">
      <style>{css}</style>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          Filter by date range:
        </span>

        <div className="relative" ref={fromWrapperRef}>
          <button
            onClick={() => setFromPickerOpen((p) => !p)}
            className="flex items-center gap-2 bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-gray-800 hover:bg-stone-50"
          >
            <CalendarIcon size={16} className="text-gray-500" />
            {range.from ? format(range.from, "LLL dd, y") : <span>From</span>}
          </button>
          {fromPickerOpen && (
            <div className="absolute top-full mt-2 z-10 bg-white border border-stone-300 rounded-lg p-2 shadow-lg">
              <DayPicker
                mode="single"
                selected={range.from}
                onSelect={(date) => {
                  setRange((prev) => ({ ...prev, from: date }));
                  setFromPickerOpen(false);
                }}
                initialFocus
              />
            </div>
          )}
        </div>

        <span className="text-gray-400">to</span>

        <div className="relative" ref={toWrapperRef}>
          <button
            onClick={() => setToPickerOpen((p) => !p)}
            className="flex items-center gap-2 bg-white border border-stone-300 rounded-md px-3 py-1.5 text-sm text-gray-800 hover:bg-stone-50"
          >
            <CalendarIcon size={16} className="text-gray-500" />
            {range.to ? format(range.to, "LLL dd, y") : <span>To</span>}
          </button>
          {toPickerOpen && (
            <div className="absolute top-full mt-2 z-10 bg-white border border-stone-300 rounded-lg p-2 shadow-lg">
              <DayPicker
                mode="single"
                selected={range.to}
                onSelect={(date) => {
                  setRange((prev) => ({ ...prev, to: date }));
                  setToPickerOpen(false);
                }}
                initialFocus
              />
            </div>
          )}
        </div>

        {(range.from || range.to) && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default LogFilterBar;
