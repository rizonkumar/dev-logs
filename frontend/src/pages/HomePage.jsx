import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs } from "../app/features/logsSlice";
import { fetchTodos } from "../app/features/todosSlice";
import { Briefcase, BarChart2, Hash, GitBranch, Calendar } from "lucide-react";
import LogActivityChart from "../components/LogActivityChart";
import TodoList from "../components/TodoList.jsx";
import Loader from "../components/Loader";
import { format } from "date-fns";

// Helper function remains the same
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

// --- UI Sub-components for the Bento Grid ---

const cardBaseStyle =
  "bg-gray-800/50 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-lg";

const AboutMeCard = () => (
  <div className={`${cardBaseStyle} row-span-2 flex flex-col`}>
    <div className="flex-grow">
      <div className="flex items-center space-x-4">
        <img
          src="https://i.pravatar.cc/120?u=a042581f4e29026704d"
          alt="Rizon Kumar Rahi"
          className="w-16 h-16 rounded-full border-2 border-teal-400 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-white">Rizon Kumar Rahi</h2>
          <p className="text-teal-400 font-medium">Software Developer</p>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed mt-4 text-sm">
        A short bio. Passionate about building cool things with code, exploring
        new tech, and enjoying a good cup of coffee.
      </p>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center text-gray-300">
          <Briefcase size={14} className="mr-3 text-gray-400 flex-shrink-0" />
          <span>
            Working at{" "}
            <a href="#" className="font-semibold text-teal-300 hover:underline">
              Merkle Inspire
            </a>
          </span>
        </div>
        <div className="flex items-center text-gray-300">
          <GitBranch size={14} className="mr-3 text-gray-400 flex-shrink-0" />
          <span>8 Public Repositories</span>
        </div>
      </div>
    </div>
    <Link
      to="/logs"
      className="block mt-6 w-full text-center bg-teal-500/80 hover:bg-teal-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/20"
    >
      View DevLogs
    </Link>
  </div>
);

const StatsCard = ({ logs }) => {
  const totalLogs = logs?.length || 0;
  const activeDays = logs
    ? new Set(logs.map((log) => new Date(log.date).toISOString().split("T")[0]))
        .size
    : 0;

  return (
    <div className={`${cardBaseStyle}`}>
      <h3 className="text-md font-bold text-white mb-3">At a Glance</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-900/50 p-4 rounded-xl text-center">
          <Hash className="w-6 h-6 mx-auto mb-1 text-purple-400" />
          <p className="text-2xl font-bold text-white">{totalLogs}</p>
          <p className="text-gray-400 text-xs">Total Logs</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-xl text-center">
          <BarChart2 className="w-6 h-6 mx-auto mb-1 text-green-400" />
          <p className="text-2xl font-bold text-white">{activeDays}</p>
          <p className="text-gray-400 text-xs">Active Days</p>
        </div>
      </div>
    </div>
  );
};

const TodoListCard = () => (
  // The TodoList now has a defined height and internal scrolling
  <div className={`${cardBaseStyle} row-span-2`}>
    <TodoList />
  </div>
);

const ActivityChartCard = ({ calendarData }) => (
  // This card will now span 2 columns to fit the calendar better
  <div className={`${cardBaseStyle} col-span-1 md:col-span-2`}>
    <LogActivityChart data={calendarData} />
  </div>
);

const RecentLogsCard = ({ logs }) => (
  <div className={`${cardBaseStyle} col-span-1 md:col-span-2`}>
    <h3 className="text-md font-bold text-white mb-3">Recent Activity</h3>
    <div className="space-y-3">
      {logs?.slice(0, 3).map((log) => (
        <div
          key={log._id}
          className="text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0"
        >
          <p className="text-gray-400 mb-0.5 flex items-center text-xs">
            <Calendar size={12} className="mr-2" />
            {format(new Date(log.date), "MMMM dd, yyyy")}
          </p>
          <p className="text-gray-200 line-clamp-1 pl-5">{log.entry}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- Main HomePage Component ---

function HomePage() {
  const dispatch = useDispatch();
  const { logs, status: logsStatus } = useSelector((state) => state.logs);
  const { status: todosStatus } = useSelector((state) => state.todos);

  useEffect(() => {
    if (logsStatus === "idle") dispatch(fetchLogs());
    if (todosStatus === "idle") dispatch(fetchTodos());
  }, [logsStatus, todosStatus, dispatch]);

  const calendarData = transformDataForCalendar(logs);

  const isLoading =
    (logsStatus === "loading" || todosStatus === "loading") &&
    logsStatus !== "succeeded";

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 bg-gray-900 relative">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <header className="mb-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, here's your daily overview.
        </p>
      </header>

      {/* A more robust grid layout */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="md:col-span-1 space-y-6">
          <AboutMeCard />
        </div>

        {/* Column 2 */}
        <div className="md:col-span-1 space-y-6">
          <StatsCard logs={logs} />
          <ActivityChartCard calendarData={calendarData} />
        </div>

        {/* Column 3 */}
        <div className="md:col-span-1 space-y-6">
          <TodoListCard />
          <RecentLogsCard logs={logs} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
