import React, { useMemo } from "react";
import { TrendingUp, BarChart2, Hash, Zap } from "lucide-react";

const calculateStreak = (dates) => {
  if (dates.size === 0) return 0;

  const sortedDates = Array.from(dates)
    .map((d) => new Date(d))
    .sort((a, b) => b - a);
  let streak = 0;
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDate = new Date(sortedDates[0]);
  firstDate.setHours(0, 0, 0, 0);

  const diffTime = today - firstDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return 0;
  }

  streak = 1;
  let lastDate = firstDate;

  for (let i = 1; i < sortedDates.length; i++) {
    let currentDate = new Date(sortedDates[i]);
    currentDate.setHours(0, 0, 0, 0);

    let expectedDate = new Date(lastDate);
    expectedDate.setDate(lastDate.getDate() - 1);

    if (currentDate.getTime() === expectedDate.getTime()) {
      streak++;
      lastDate = currentDate;
    } else if (currentDate.getTime() < expectedDate.getTime()) {
      break;
    }
  }

  return streak;
};

function LogStats({ logs }) {
  const stats = useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        totalLogs: 0,
        activeDays: 0,
        currentStreak: 0,
        busiestDay: "N/A",
      };
    }

    const totalLogs = logs.length;
    const uniqueDates = new Set(logs.map((log) => log.date));
    const activeDays = uniqueDates.size;
    const currentStreak = calculateStreak(uniqueDates);

    const dayCounts = logs.reduce((acc, log) => {
      const day = new Date(log.date).toLocaleString("en-US", {
        weekday: "long",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const busiestDay = Object.keys(dayCounts).reduce(
      (a, b) => (dayCounts[a] > dayCounts[b] ? a : b),
      "N/A"
    );

    return { totalLogs, activeDays, currentStreak, busiestDay };
  }, [logs]);

  const statItems = [
    { name: "Total Logs", value: stats.totalLogs, icon: <Hash size={20} /> },
    {
      name: "Active Days",
      value: stats.activeDays,
      icon: <BarChart2 size={20} />,
    },
    {
      name: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: <Zap size={20} />,
    },
    {
      name: "Busiest Day",
      value: stats.busiestDay,
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <div className="bg-gray-800/80 p-6 rounded-2xl border border-gray-700/60 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4">At a Glance</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {statItems.map((item) => (
          <div key={item.name} className="flex items-start">
            <div className="bg-gray-700/50 p-2 rounded-lg mr-4 text-teal-400">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400">{item.name}</p>
              <p className="text-xl font-bold text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogStats;
