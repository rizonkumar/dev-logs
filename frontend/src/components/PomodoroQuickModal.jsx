import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startTimerThunk,
  pauseTimerThunk,
  setSessionType,
  resetTimer,
  setCurrentTitle,
  setTag,
  setWorkMinutes,
  fetchStats,
} from "../app/features/pomodoroSlice";
import { X, Play, Pause, Plus, Minus, Tag as TagIcon } from "lucide-react";
import { motion as Motion } from "framer-motion";

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const PomodoroQuickModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const {
    timeRemaining,
    isRunning,
    sessionType,
    workMinutes,
    currentTitle,
    currentTag,
    stats,
  } = useSelector((state) => state.pomodoro);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchStats());
    }
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  const isWork = sessionType === "WORK";
  const minutes = workMinutes; // work-only modal

  const handleStartPause = () => {
    if (isRunning) {
      dispatch(pauseTimerThunk());
    } else {
      if (!isWork) dispatch(setSessionType("WORK"));
      dispatch(startTimerThunk());
    }
  };

  const handleAdjust = (delta) => {
    if (isRunning) return; // prevent changes mid-run
    const next = clamp(minutes + delta, 1, 180);
    dispatch(setWorkMinutes(next));
  };

  const handleReset = () => {
    dispatch(pauseTimerThunk());
    dispatch(resetTimer());
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  // Dynamic timer color: start red, halfway turns amber, near-end turns green
  const totalWorkSeconds = Math.max(1, workMinutes * 60);
  const remaining = Math.max(0, Math.min(timeRemaining, totalWorkSeconds));
  const ratioRemaining = remaining / totalWorkSeconds;
  const nearEndThreshold = Math.min(120, Math.round(totalWorkSeconds * 0.15));
  const colorClass =
    remaining <= nearEndThreshold
      ? "text-green-600"
      : ratioRemaining <= 0.5
      ? "text-amber-600"
      : "text-red-600";

  return (
    <Motion.div
      className="fixed bottom-6 right-6 z-50"
      drag
      dragMomentum={false}
      dragElastic={0.05}
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
    >
      <div className="w-[min(90vw,420px)] bg-white/95 dark:bg-stone-950/95 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-600 dark:text-stone-300">
            <span className="font-semibold">Pomodoro</span>
            <span className="opacity-70"> • Sessions today </span>
            <span className="font-bold text-blue-600">
              {stats?.sessionsToday ?? 0}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300"
            aria-label="Close timer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {/* Time + primary control row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-2">
              <button
                onClick={() => handleAdjust(-1)}
                className="h-10 w-10 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50"
                disabled={isRunning}
                aria-label="Decrease minutes"
              >
                <Minus size={18} />
              </button>
              <div
                className={`flex-1 text-center text-5xl font-light tracking-widest tabular-nums ${colorClass}`}
              >
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={() => handleAdjust(1)}
                className="h-10 w-10 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50"
                disabled={isRunning}
                aria-label="Increase minutes"
              >
                <Plus size={18} />
              </button>
            </div>
            <button
              onClick={handleStartPause}
              className="h-12 w-12 rounded-full text-white shadow-lg ring-2 ring-blue-300/30 bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105 shrink-0"
              aria-label={isRunning ? "Pause timer" : "Start timer"}
            >
              {isRunning ? (
                <Pause size={24} />
              ) : (
                <Play size={24} className="ml-0.5" />
              )}
            </button>
          </div>

          {/* Meta inputs */}
          <div className="mt-4 grid grid-cols-1 gap-3">
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => dispatch(setCurrentTitle(e.target.value))}
              placeholder="What are you working on?"
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300">
                <TagIcon size={16} />
              </div>
              <input
                type="text"
                value={currentTag || ""}
                onChange={(e) => dispatch(setTag(e.target.value))}
                placeholder="Tag (e.g. focus, code)"
                className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-semibold"
            >
              Reset
            </button>
            <button
              onClick={handleStartPause}
              className="h-12 w-12 rounded-full text-white shadow-lg ring-2 ring-blue-300/30 bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105"
              aria-label={isRunning ? "Pause timer" : "Start timer"}
            >
              {isRunning ? (
                <Pause size={24} />
              ) : (
                <Play size={24} className="ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default PomodoroQuickModal;
