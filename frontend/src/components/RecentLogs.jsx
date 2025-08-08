import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronsRight } from "lucide-react";

function RecentLogs({ logs }) {
  // Get the 3 most recent logs
  const recentLogs = logs.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800/80 p-6 rounded-2xl border border-stone-200 dark:border-gray-700/60 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentLogs.map((log, index) => (
          <div
            key={index}
            className="border-b border-stone-200 dark:border-gray-700/50 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              <Calendar size={12} className="mr-2" />
              <time>{log.date}</time>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
              {log.entry}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <Link
          to="/logs"
          className="text-sm font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors flex items-center justify-end"
        >
          View all logs
          <ChevronsRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
}

export default RecentLogs;
