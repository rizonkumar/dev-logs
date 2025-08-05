import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startTimerThunk,
  pauseTimerThunk,
  setSessionType,
  resetTimer,
  fetchStats,
  fetchHistory,
  setInitialTimes,
  setCurrentTitle,
  setWorkMinutes,
  setBreakMinutes,
} from "../app/features/pomodoroSlice";
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  Coffee,
  Settings,
  X,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "../app/features/authSlice";

const SettingsModal = ({ isOpen, onClose, currentWork, currentBreak }) => {
  const dispatch = useDispatch();
  const [localWork, setLocalWork] = useState(currentWork);
  const [localBreak, setLocalBreak] = useState(currentBreak);

  const handleApply = () => {
    dispatch(setWorkMinutes(localWork));
    dispatch(setBreakMinutes(localBreak));
    dispatch(
      updateProfile({
        pomodoroWorkMinutes: localWork,
        pomodoroBreakMinutes: localBreak,
      })
    );
    onClose();
  };

  useEffect(() => {
    setLocalWork(currentWork);
    setLocalBreak(currentBreak);
  }, [currentWork, currentBreak]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 w-full max-w-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Timer Settings</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="work"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  id="work"
                  value={localWork}
                  onChange={(e) => setLocalWork(e.target.value)}
                  className="w-full bg-gray-800/50 p-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="break"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  id="break"
                  value={localBreak}
                  onChange={(e) => setLocalBreak(e.target.value)}
                  className="w-full bg-gray-800/50 p-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleApply}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HistoryPanel = ({ history, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 h-full w-full max-w-sm bg-gray-900/95 backdrop-blur-lg border-l border-white/10 z-40 flex flex-col"
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
            <h3 className="text-xl font-bold">Session History</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length > 0 ? (
              history.map((session) => (
                <div key={session._id} className="bg-white/5 p-3 rounded-lg">
                  <p className="font-semibold">{session.title}</p>
                  <div className="text-xs text-gray-400 flex items-center justify-between mt-1">
                    <span>
                      {session.duration} min {session.sessionType.toLowerCase()}
                    </span>
                    <span>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-8">
                No session history yet.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PomodoroTimerPage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    timeRemaining,
    isRunning,
    sessionType,
    workMinutes,
    breakMinutes,
    currentTitle,
    stats,
    history,
  } = useSelector((state) => state.pomodoro);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (userInfo) {
      dispatch(
        setInitialTimes({
          workMinutes: userInfo.pomodoroWorkMinutes,
          breakMinutes: userInfo.pomodoroBreakMinutes,
        })
      );
    }
    dispatch(fetchStats());
    dispatch(fetchHistory());
  }, [dispatch, userInfo]);

  const handleStartPause = () => {
    if (isRunning) {
      dispatch(pauseTimerThunk());
    } else {
      dispatch(startTimerThunk());
    }
  };

  const handleReset = () => {
    dispatch(pauseTimerThunk());
    dispatch(resetTimer());
  };

  const timerColor = sessionType === "WORK" ? "violet" : "teal";
  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;
  const totalDuration =
    (sessionType === "WORK" ? workMinutes : breakMinutes) * 60;
  const progress =
    totalDuration > 0
      ? ((totalDuration - timeRemaining) / totalDuration) * 100
      : 0;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      <div className="absolute top-6 right-6 flex gap-3 z-50">
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="p-3 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors"
        >
          <History size={20} />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentWork={workMinutes}
        currentBreak={breakMinutes}
      />
      <HistoryPanel
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <div className="flex items-center bg-gray-800/50 rounded-lg p-1.5 mb-8">
        <button
          onClick={() => dispatch(setSessionType("WORK"))}
          className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            sessionType === "WORK"
              ? "bg-gray-900 shadow-md text-violet-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Brain size={16} /> Work
        </button>
        <button
          onClick={() => dispatch(setSessionType("BREAK"))}
          className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            sessionType === "BREAK"
              ? "bg-gray-900 shadow-md text-teal-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Coffee size={16} /> Break
        </button>
      </div>

      <div className="relative w-80 h-80">
        <svg className="w-full h-full" viewBox="0 0 300 300">
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            className="stroke-gray-800/50"
            strokeWidth="8"
          />
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            strokeWidth="8"
            className={`stroke-current text-${timerColor}-500`}
            strokeLinecap="round"
            transform="rotate(-90 150 150)"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 0.3s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-7xl font-light tracking-widest">
            {formatTime(timeRemaining)}
          </p>
        </div>
      </div>

      <div className="my-8 text-center w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => dispatch(setCurrentTitle(e.target.value))}
            placeholder="What are you working on?"
            className="w-full bg-transparent text-center text-lg placeholder-gray-500 focus:outline-none"
          />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gray-700"></div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <p className="text-center">
          <span className="block text-3xl font-bold">
            {stats.sessionsToday}
          </span>
          <span className="text-xs text-gray-400">Sessions Today</span>
        </p>
        <button
          onClick={handleStartPause}
          className={`w-20 h-20 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-${timerColor}-500 to-${
            timerColor === "violet" ? "purple" : "cyan"
          }-600 shadow-${timerColor}-500/30`}
        >
          {isRunning ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button
          onClick={handleReset}
          className="w-12 h-12 bg-gray-800/50 text-gray-400 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-700 transition-all duration-300"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimerPage;
