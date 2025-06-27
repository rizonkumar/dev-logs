import React from "react";
import ActivityCalendar from "react-activity-calendar";

function LogActivityChart({
  data,
  title = "Log Activity",
  compact = false,
  color = "purple",
}) {
  const getTheme = (colorType) => {
    switch (colorType) {
      case "green":
        return {
          light: ["#f0f0f0", "#c6f6d5", "#68d391", "#38a169", "#2f855a"],
          dark: ["hsl(0, 0%, 12%)", "#0f4c3a", "#1a7f5a", "#22c55e", "#4ade80"],
        };
      case "purple":
      default:
        return {
          light: ["#f0f0f0", "#e9d5ff", "#c084fc", "#a855f7", "#7c3aed"],
          dark: ["hsl(0, 0%, 12%)", "#3c1a78", "#5b21b6", "#7c3aed", "#a855f7"],
        };
    }
  };

  const explicitTheme = getTheme(color);

  if (compact) {
    return (
      <div className="w-full h-full">
        {title && (
          <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
        )}
        {data && data.length > 0 ? (
          <div className="w-full">
            <ActivityCalendar
              data={data}
              theme={explicitTheme}
              blockSize={8}
              blockMargin={2}
              fontSize={10}
              showWeekdayLabels={false}
              hideColorLegend={true}
              hideMonthLabels={false}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-xs">No activity data</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800/80 p-6 rounded-2xl border border-gray-700/60 backdrop-blur-sm min-h-[220px]">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      {data && data.length > 0 ? (
        <ActivityCalendar
          data={data}
          theme={explicitTheme}
          blockSize={12}
          blockMargin={3}
          fontSize={14}
        />
      ) : (
        <div className="flex items-center justify-center h-full pt-10">
          <p className="text-gray-400 text-sm">No activity to display yet.</p>
        </div>
      )}
    </div>
  );
}

export default LogActivityChart;
