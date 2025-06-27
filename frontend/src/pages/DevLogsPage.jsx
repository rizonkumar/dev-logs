import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createLog, fetchLogs } from "../app/features/logsSlice";
import DevLogsHeader from "../components/DevLogsHeader";
import LogFilterBar from "../components/LogFilterBar";
import { format } from "date-fns";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  Calendar,
  BookOpen,
  Coffee,
  Code,
  Zap,
  Clock,
  Edit3,
  Save,
  X,
} from "lucide-react";

const groupLogsByDate = (logs) => {
  if (!logs) return {};
  return logs.reduce((acc, log) => {
    const date = new Date(log.date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {});
};

const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayInTimezone = new Date(today.getTime() - offset * 60 * 1000);
  return todayInTimezone.toISOString().split("T")[0];
};

const getDateRelativeDisplay = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (daysAgo <= 7) {
    return `${daysAgo} days ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

const AnimatedLogEntry = ({ log, index }) => (
  <div
    className="group relative p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 
               border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 
               hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.01]"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2" />
        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm group-hover:text-white transition-colors duration-300">
          {log.entry}
        </p>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/30">
        <span className="text-xs text-gray-500 flex items-center">
          <Clock size={12} className="mr-1" />
          {new Date(log.createdAt || log.date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <button className="text-xs text-gray-500 hover:text-purple-400 transition-colors duration-200 opacity-0 group-hover:opacity-100">
          <Edit3 size={12} />
        </button>
      </div>
    </div>
  </div>
);

const DateCard = ({ date, logs, isExpanded, onToggle, onViewFull }) => {
  const relativeDate = getDateRelativeDisplay(date);
  const fullDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="group relative overflow-hidden">
      <div
        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg 
                   rounded-2xl border border-gray-700/40 shadow-xl 
                   hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Header */}
        <div className="relative p-6 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-4 cursor-pointer flex-grow"
              onClick={onToggle}
            >
              <div className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown
                    size={24}
                    className="text-purple-400 transition-transform duration-300 rotate-0"
                  />
                ) : (
                  <ChevronRight
                    size={24}
                    className="text-gray-500 group-hover:text-purple-400 transition-all duration-300"
                  />
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  {relativeDate === "Today" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                    {relativeDate}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {fullDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-700/50 border border-gray-600/50">
                <BookOpen size={14} className="text-gray-400" />
                <span className="text-sm text-gray-300 font-medium">
                  {logs.length} {logs.length === 1 ? "entry" : "entries"}
                </span>
              </div>

              <button
                onClick={onViewFull}
                className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 
                          rounded-lg transition-all duration-300 group/btn"
                title="View detailed page"
              >
                <ExternalLink
                  size={18}
                  className="group-hover/btn:scale-110 transition-transform duration-200"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 space-y-4">
            {logs.map((log, index) => (
              <AnimatedLogEntry
                key={log._id || index}
                log={log}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickStatsCard = ({ logs }) => {
  const today = getTodayDateString();
  const todayLogs = logs.filter((log) => log.date === today).length;
  const thisWeekLogs = logs.filter((log) => {
    const logDate = new Date(log.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  }).length;

  const totalEntries = logs.reduce(
    (total, log) => total + (log.entry ? log.entry.split("\n").length : 1),
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-400 text-sm font-medium">Today</p>
            <p className="text-2xl font-bold text-white">{todayLogs}</p>
            <p className="text-gray-400 text-xs">entries</p>
          </div>
          <Zap className="w-8 h-8 text-green-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-400 text-sm font-medium">This Week</p>
            <p className="text-2xl font-bold text-white">{thisWeekLogs}</p>
            <p className="text-gray-400 text-xs">entries</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-400 text-sm font-medium">Total Lines</p>
            <p className="text-2xl font-bold text-white">{totalEntries}</p>
            <p className="text-gray-400 text-xs">written</p>
          </div>
          <Code className="w-8 h-8 text-purple-400" />
        </div>
      </div>
    </div>
  );
};

const AddEntryCard = ({
  isOpen,
  onToggle,
  newEntry,
  setNewEntry,
  onSubmit,
  isLoading,
}) => (
  <div className="mb-8 relative overflow-hidden">
    <div
      className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg 
                 rounded-2xl border border-gray-700/40 shadow-xl 
                 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-transparent to-green-600/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <button
        onClick={onToggle}
        className="relative w-full flex justify-between items-center p-6 group"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-green-500/20 flex items-center justify-center border border-teal-500/30 group-hover:scale-110 transition-transform duration-300">
            <Plus
              size={24}
              className="text-teal-400 group-hover:rotate-180 transition-transform duration-500"
            />
          </div>
          <div className="text-left">
            <span className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
              Capture Today's Journey
            </span>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              Document your development insights, challenges, and victories
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Coffee className="w-5 h-5 text-amber-400" />
          {isOpen ? (
            <ChevronUp
              size={24}
              className="text-gray-400 group-hover:text-teal-400 transition-colors duration-300"
            />
          ) : (
            <ChevronDown
              size={24}
              className="text-gray-400 group-hover:text-teal-400 transition-colors duration-300"
            />
          )}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 border-t border-gray-700/30">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="w-full bg-gray-900/70 p-4 rounded-xl border border-gray-600/50 
                          focus:ring-2 focus:ring-teal-400 focus:border-transparent focus:outline-none 
                          transition-all duration-300 text-gray-300 placeholder-gray-500 resize-none
                          min-h-[120px] shadow-inner"
                placeholder={`What did you discover today? Share your coding insights, challenges overcome, or features built...`}
                autoFocus
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {newEntry.length} characters
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Calendar size={14} />
                <span>{getTodayDateString()}</span>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onToggle}
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

function DevLogsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { logs, status, error } = useSelector((state) => state.logs);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [expandedDate, setExpandedDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLogs());
    }
  }, [status, dispatch]);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (newEntry.trim() === "") return;

    const logData = {
      date: getTodayDateString(),
      entry: newEntry,
    };

    dispatch(createLog(logData));

    setNewEntry("");
    setIsFormOpen(false);
  };

  const handleToggleDate = (date) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter((log) => {
      if (!dateRange.from && !dateRange.to) return true;

      const logDate = new Date(log.date);
      logDate.setUTCHours(0, 0, 0, 0);

      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setUTCHours(0, 0, 0, 0);
        if (logDate < fromDate) return false;
      }
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setUTCHours(0, 0, 0, 0);
        if (logDate > toDate) return false;
      }
      return true;
    });
  }, [logs, dateRange]);

  const groupedLogs = groupLogsByDate(filteredLogs);
  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  let content;

  if (status === "loading") {
    content = (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your development journey...</p>
        </div>
      </div>
    );
  } else if (status === "succeeded") {
    content = (
      <div className="space-y-6">
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <DateCard
              key={date}
              date={date}
              logs={groupedLogs[date]}
              isExpanded={expandedDate === date}
              onToggle={() => handleToggleDate(date)}
              onViewFull={() => navigate(`/logs/${date}`)}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-12 border border-gray-700/40">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-bold text-white mb-2">
                No entries found
              </h3>
              <p className="text-gray-400 mb-4">
                {dateRange.from
                  ? "Try adjusting your date range or start documenting your journey!"
                  : "Begin your development journey by adding your first log entry."}
              </p>
              {!dateRange.from && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                            text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 
                            shadow-lg shadow-purple-500/25"
                >
                  Write Your First Entry
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else if (status === "failed") {
    content = (
      <div className="text-center py-20">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-12">
          <X size={48} className="mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-bold text-red-400 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-teal-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 
                    transition-all duration-300 font-semibold mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
          />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12">
          <DevLogsHeader />
          <div className="mt-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
              Development Journal
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
              Your personal chronicle of coding adventures, technical
              discoveries, and growth milestones. Every bug fixed and feature
              built tells a story.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        {logs && logs.length > 0 && <QuickStatsCard logs={logs} />}

        {/* Filters */}
        <div className="mb-8">
          <LogFilterBar range={dateRange} setRange={setDateRange} />
          {(dateRange.from || dateRange.to) && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-sm text-blue-300 flex items-center">
                <Calendar size={16} className="mr-2" />
                Showing logs{" "}
                {dateRange.from &&
                  `from ${format(dateRange.from, "LLL dd, y")}`}{" "}
                {dateRange.to && `to ${format(dateRange.to, "LLL dd, y")}`}
              </p>
            </div>
          )}
        </div>

        {/* Add Entry Form */}
        <AddEntryCard
          isOpen={isFormOpen}
          onToggle={() => setIsFormOpen(!isFormOpen)}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onSubmit={handleAddEntry}
          isLoading={status === "loading"}
        />

        {/* Content */}
        {content}
      </div>
    </div>
  );
}

export default DevLogsPage;
