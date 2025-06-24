import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DevLogsPage from "./pages/DevLogsPage";
import LogDetailPage from "./pages/LogDetailPage";

function App() {
  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200 p-4 sm:p-6 lg:p-8">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/logs" element={<DevLogsPage />} />
          <Route path="/logs/:date" element={<LogDetailPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
