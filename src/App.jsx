import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DevLogsPage from "./pages/DevLogsPage";
import LogDetailPage from "./pages/LogDetailPage";

function App() {
  const [logs, setLogs] = useState([
    {
      date: "2025-06-23",
      entry:
        "Replaced the static Tech Stack component with a more dynamic and scalable Log Stats widget.",
    },
    {
      date: "2025-06-23",
      entry:
        "Enhanced the UI of the Log Detail Page and added functionality to add new logs directly from the page.",
    },
    {
      date: "2025-06-22",
      entry: "Refactored the homepage layout to be more modular.",
    },
    {
      date: "2025-06-21",
      entry:
        "Fixed the React Router bug caused by importing Link from the wrong package.",
    },
    {
      date: "2025-06-20",
      entry: "Planned new features for the homepage dashboard.",
    },
    { date: "2025-05-15", entry: "Fixed a bug related to styling on mobile." },
    { date: "2025-04-01", entry: "Initial project setup." },
  ]);

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200 p-4 sm:p-6 lg:p-8">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage logs={logs} />} />
          <Route path="/logs" element={<DevLogsPage logs={logs} />} />
          <Route
            path="/logs/:date"
            element={<LogDetailPage logs={logs} setLogs={setLogs} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
