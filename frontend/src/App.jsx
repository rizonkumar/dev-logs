import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/HomePage";
import DevLogsPage from "./pages/DevLogsPage";
import DevBoardPage from "./pages/DevBoardPage";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./components/Layout/MainLayout";
import PomodoroTimer from "./components/PomodoroTimer";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<PrivateRoute />}>
          <Route
            path="/*"
            element={
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
            }
          />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
