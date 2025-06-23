import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DevLogsHeader from "../components/DevLogsHeader";
import { ArrowRight } from "lucide-react";

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

function DevLogsPage() {
  const logs = useSelector((state) => state.logs.value);

  const groupedLogs = groupLogsByDate(logs);
  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <DevLogsHeader />

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white">DAILY DEVLOGS</h2>
        <p className="text-gray-400 mt-1">
          Documenting my daily development journey — bugs, features, and
          everything in between.
        </p>
      </div>

      <div className="space-y-8">
        {sortedDates.map((date) => {
          const logsForDate = groupedLogs[date];
          const formattedDate = new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
          });

          return (
            <div key={date}>
              <div className="flex items-baseline justify-between border-b-2 border-gray-700 pb-2">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {formattedDate}
                  </h3>
                  <p className="text-sm text-gray-500">{dayOfWeek}</p>
                </div>
                <p className="text-sm text-gray-400">
                  {logsForDate.length}{" "}
                  {logsForDate.length > 1 ? "entries" : "entry"}
                </p>
              </div>
              <div className="mt-4">
                <Link
                  to={`/logs/${date}`}
                  className="bg-gray-800 hover:bg-gray-700/80 p-4 rounded-lg flex justify-between items-center transition-colors duration-200 border border-gray-700/60"
                >
                  <span className="font-medium text-gray-300">
                    View entries for this day
                  </span>
                  <ArrowRight size={16} className="text-teal-400" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DevLogsPage;
