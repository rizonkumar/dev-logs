import React from "react";
import { Zap, Calendar, Code } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-green-600">Today</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayLogs}</p>
            <p className="text-gray-500 dark:text-stone-300 text-xs">entries</p>
          </div>
          <Zap className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">This Week</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{thisWeekLogs}</p>
            <p className="text-gray-500 dark:text-stone-300 text-xs">entries</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Total Lines</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEntries}</p>
            <p className="text-gray-500 dark:text-stone-300 text-xs">written</p>
          </div>
          <Code className="w-8 h-8 text-indigo-500" />
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;
