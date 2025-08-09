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
  setBreakMinutes,
  fetchStats,
} from "../app/features/pomodoroSlice";
import {
  X,
  Play,
  Pause,
  Plus,
  Minus,
  Brain,
  Coffee,
  Tag as TagIcon,
  Music2,
} from "lucide-react";

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const PomodoroQuickModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const {
    timeRemaining,
    isRunning,
    sessionType,
    workMinutes,
    breakMinutes,
    currentTitle,
    currentTag,
    stats,
  } = useSelector((state) => state.pomodoro);

  useEffect(() => {
    if (isOpen) dispatch(fetchStats());
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  const isWork = sessionType === "WORK";
  const minutes = isWork ? workMinutes : breakMinutes;

  const handleStartPause = () => {
    if (isRunning) dispatch(pauseTimerThunk());
    else dispatch(startTimerThunk());
  };

  const handleAdjust = (delta) => {
    if (isRunning) return; // prevent changes mid-run
    const next = clamp(minutes + delta, 1, 180);
    if (isWork) dispatch(setWorkMinutes(next));
    else dispatch(setBreakMinutes(next));
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white/95 dark:bg-stone-950/95 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-300">
            <span className="font-semibold">Pomodoro</span>
            <span className="opacity-70">• Sessions today:</span>
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
          {/* Mode switch */}
          <div className="flex items-center bg-stone-100/80 dark:bg-stone-900 rounded-lg p-1.5 mb-4">
            <button
              onClick={() => dispatch(setSessionType("WORK"))}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isWork
                  ? "bg-white dark:bg-stone-950 shadow-xs text-blue-600"
                  : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
              }`}
              aria-pressed={isWork}
            >
              <Brain size={14} /> Work
            </button>
            <button
              onClick={() => dispatch(setSessionType("BREAK"))}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                !isWork
                  ? "bg-white dark:bg-stone-950 shadow-xs text-green-600"
                  : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
              }`}
              aria-pressed={!isWork}
            >
              <Coffee size={14} /> Break
            </button>
          </div>

          {/* Time control */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-3">
            <button
              onClick={() => handleAdjust(-1)}
              className="h-10 w-10 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50"
              disabled={isRunning}
              aria-label="Decrease minutes"
            >
              <Minus size={18} />
            </button>
            <div className="text-5xl font-light tracking-widest tabular-nums text-stone-900 dark:text-stone-100">
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

          {/* Meta inputs */}
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="relative">
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => dispatch(setCurrentTitle(e.target.value))}
                placeholder="What are you working on?"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300">
                <TagIcon size={16} />
              </div>
              <input
                type="text"
                value={currentTag || ""}
                onChange={(e) => dispatch(setTag(e.target.value))}
                placeholder="Tag (e.g. focus, code, break)"
                className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="h-9 px-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 inline-flex items-center gap-1"
                title="Pick music (coming soon)"
              >
                <Music2 size={16} />
                <span className="text-xs font-semibold">Pick music</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-semibold"
            >
              Reset
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartPause}
                className={`h-12 w-12 rounded-full text-white shadow-lg ring-2 transition-transform hover:scale-105 ${
                  isWork
                    ? "bg-blue-600 hover:bg-blue-700 ring-blue-300/30"
                    : "bg-green-600 hover:bg-green-700 ring-green-300/30"
                }`}
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
      </div>
    </div>
  );
};

export default PomodoroQuickModal;
