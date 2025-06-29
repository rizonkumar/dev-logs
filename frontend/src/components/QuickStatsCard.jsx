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

export default QuickStatsCard;
