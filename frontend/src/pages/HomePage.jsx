import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs, createLog, fetchLogStats } from "../app/features/logsSlice";
import { fetchTodos } from "../app/features/todosSlice";
import { fetchGithubData } from "../app/features/githubSlice";
import {
  Briefcase,
  Hash,
  GitBranch,
  Github,
  Calendar,
  Activity,
  Star,
  Clock,
  TrendingUp,
  Plus,
  Send,
} from "lucide-react";
import LogActivityChart from "../components/LogActivityChart";
import TodoList from "../components/TodoList.jsx";
import Loader from "../components/Loader";

const transformDataForCalendar = (logs) => {
  if (!logs || logs.length === 0) return [];
  const counts = logs.reduce((acc, log) => {
    const date = new Date(log.date).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(counts).map((date) => {
    const count = counts[date];
    let level = 0;
    if (count > 0) level = 1;
    if (count > 2) level = 2;
    if (count > 4) level = 3;
    if (count > 6) level = 4;
    return { date, count, level };
  });
};

const cardBaseStyle =
  "bg-gray-800/60 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/20";

const ProfileCard = () => (
  <div className={`${cardBaseStyle} h-fit`}>
    <div className="flex items-center space-x-3 mb-3">
      <img
        src="https://i.pravatar.cc/80?u=a042581f4e29026704d"
        alt="Rizon Kumar Rahi"
        className="w-12 h-12 rounded-full border-2 border-fuchsia-400 object-cover"
      />
      <div>
        <h2 className="text-lg font-bold text-white">Rizon Kumar Rahi</h2>
        <p className="text-fuchsia-400 text-sm font-medium">
          Software Developer
        </p>
      </div>
    </div>
    <p className="text-gray-300 text-xs leading-relaxed mb-3">
      Code 💻. Coffee ☕. Curiosity 🔍. Repeat 🔁.
    </p>
    <div className="space-y-2 text-xs mb-4">
      <div className="flex items-center text-gray-300">
        <Briefcase size={12} className="mr-2 text-gray-400" />
        <span>Merkle Inspire</span>
      </div>
      <div className="flex items-center text-gray-300">
        <GitBranch size={12} className="mr-2 text-gray-400" />
        <span>8 Public Repositories</span>
      </div>
    </div>
    <Link
      to="/logs"
      className="block w-full text-center bg-fuchsia-500/80 hover:bg-fuchsia-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
    >
      View DevLogs
    </Link>
  </div>
);

const QuickStatsCard = ({ logs, githubData }) => {
  const totalLogs = logs?.length || 0;
  const totalCommits = githubData?.totalContributions || 0;
  const recentLogs = logs?.slice(0, 3) || [];

  return (
    <div className={`${cardBaseStyle} h-fit`}>
      <h3 className="text-sm font-bold text-white mb-3 flex items-center">
        <TrendingUp size={16} className="mr-2 text-purple-400" />
        Quick Stats
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-900/50 p-3 rounded-lg text-center">
          <Hash className="w-5 h-5 mx-auto mb-1 text-purple-400" />
          <p className="text-xl font-bold text-white">{totalLogs}</p>
          <p className="text-gray-400 text-xs">Dev Logs</p>
        </div>
        <div className="bg-gray-900/50 p-3 rounded-lg text-center">
          <Github className="w-5 h-5 mx-auto mb-1 text-green-400" />
          <p className="text-xl font-bold text-white">{totalCommits}</p>
          <p className="text-gray-400 text-xs">Commits</p>
        </div>
      </div>
      <div className="text-xs">
        <p className="text-gray-400 mb-2 font-medium">Recent Activity:</p>
        {recentLogs.length > 0 ? (
          <div className="space-y-1">
            {recentLogs.map((log, index) => (
              <div key={index} className="flex items-center text-gray-300">
                <Clock size={10} className="mr-2 text-gray-500" />
                <span className="truncate">{log.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent logs</p>
        )}
      </div>
    </div>
  );
};

const LogActivityCard = ({ logData }) => (
  <div className={`${cardBaseStyle}`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-white flex items-center">
        <Activity size={16} className="mr-2 text-purple-400" />
        Development Activity
      </h3>
      <span className="text-xs text-gray-400">
        {logData?.length || 0} logs this year
      </span>
    </div>
    <div className="h-32">
      <LogActivityChart data={logData} title="" compact={true} />
    </div>
  </div>
);

const GithubActivityCard = ({ githubData }) => (
  <div className={`${cardBaseStyle}`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-white flex items-center">
        <Github size={16} className="mr-2 text-green-400" />
        GitHub Contributions
      </h3>
      <span className="text-xs text-gray-400">
        {githubData?.totalContributions || 0} contributions
      </span>
    </div>
    <div className="h-32">
      <LogActivityChart
        data={githubData?.contributions || []}
        title=""
        compact={true}
        color="green"
      />
    </div>
  </div>
);

const DetailedStatsCard = ({ logs, githubData, logStats }) => {
  const thisWeekLogs =
    logs?.filter((log) => {
      const logDate = new Date(log.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    }).length || 0;

  const avgLogsPerWeek = logs?.length
    ? Math.round((logs.length / 52) * 10) / 10
    : 0;

  return (
    <div className={`${cardBaseStyle}`}>
      <h3 className="text-sm font-bold text-white mb-3 flex items-center">
        <Star size={16} className="mr-2 text-yellow-400" />
        Detailed Insights
      </h3>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-3">
          <div>
            <p className="text-gray-400">This Week</p>
            <p className="text-lg font-bold text-white">{thisWeekLogs}</p>
            <p className="text-gray-500">New logs</p>
          </div>
          <div>
            <p className="text-gray-400">Weekly Average</p>
            <p className="text-lg font-bold text-white">{avgLogsPerWeek}</p>
            <p className="text-gray-500">Logs per week</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-gray-400">GitHub Streak</p>
            <p className="text-lg font-bold text-white">
              {githubData?.longestStreak || 0}
            </p>
            <p className="text-gray-500">Days</p>
          </div>
          <div>
            <p className="text-gray-400">Most Active</p>
            <p className="text-lg font-bold text-white">
              {logStats?.mostActiveDay || "N/A"}
            </p>
            <p className="text-gray-500">Day of week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompactTodoCard = () => (
  <div className={`${cardBaseStyle}`}>
    <h3 className="text-sm font-bold text-white mb-3 flex items-center">
      <Calendar size={16} className="mr-2 text-blue-400" />
      Today's Tasks
    </h3>
    <div className="max-h-40 overflow-y-auto">
      <TodoList compact={true} />
    </div>
  </div>
);

const QuickAddLogCard = ({ onAddLog, isLoading }) => {
  const [newEntry, setNewEntry] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEntry.trim() === "") return;

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    onAddLog({
      entry: newEntry,
      date: todayString,
    });

    setNewEntry("");
    setIsExpanded(false);
  };

  return (
    <div className={`${cardBaseStyle}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white flex items-center">
          <Plus size={16} className="mr-2 text-emerald-400" />
          Quick Log Entry
        </h3>
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg p-2 transition-all duration-300"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {isExpanded ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="What did you accomplish today? Share your insights..."
            className="w-full bg-gray-900/70 p-3 rounded-lg border border-gray-600/50 
                      focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:outline-none 
                      transition-all duration-300 text-gray-300 placeholder-gray-500 resize-none
                      min-h-[80px] text-sm"
            autoFocus
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar size={12} />
              <span>Today</span>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setNewEntry("");
                }}
                className="px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 
                          hover:border-gray-500 rounded-lg transition-all duration-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newEntry.trim() || isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 
                          text-white font-semibold py-1.5 px-4 rounded-lg transition-all duration-300 
                          flex items-center space-x-1 text-xs shadow-lg shadow-emerald-500/25
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>Add Log</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">
            Quickly capture your development progress and insights for today.
          </p>
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full bg-gray-900/50 hover:bg-gray-800/50 text-gray-400 hover:text-white 
                      p-3 rounded-lg border border-gray-700/50 hover:border-emerald-500/50
                      transition-all duration-300 text-xs text-left"
          >
            What did you work on today?
          </button>
        </div>
      )}
    </div>
  );
};

function HomePage() {
  const dispatch = useDispatch();
  const {
    logs,
    status: logsStatus,
    stats: logStats,
    statsStatus,
  } = useSelector((state) => state.logs);
  const { status: todosStatus } = useSelector((state) => state.todos);
  const { data: githubData, status: githubStatus } = useSelector(
    (state) => state.github
  );

  useEffect(() => {
    if (logsStatus === "idle") dispatch(fetchLogs());
    if (todosStatus === "idle") dispatch(fetchTodos());
    if (githubStatus === "idle") dispatch(fetchGithubData());
    if (statsStatus === "idle") dispatch(fetchLogStats());
  }, [logsStatus, todosStatus, githubStatus, statsStatus, dispatch]);

  const handleAddLog = (logData) => {
    dispatch(createLog(logData));
  };

  const logCalendarData = transformDataForCalendar(logs);

  const isInitialLoading =
    logsStatus === "loading" && todosStatus === "loading";

  if (isInitialLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-3 sm:p-4 md:p-6 bg-gray-900 relative text-white">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-600 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <header className="mb-6 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold">Developer Dashboard</h1>
        <p className="text-gray-400 text-sm">
          👣 A quick peek into your coding journey 🚀💡
        </p>
      </header>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1: Profile & Quick Stats */}
        <div className="md:col-span-1">
          <ProfileCard />
        </div>
        <div className="md:col-span-1">
          <QuickStatsCard logs={logs} githubData={githubData} />
        </div>
        <div className="md:col-span-2">
          <DetailedStatsCard
            logs={logs}
            githubData={githubData}
            logStats={logStats}
          />
        </div>

        <div className="md:col-span-2">
          <LogActivityCard logData={logCalendarData} />
        </div>
        <div className="md:col-span-2">
          <GithubActivityCard githubData={githubData} />
        </div>

        <div className="md:col-span-2">
          <QuickAddLogCard
            onAddLog={handleAddLog}
            isLoading={logsStatus === "loading"}
          />
        </div>
        <div className="md:col-span-2">
          <CompactTodoCard />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
