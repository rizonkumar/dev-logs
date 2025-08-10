import React from "react";
import { TrendingUp, BookOpen, Github, Clock } from "lucide-react";

const QuickStatsCard = ({ logs, githubData }) => {
  const totalLogs = logs?.length || 0;
  const totalCommits = githubData?.totalContributions || 0;
  const recentLogs = logs?.slice(0, 2) || [];

  return (
    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <TrendingUp size={18} className="mr-2 text-blue-600" />
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl text-center border border-blue-200 dark:border-blue-900/40">
          <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{totalLogs}</p>
          <p className="text-blue-700 dark:text-blue-300 text-xs font-medium">Dev Logs</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl text-center border border-green-200 dark:border-green-900/40">
          <Github className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{totalCommits}</p>
          <p className="text-green-700 dark:text-green-300 text-xs font-medium">Commits</p>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-gray-800 dark:text-white text-sm font-semibold flex items-center mb-3">
          <Clock size={14} className="mr-2 text-gray-500 dark:text-stone-400" />
          Recent Activity
        </p>
        {recentLogs.length > 0 ? (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log._id} className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
                <p className="text-gray-700 dark:text-stone-300 text-xs leading-relaxed line-clamp-2">{log.entry}</p>
                <p className="text-gray-500 dark:text-stone-400 text-xs mt-1">
                  {new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 flex-1 flex flex-col justify-center items-center h-full">
            <p className="text-gray-500 text-sm">No recent logs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickStatsCard;


