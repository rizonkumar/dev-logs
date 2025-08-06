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

  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLogs());
    }
  }, [status, dispatch]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (newEntry.trim() === "") return;

    const logData = {
      date: selectedDate || getTodayDateString(),
      entry: newEntry,
      tags: selectedTags,
    };

    try {
      await dispatch(createLog(logData)).unwrap();
      setNewEntry("");
      setSelectedTags([]);
      setIsFormOpen(false);
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
          <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your development journey...</p>
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
            <div className="bg-white rounded-2xl p-12 border border-stone-200 shadow-sm">
              <div
                className="w-20 h-20 rounded-2xl bg-stone-100 
                           flex items-center justify-center mx-auto mb-6 border border-stone-200"
              >
                <BookOpen size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No entries found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
                {dateRange.from
                  ? "Try adjusting your date range or start documenting your journey!"
                  : "Begin your development journey by adding your first log entry."}
              </p>
              {!dateRange.from && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gray-800 hover:bg-black 
                            text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 
                            shadow-sm flex items-center space-x-2 mx-auto"
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
        <div className="bg-red-50 border border-red-200 rounded-2xl p-12">
          <X size={48} className="mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Development Journal
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
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
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800 flex items-center">
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
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />

        {content}
      </div>
    </div>
  );
}

export default DevLogsPage;
