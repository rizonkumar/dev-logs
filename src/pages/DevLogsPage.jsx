import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addLog } from "../app/features/logsSlice";
import DevLogsHeader from "../components/DevLogsHeader";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
} from "lucide-react"; // Import ArrowLeft

// Helper function to group logs by date
const groupLogsByDate = (logs) => {
  return logs.reduce((acc, log) => {
    const date = log.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {});
};

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  // Adjust for timezone differences to ensure correct date
  const offset = today.getTimezoneOffset();
  const todayInTimezone = new Date(today.getTime() - offset * 60 * 1000);
  return todayInTimezone.toISOString().split("T")[0];
};

function DevLogsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logs = useSelector((state) => state.logs.value);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [expandedDate, setExpandedDate] = useState(null);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (newEntry.trim() === "") return;
    const newLogPayload = { date: getTodayDateString(), entry: newEntry };
    dispatch(addLog(newLogPayload));
    setNewEntry("");
    setIsFormOpen(false);
  };

  const handleToggleDate = (date) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  const groupedLogs = groupLogsByDate(logs);
  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* --- BACK TO HOME LINK --- */}
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center text-sm text-teal-400 hover:text-teal-300 transition-colors font-semibold"
        >
          <ArrowLeft size={14} className="mr-2" />
          Back to Homepage
        </Link>
      </div>

      <DevLogsHeader />

      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-white">DAILY DEVLOGS</h2>
        <p className="text-gray-400 mt-1">
          Documenting my daily development journey — bugs, features, and
          everything in between.
        </p>
      </div>

      {/* --- ADD NEW LOG FOR TODAY (Collapsible Form) --- */}
      <div className="mb-10 bg-gray-800/60 rounded-xl border border-gray-700/60 transition-all duration-300">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full flex justify-between items-center p-4"
        >
          <div className="flex items-center">
            <Plus size={16} className="text-teal-400 mr-3" />
            <span className="font-semibold text-white">
              Add New Entry for Today
            </span>
          </div>
          {isFormOpen ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </button>

        {isFormOpen && (
          <div className="p-4 border-t border-gray-700/60">
            <form onSubmit={handleAddEntry}>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="w-full bg-gray-900/70 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all text-gray-300 placeholder-gray-500"
                rows="4"
                placeholder={`What's on your mind today, ${getTodayDateString()}?`}
                autoFocus
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300 flex items-center text-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* --- LOG LIST (ACCORDION STYLE) --- */}
      <div className="space-y-2">
        {sortedDates.map((date) => {
          const logsForDate = groupedLogs[date];
          const isExpanded = expandedDate === date;

          return (
            <div
              key={date}
              className="bg-gray-800/50 rounded-lg border border-gray-700/60"
            >
              {/* --- CLICKABLE HEADER ROW --- */}
              <div className="flex items-center p-4">
                <div
                  className="flex-grow flex items-center cursor-pointer"
                  onClick={() => handleToggleDate(date)}
                >
                  {isExpanded ? (
                    <ChevronDown
                      size={20}
                      className="text-teal-400 mr-3 flex-shrink-0"
                    />
                  ) : (
                    <ChevronRight
                      size={20}
                      className="text-gray-500 mr-3 flex-shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {new Date(date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <p className="text-sm text-gray-400 hidden sm:block">
                    {logsForDate.length}{" "}
                    {logsForDate.length > 1 ? "entries" : "entry"}
                  </p>
                  <button
                    onClick={() => navigate(`/logs/${date}`)}
                    className="p-2 text-gray-400 hover:text-teal-400 hover:bg-gray-700/50 rounded-md transition-colors"
                    title="View full devlog page"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>

              {/* --- EXPANDED CONTENT --- */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-700/60">
                  <ul className="space-y-3 pl-5">
                    {logsForDate.map((log, index) => (
                      <li
                        key={index}
                        className="text-gray-300 leading-relaxed relative whitespace-pre-wrap"
                      >
                        <span className="absolute left-[-20px] top-[9px] text-red-400 text-xl leading-none">
                          •
                        </span>
                        {log.entry}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DevLogsPage;
