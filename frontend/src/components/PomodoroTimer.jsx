import React, { useEffect, useState } from "react";
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
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  Coffee,
  Tag as TagIcon,
} from "lucide-react";

const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

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

const PomodoroTimer = () => {
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

  const handleTagChange = (e) => {
    const tag = e.target.value === "none" ? null : e.target.value;
    dispatch(setTag(tag));
  };

  const totalDuration =
    (sessionType === "WORK" ? workMinutes : breakMinutes) * 60;
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const uniqueTags = [...new Set(todos.flatMap((todo) => todo.tags))];

  return (
    <div className="bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/20 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <Brain size={18} className="mr-2 text-fuchsia-400" />
        Focus Timer
      </h3>

      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Circular Timer */}
        <div className="relative w-52 h-52">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              strokeWidth="15"
              className="stroke-gray-700/50"
            />
            {/* Progress Circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              strokeWidth="15"
              className="stroke-fuchsia-400"
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: "stroke-dashoffset 0.5s linear",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl font-mono font-bold text-white tracking-widest">
              {formatTime(timeRemaining)}
            </p>
            <p className="text-sm font-semibold uppercase tracking-wider text-fuchsia-300 mt-2">
              {currentTag || sessionType}
            </p>
          </div>
        </div>

        {/* Tag Selector */}
        {sessionType === "WORK" && (
          <div className="mt-6 w-full max-w-xs relative">
            <TagIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              onChange={handleTagChange}
              value={currentTag || "none"}
              disabled={isRunning}
              className="w-full bg-gray-900/70 pl-9 pr-4 py-2 rounded-lg border border-gray-600/50 focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent focus:outline-none transition-all duration-300 text-gray-300 placeholder-gray-500 text-sm appearance-none"
            >
              <option value="none">Untagged Work</option>
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Session Type Tabs */}
      <div className="flex items-center justify-center bg-gray-900/50 rounded-xl p-1 w-fit mx-auto mb-6">
        <button
          onClick={() => handleSessionChange("WORK")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
            sessionType === "WORK"
              ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Brain size={16} />
          <span>Work</span>
        </button>
        <button
          onClick={() => handleSessionChange("BREAK")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
            sessionType === "BREAK"
              ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Coffee size={16} />
          <span>Break</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleStartPause}
          className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
        >
          {isRunning ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button
          onClick={handleReset}
          className="w-12 h-12 bg-gray-700/50 text-gray-400 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="text-center mt-4 text-xs text-gray-400">
        Today's completed sessions:{" "}
        <span className="font-bold text-white">{stats.sessionsToday}</span>
      </div>
    </div>
  );
};

export default PomodoroTimer;
