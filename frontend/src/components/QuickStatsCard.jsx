import React from "react";
import {
  Zap,
  Calendar,
  Code,
  TrendingUp,
  Target,
  BookOpen,
} from "lucide-react";

const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayInTimezone = new Date(today.getTime() - offset * 60 * 1000);
  return todayInTimezone.toISOString().split("T")[0];
};

const QuickStatsCard = ({ logs }) => {
  const today = getTodayDateString();
  const todayLogs = logs.filter(
    (log) => new Date(log.date).toISOString().split("T")[0] === today
  ).length;
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today's Activity */}
      <div
        className="group relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30
                    p-6 rounded-3xl border border-green-200/50 dark:border-green-800/50 shadow-lg shadow-green-500/10
                    hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <Zap size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                Today
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
                {todayLogs}
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                {todayLogs === 1 ? "entry written" : "entries written"}
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500
                          flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300"
            >
              <Zap size={24} className="text-white" />
            </div>
            {todayLogs > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-4 border-t border-green-200/50 dark:border-green-800/50">
          <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-400 mb-2">
            <span>Daily Goal</span>
            <span>{Math.min(todayLogs, 5)}/5</span>
          </div>
          <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayLogs / 5) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* This Week */}
      <div
        className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30
                    p-6 rounded-3xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg shadow-blue-500/10
                    hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Calendar
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                This Week
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                {thisWeekLogs}
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                {thisWeekLogs === 1 ? "entry this week" : "entries this week"}
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500
                          flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300"
            >
              <Calendar size={24} className="text-white" />
            </div>
            <div
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500
                          rounded-full flex items-center justify-center shadow-lg"
            >
              <TrendingUp size={14} className="text-white" />
            </div>
          </div>
        </div>

        {/* Weekly average */}
        <div className="mt-6 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400">
            <span>Weekly Average</span>
            <span>{(thisWeekLogs / 7).toFixed(1)} per day</span>
          </div>
        </div>
      </div>

      {/* Total Content */}
      <div
        className="group relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30
                    p-6 rounded-3xl border border-purple-200/50 dark:border-purple-800/50 shadow-lg shadow-purple-500/10
                    hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Code
                  size={16}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                Total Lines
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                {totalEntries.toLocaleString()}
              </p>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                lines written
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500
                          flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300"
            >
              <Code size={24} className="text-white" />
            </div>
            <div
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500
                          rounded-full flex items-center justify-center shadow-lg"
            >
              <Target size={14} className="text-white" />
            </div>
          </div>
        </div>

        {/* Achievement indicator */}
        <div className="mt-6 pt-4 border-t border-purple-200/50 dark:border-purple-800/50">
          <div className="flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400">
            <BookOpen size={12} />
            <span>
              {totalEntries > 1000
                ? "Writing Master!"
                : totalEntries > 500
                ? "Pro Writer"
                : totalEntries > 100
                ? "Getting Started"
                : "Just Beginning"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;
