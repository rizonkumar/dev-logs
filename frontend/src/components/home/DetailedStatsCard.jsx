import React from "react";
import {
  Sparkles,
  CalendarDays,
  Star,
  Flame,
  Moon,
  Zap,
  Rocket,
  Trophy,
  Crown,
} from "lucide-react";
import StatTile from "./StatTile";
import AchievementBadge from "./AchievementBadge";
import { computeStreaksFromLogs } from "./computeStreaks";

const DetailedStatsCard = ({ logs, logStats, githubData }) => {
  const thisWeekLogs =
    logs?.filter(
      (log) =>
        new Date(log.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0;

  const fallbackStreaks = computeStreaksFromLogs(logs);
  const currentStreak =
    typeof logStats?.currentStreak === "number"
      ? logStats.currentStreak
      : fallbackStreaks.currentStreak;
  const longestStreak =
    typeof logStats?.longestStreak === "number"
      ? logStats.longestStreak
      : fallbackStreaks.longestStreak;

  const productivityScore = Math.min(
    100,
    Math.round((thisWeekLogs / 7) * 50 + currentStreak * 5)
  );

  return (
    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <Sparkles size={18} className="mr-2 text-purple-600" />
        Detailed Insights
      </h3>

      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            icon={CalendarDays}
            title="This Week"
            value={thisWeekLogs}
            suffix="logs"
            className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40"
            iconWrapClass="ring-purple-300/40 bg-purple-500/15 text-purple-700 dark:text-purple-300"
          />
          <StatTile
            icon={Star}
            title="GitHub Stars"
            value={githubData?.totalStars || 0}
            className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/30"
            iconWrapClass="ring-yellow-300/40 bg-yellow-500/15 text-yellow-600 dark:text-yellow-300"
          />
          <StatTile
            icon={Flame}
            title="Current Streak"
            value={currentStreak}
            suffix="days"
            className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/40"
            iconWrapClass="ring-orange-300/40 bg-orange-500/15 text-orange-600 dark:text-orange-300"
          />
          <StatTile
            icon={Flame}
            title="Longest Streak"
            value={longestStreak}
            suffix="days"
            className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40"
            iconWrapClass="ring-red-300/40 bg-red-500/15 text-red-600 dark:text-red-300"
          />
        </div>

        <div className="bg-stone-100 dark:bg-stone-800/70 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              Productivity Score
            </p>
            <span className={`text-sm font-bold text-blue-600`}>
              {productivityScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-stone-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${productivityScore}%` }}
            ></div>
          </div>
        </div>

        {(() => {
          const baseClass =
            "ring-stone-300 bg-stone-100 dark:ring-stone-700 dark:bg-stone-800";
          const scale = [
            {
              threshold: 0,
              label: "Start",
              icon: Moon,
              cls: "ring-stone-300/60 bg-stone-500/10 text-stone-700 dark:text-stone-200",
            },
            {
              threshold: 10,
              label: "Spark",
              icon: Zap,
              cls: "ring-cyan-300/50 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
            },
            {
              threshold: 20,
              label: "Warm-Up",
              icon: Flame,
              cls: "ring-orange-300/50 bg-orange-500/15 text-orange-700 dark:text-orange-300",
            },
            {
              threshold: 40,
              label: "Momentum",
              icon: Rocket,
              cls: "ring-blue-300/50 bg-blue-500/15 text-blue-700 dark:text-blue-300",
            },
            {
              threshold: 60,
              label: "Focus",
              icon: Sparkles,
              cls: "ring-violet-300/50 bg-violet-500/15 text-violet-700 dark:text-violet-300",
            },
            {
              threshold: 80,
              label: "Beast",
              icon: Trophy,
              cls: "ring-amber-300/50 bg-amber-500/15 text-amber-700 dark:text-amber-300",
            },
            {
              threshold: 95,
              label: "Legend",
              icon: Crown,
              cls: "ring-yellow-300/60 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
            },
          ];

          let currentIndex = 0;
          for (let i = 0; i < scale.length; i += 1) {
            if (productivityScore >= scale[i].threshold) currentIndex = i;
          }

          const current = scale[currentIndex];
          return (
            <div className="flex flex-wrap items-center gap-2">
              <AchievementBadge
                achieved
                icon={current.icon}
                label={current.label}
                achievedClass={current.cls}
                baseClass={baseClass}
              />
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default DetailedStatsCard;
