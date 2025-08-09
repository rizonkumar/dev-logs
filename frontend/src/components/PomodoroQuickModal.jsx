import React, { useEffect, useState } from "react";
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
import {
  X,
  Play,
  Pause,
  Plus,
  Minus,
  RotateCcw,
  Tag as TagIcon,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const PomodoroQuickModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  // Keep all hooks unconditionally called on every render to avoid hook order issues
  const [isDragging, setIsDragging] = useState(false);
  const {
    timeRemaining,
    isRunning,
    sessionType,
    workMinutes,
    currentTitle,
    currentTag,
    stats,
  } = useSelector((state) => state.pomodoro);

  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [editMinutesValue, setEditMinutesValue] = useState(String(workMinutes));

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchStats());
    }
  }, [dispatch, isOpen]);

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
    if (isRunning) return;
    const next = clamp(minutes + delta, 1, 180);
    dispatch(setWorkMinutes(next));
  };

  const beginEditMinutes = () => {
    if (isRunning) return;
    setEditMinutesValue(String(workMinutes));
    setIsEditingMinutes(true);
  };

  const commitEditMinutes = () => {
    const parsed = parseInt(editMinutesValue, 10);
    if (!isNaN(parsed)) {
      const next = clamp(parsed, 1, 180);
      dispatch(setWorkMinutes(next));
    }
    setIsEditingMinutes(false);
  };

  const handleReset = () => {
    dispatch(pauseTimerThunk());
    dispatch(setSessionType("WORK"));
    dispatch(resetTimer());
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

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

  if (!isOpen) return null;

  return (
    <Motion.div
      className="fixed bottom-6 right-6 z-50 cursor-grab"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      drag
      dragMomentum={false}
      dragElastic={0.05}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
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
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300 cursor-pointer"
            aria-label="Close timer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-2">
              <button
                onClick={() => handleAdjust(-1)}
                className="h-10 w-10 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                disabled={isRunning}
                aria-label="Decrease minutes"
              >
                <Minus size={18} />
              </button>
              <div className="flex-1">
                {isEditingMinutes ? (
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={editMinutesValue}
                    onChange={(e) => setEditMinutesValue(e.target.value)}
                    onBlur={commitEditMinutes}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEditMinutes();
                      if (e.key === "Escape") setIsEditingMinutes(false);
                    }}
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    className="w-full text-center text-5xl font-light tracking-widest tabular-nums bg-white dark:bg-stone-950 focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded-md px-1"
                    aria-label="Work minutes"
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    onClick={beginEditMinutes}
                    className={`w-full text-center text-5xl font-light tracking-widest tabular-nums ${colorClass} bg-transparent cursor-text`}
                    aria-label="Edit work minutes"
                  >
                    {formatTime(timeRemaining)}
                  </button>
                )}
              </div>
              <button
                onClick={() => handleAdjust(1)}
                className="h-10 w-10 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                disabled={isRunning}
                aria-label="Increase minutes"
              >
                <Plus size={18} />
              </button>
            </div>
            <button
              onClick={handleStartPause}
              className="h-10 w-10 rounded-full text-white shadow-lg ring-2 ring-blue-300/30 bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105 shrink-0 flex items-center justify-center cursor-pointer"
              aria-label={isRunning ? "Pause timer" : "Start timer"}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={handleReset}
              className="h-10 w-10 rounded-full bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 shrink-0 flex items-center justify-center cursor-pointer"
              aria-label="Reset timer"
              title="Reset timer"
            >
              <RotateCcw size={18} />
            </button>
          </div>

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
        </div>
      </div>
    </Motion.div>
  );
};

export default PomodoroQuickModal;
