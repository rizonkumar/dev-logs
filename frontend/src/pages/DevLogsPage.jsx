import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createLog, fetchLogs } from "../app/features/logsSlice";
import DevLogsHeader from "../components/DevLogsHeader";
import LogFilterBar from "../components/LogFilterBar";
import DateCard from "../components/DateCard";
import QuickStatsCard from "../components/QuickStatsCard";
import AddEntryCard from "../components/AddEntryCard";
import { format } from "date-fns";
import { ArrowLeft, Calendar, BookOpen, X, Sparkles } from "lucide-react";

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

function DevLogsPage() {
  const dispatch = useDispatch();
  const { logs, status, error } = useSelector((state) => state.logs);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [expandedDate, setExpandedDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [viewMode, setViewMode] = useState("timeline");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLogs());
    }
  }, [status, dispatch]);

  const handleAddEntry = async (e) => {
    console.log("handleAddEntry called");
    e.preventDefault();
    if (newEntry.trim() === "") return;

    const logData = {
      date: selectedDate || getTodayDateString(),
      entry: newEntry,
    };

    try {
      await dispatch(createLog(logData)).unwrap();
      setNewEntry("");
      setIsFormOpen(false);
      console.log("Entry saved successfully");
    } catch (error) {
      console.error("Failed to create log:", error);
    }
  };

  const handleToggleDate = (date) => {
    if (expandedDate === date) {
      setExpandedDate(null);
      setSelectedDate(null);
    } else {
      setExpandedDate(date);
      setSelectedDate(date);
    }
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
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-12 border border-gray-700/40">
              <div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 
                           flex items-center justify-center mx-auto mb-6 border border-gray-600/30"
              >
                <BookOpen size={32} className="text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No entries found
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
                {dateRange.from
                  ? "Try adjusting your date range or start documenting your journey!"
                  : "Begin your development journey by adding your first log entry."}
              </p>
              {!dateRange.from && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                            text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 
                            shadow-lg shadow-purple-500/25 flex items-center space-x-2 mx-auto"
                >
                  <Sparkles size={18} />
                  <span>Write Your First Entry</span>
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-teal-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {logs && logs.length > 0 && <QuickStatsCard logs={logs} />}

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

        <AddEntryCard
          isOpen={isFormOpen}
          onToggle={() => setIsFormOpen(!isFormOpen)}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onSubmit={handleAddEntry}
          isLoading={status === "loading"}
          selectedDate={selectedDate}
          error={error}
        />

        {content}
      </div>
    </div>
  );
}

export default DevLogsPage;
