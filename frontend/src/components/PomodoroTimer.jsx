import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startTimer,
  pauseTimer,
  tick,
  setSessionType,
  resetTimer,
  setTag,
  logSession,
  fetchStats,
} from "../app/features/pomodoroSlice";
import { Play, Pause, RotateCcw, Brain, Coffee, Check } from "lucide-react";

// Custom hook for the interval (no changes needed here)
const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const PomodoroTimerPage = () => {
  const dispatch = useDispatch();
  const {
    timeRemaining,
    isRunning,
    sessionType,
    workMinutes,
    breakMinutes,
    currentTag,
    stats,
  } = useSelector((state) => state.pomodoro);
  const { todos } = useSelector((state) => state.todos);

  const [sessionStartTime, setSessionStartTime] = useState(null);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  useInterval(
    () => {
      if (timeRemaining > 0) {
        dispatch(tick());
      } else {
        dispatch(pauseTimer());
        dispatch(
          logSession({
            sessionType,
            tag: currentTag,
            duration: sessionType === "WORK" ? workMinutes : breakMinutes,
            startTime: sessionStartTime,
          })
        );
        new Audio("/notification.mp3").play();
        const nextSession = sessionType === "WORK" ? "BREAK" : "WORK";
        dispatch(setSessionType(nextSession));
      }
    },
    isRunning ? 1000 : null
  );

  const handleStartPause = () => {
    if (isRunning) {
      dispatch(pauseTimer());
    } else {
      setSessionStartTime(new Date().toISOString());
      dispatch(startTimer());
    }
  };

  const handleReset = () => {
    dispatch(resetTimer());
  };
  const handleSessionChange = (type) => {
    dispatch(setSessionType(type));
  };
  const handleTagChange = (tag) => {
    // If the same tag is clicked again, deselect it
    const newTag = currentTag === tag ? null : tag;
    dispatch(setTag(newTag));
  };

  const totalDuration =
    (sessionType === "WORK" ? workMinutes : breakMinutes) * 60;
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // FIX: Provide default tags so the feature is always usable
  const defaultTags = ["Learning", "Work", "Personal", "Bug Fix"];
  const uniqueTags = [
    ...new Set([...defaultTags, ...todos.flatMap((todo) => todo.tags)]),
  ];

  const timerColor = sessionType === "WORK" ? "violet" : "teal";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
      <div className="flex items-center bg-gray-800/50 rounded-lg p-1.5 mb-8">
        <button
          onClick={() => handleSessionChange("WORK")}
          className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            sessionType === "WORK"
              ? "bg-gray-900 shadow-md text-violet-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Brain size={16} /> Work
        </button>
        <button
          onClick={() => handleSessionChange("BREAK")}
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

      <div className="my-8 text-center">
        <h3 className="text-sm text-gray-400 mb-3">
          Tag this session (optional)
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              disabled={sessionType === "BREAK"}
              className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                currentTag === tag
                  ? "bg-violet-500/20 border-violet-400 text-white"
                  : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-500"
              }`}
            >
              {currentTag === tag && <Check size={16} />}
              {tag}
            </button>
          ))}
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
