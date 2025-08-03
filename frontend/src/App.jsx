import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DevLogsPage from "./pages/DevLogsPage";
import "./App.css";
import DevBoardPage from "./pages/DevBoardPage";
import MainLayout from "./components/Layout/MainLayout";
import PomodoroTimer from "./components/PomodoroTimer";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/logs" element={<DevLogsPage />} />
          <Route path="/board" element={<DevBoardPage />} />
          <Route path="/timer" element={<PomodoroTimer />} />
          <Route path="/todos" element={<DevBoardPage />} />
          <Route
            path="/profile"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold text-white">
                  Profile (Coming Soon)
                </h1>
              </div>
            }
          />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
