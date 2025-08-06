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
          light: ["#f0f0f0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
        };
      case "purple":
      default:
        return {
          light: ["#f0f0f0", "#a2d2ff", "#6e9eeb", "#4668d7", "#2542a4"],
        };
    }
  };

  // We only need the light theme now
  const explicitTheme = getTheme(color).light;

  if (compact) {
    return (
      <div className="w-full h-full">
        {title && (
          <h3 className="text-sm font-bold text-gray-800 mb-2">{title}</h3>
        )}
        {data && data.length > 0 ? (
          <div className="w-full">
            <ActivityCalendar
              data={data}
              theme={{ light: explicitTheme }}
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
            <p className="text-gray-500 text-xs">No activity data</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm min-h-[220px]">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      {data && data.length > 0 ? (
        <ActivityCalendar
          data={data}
          theme={{ light: explicitTheme }}
          blockSize={12}
          blockMargin={3}
          fontSize={14}
        />
      ) : (
        <div className="flex items-center justify-center h-full pt-10">
          <p className="text-gray-500 text-sm">No activity to display yet.</p>
        </div>
      )}
    </div>
  );
}

export default LogActivityChart;
