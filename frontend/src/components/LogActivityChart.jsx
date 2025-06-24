import React from "react";
import ActivityCalendar from "react-activity-calendar";

function LogActivityChart({ data }) {
  const explicitTheme = {
    light: ["#f0f0f0", "#c4edde", "#7ac7c4", "#f73859", "#384259"],
    dark: ["hsl(0, 0%, 12%)", "#00443a", "#00705b", "#00a182", "#00d6ad"],
  };

  return (
    <div className="bg-gray-800/80 p-6 rounded-2xl border border-gray-700/60 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4">Log Activity</h3>
      <ActivityCalendar
        data={data}
        theme={explicitTheme}
        blockSize={12}
        blockMargin={3}
        fontSize={14}
      />
    </div>
  );
}

export default LogActivityChart;
