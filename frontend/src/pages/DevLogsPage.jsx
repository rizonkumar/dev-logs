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
      <div className="flex justify-center items-center py-32">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-stone-200/30 dark:border-stone-700/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-500 rounded-full animate-spin mx-auto animation-delay-300" />
          </div>
          <h3 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
            Loading your development journey...
          </h3>
          <p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            We're fetching your logs and preparing everything just for you.
          </p>
        </div>
      </div>
    );
  } else if (status === "succeeded") {
    content = (
      <div className="space-y-3 sm:space-y-4">
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
          <div className="flex justify-center items-center py-32">
            <div className="text-center max-w-2xl mx-auto">
              <div className="relative mb-12">
                <div
                  className="w-32 h-32 rounded-3xl bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700
                              flex items-center justify-center mx-auto shadow-xl shadow-stone-900/10 dark:shadow-stone-100/10"
                >
                  <BookOpen
                    size={48}
                    className="text-stone-400 dark:text-stone-500"
                  />
                </div>
                <div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full
                              flex items-center justify-center shadow-lg"
                >
                  <Sparkles size={16} className="text-white" />
                </div>
              </div>

              <h3
                className="text-4xl font-bold bg-gradient-to-r from-stone-900 to-stone-700 dark:from-stone-100 dark:to-stone-300
                           bg-clip-text text-transparent mb-6"
              >
                {dateRange.from ? "No entries found" : "Start your journey"}
              </h3>

              <p className="text-xl text-stone-600 dark:text-stone-300 mb-12 leading-relaxed">
                {dateRange.from
                  ? "Try adjusting your date range or clear filters to see all entries."
                  : "Begin your development journey by documenting your first coding experience."}
              </p>

              {!dateRange.from && (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                              text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300
                              shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30
                              hover:scale-105 flex items-center space-x-3 mx-auto overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100
                                  transition-opacity duration-300"
                    />
                    <Sparkles
                      size={20}
                      className="relative z-10 group-hover:rotate-12 transition-transform duration-300"
                    />
                    <span className="relative z-10">
                      Write Your First Entry
                    </span>
                  </button>

                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    It only takes a moment to capture your thoughts
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else if (status === "failed") {
    content = (
      <div className="flex justify-center items-center py-32">
        <div className="text-center max-w-lg mx-auto">
          <div className="relative mb-8">
            <div
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950/40 dark:to-red-900/40
                          flex items-center justify-center mx-auto shadow-lg shadow-red-500/20"
            >
              <X size={32} className="text-red-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full" />
          </div>

          <h3 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Something went wrong
          </h3>

          <p
            className="text-stone-600 dark:text-stone-300 mb-8 leading-relaxed bg-stone-50 dark:bg-stone-800/50
                      rounded-2xl p-6 border border-stone-200/50 dark:border-stone-700/50"
          >
            {error ||
              "We're having trouble loading your development logs. Please try again."}
          </p>

          <button
            onClick={() => dispatch(fetchLogs())}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                      text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300
                      shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30
                      hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.stone.400)_1px,transparent_0)] bg-[length:24px_24px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
          {/* Back Navigation */}
          <div className="mb-4 sm:mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white
                        transition-all duration-300 font-medium group hover:scale-105"
            >
              <div
                className="p-2 rounded-lg bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/50
                          group-hover:bg-white dark:group-hover:bg-stone-800 group-hover:shadow-sm mr-3"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-0.5 transition-transform duration-300"
                />
              </div>
              Back to Dashboard
            </Link>
          </div>

          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            <DevLogsHeader />
            <div className="mt-6 sm:mt-8 text-center lg:text-left">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900
                           dark:from-stone-100 dark:via-stone-200 dark:to-stone-100 bg-clip-text text-transparent mb-4 sm:mb-6"
              >
                Development Journal
              </h1>
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed mx-auto lg:mx-0">
                Your personal chronicle of coding adventures, technical
                discoveries, and growth milestones. Every bug fixed and feature
                built tells a story.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          {logs && logs.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <QuickStatsCard logs={logs} />
            </div>
          )}

          {/* Filter Section */}
          <div className="mb-6 sm:mb-8">
            <div
              className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-stone-200/50 dark:border-stone-700/50
                          shadow-xl shadow-stone-900/5 dark:shadow-stone-100/5 p-4 sm:p-6 lg:p-8"
            >
              <LogFilterBar range={dateRange} setRange={setDateRange} />
              {(dateRange.from || dateRange.to) && (
                <div
                  className="mt-6 p-4 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50
                            rounded-2xl backdrop-blur-sm"
                >
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center font-medium">
                    <Calendar size={16} className="mr-3 text-blue-500" />
                    Showing logs{" "}
                    {dateRange.from &&
                      `from ${format(dateRange.from, "LLL dd, y")}`}{" "}
                    {dateRange.to && `to ${format(dateRange.to, "LLL dd, y")}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Add Entry Section */}
          <div className="mb-6 sm:mb-8">
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
          </div>

          {/* Content Section */}
          <div className="relative">{content}</div>
        </div>
      </div>
    </div>
  );
}

export default DevLogsPage;
