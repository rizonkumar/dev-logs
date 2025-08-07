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
          className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white border border-stone-200 rounded-2xl p-6 w-full max-w-sm shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Timer Settings
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-500 hover:bg-stone-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="work"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  id="work"
                  value={localWork}
                  onChange={(e) => setLocalWork(Number(e.target.value))}
                  className="w-full bg-stone-50 p-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="break"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  id="break"
                  value={localBreak}
                  onChange={(e) => setLocalBreak(Number(e.target.value))}
                  className="w-full bg-stone-50 p-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleApply}
                className="px-5 py-2 bg-gray-800 hover:bg-black text-white rounded-lg font-semibold transition-colors"
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/80 backdrop-blur-lg border-l border-stone-200 z-40 flex flex-col"
          >
            <div className="p-4 border-b border-stone-200 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                Session History
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-600 hover:bg-stone-200 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length > 0 ? (
                history.map((session) => (
                  <div
                    key={session._id}
                    className="bg-stone-100 p-3 rounded-lg border border-stone-200"
                  >
                    <p className="font-semibold text-gray-800">
                      {session.title}
                    </p>
                    <div className="text-xs text-gray-500 flex items-center justify-between mt-1">
                      <span
                        className={`font-medium capitalize ${
                          session.sessionType === "WORK"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        {session.duration} min{" "}
                        {session.sessionType.toLowerCase()}
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
        </>
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

  const timerConfig = {
    WORK: { color: "blue", name: "Work" },
    BREAK: { color: "green", name: "Break" },
  };

  const { color: timerColor } = timerConfig[sessionType];

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
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const mainButtonColor = `bg-${timerColor}-600 hover:bg-${timerColor}-700`;
  const timerTextColor = `text-${timerColor}-600`;

  return (
    <div className="w-full h-full flex flex-col text-gray-900 relative bg-stone-50">
      <header className="w-full p-4 sm:p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Pomodoro Timer</h2>
        <div className="flex gap-3 z-10">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="p-3 bg-white rounded-full hover:bg-stone-100 border border-stone-200 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <History size={20} />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-white rounded-full hover:bg-stone-100 border border-stone-200 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

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

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex items-center bg-stone-200/70 rounded-lg p-1.5 mb-6 sm:mb-8">
          <button
            onClick={() => dispatch(setSessionType("WORK"))}
            className={`px-4 sm:px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              sessionType === "WORK"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Brain size={16} /> Work
          </button>
          <button
            onClick={() => dispatch(setSessionType("BREAK"))}
            className={`px-4 sm:px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              sessionType === "BREAK"
                ? "bg-white shadow-sm text-green-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Coffee size={16} /> Break
          </button>
        </div>

        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          <svg className="w-full h-full" viewBox="0 0 260 260">
            <circle
              cx="130"
              cy="130"
              r={radius}
              fill="none"
              className="stroke-stone-200"
              strokeWidth="12"
            />
            <motion.circle
              cx="130"
              cy="130"
              r={radius}
              fill="none"
              strokeWidth="12"
              className={`stroke-current ${timerTextColor}`}
              strokeLinecap="round"
              transform="rotate(-90 130 130)"
              style={{ strokeDasharray: circumference }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-6xl sm:text-7xl font-light tracking-widest text-gray-800">
              {formatTime(timeRemaining)}
            </p>
          </div>
        </div>

        <div className="my-6 sm:my-8 text-center w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => dispatch(setCurrentTitle(e.target.value))}
              placeholder="What are you working on?"
              className="w-full bg-transparent text-center text-lg placeholder-gray-400 focus:outline-none"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-px bg-stone-300"></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <p className="text-center w-20 sm:w-24">
            <span className="block text-3xl font-bold text-gray-800">
              {stats.sessionsToday}
            </span>
            <span className="text-xs text-gray-500">Sessions Today</span>
          </p>
          <button
            onClick={handleStartPause}
            className={`w-16 h-16 sm:w-20 sm:h-20 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 ${mainButtonColor}`}
          >
            {isRunning ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" className="ml-1" />
            )}
          </button>
          <button
            onClick={handleReset}
            className="w-12 h-12 bg-stone-200 text-gray-500 rounded-full flex items-center justify-center shadow-sm hover:bg-stone-300 transition-all duration-300"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default PomodoroTimerPage;
