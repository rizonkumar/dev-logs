import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs, fetchLogStats } from "../app/features/logsSlice";
import { fetchGithubData } from "../app/features/githubSlice";
import { getUserProfile } from "../app/features/authSlice";
import {
  Briefcase,
  Hash,
  GitBranch,
  Github,
  Star,
  Clock,
  TrendingUp,
  Globe,
  AlertCircle,
} from "lucide-react";
import LogActivityChart from "../components/LogActivityChart";
import Loader from "../components/Loader";

const ProfileCard = ({ userInfo }) => {
  const {
    name,
    title,
    bio,
    company,
    publicRepositories,
    portfolioUrl,
    githubUrl,
    profileImage,
  } = userInfo || {};

  return (
    <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={profileImage}
          alt={name}
          className="w-12 h-12 rounded-full border-2 border-gray-800 object-cover"
        />
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {name || "Your Name"}
          </h2>
          <p className="text-gray-600 text-sm font-medium">
            {title || "Your Title"}
          </p>
        </div>
      </div>

      <div className="mb-4 p-3 bg-stone-100 rounded-lg border border-stone-200">
        <p className="text-center text-sm text-gray-700 italic">
          "{bio || "Add your bio in the profile section!"}"
        </p>
      </div>

      <div className="space-y-2 text-xs mb-4">
        {company && (
          <div className="flex items-center text-gray-600">
            <Briefcase size={12} className="mr-2 text-gray-500" />
            <span>{company}</span>
          </div>
        )}
        <div className="flex items-center text-gray-600">
          <GitBranch size={12} className="mr-2 text-gray-500" />
          <span>{publicRepositories || 0} Public Repositories</span>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        {portfolioUrl ? (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white hover:bg-stone-100 text-gray-700 border border-stone-300 rounded-lg p-2 transition-all duration-300 flex items-center justify-center space-x-1 text-xs font-semibold"
          >
            <Globe size={12} />
            <span>Portfolio</span>
          </a>
        ) : (
          <span className="flex-1 bg-stone-100 text-gray-400 border border-stone-200 rounded-lg p-2 text-center text-xs">
            No Portfolio
          </span>
        )}
        {githubUrl ? (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white rounded-lg p-2 transition-all duration-300 flex items-center justify-center space-x-1 text-xs font-semibold"
          >
            <Github size={12} />
            <span>GitHub</span>
          </a>
        ) : (
          <span className="flex-1 bg-stone-100 text-gray-400 border border-stone-200 rounded-lg p-2 text-center text-xs">
            No GitHub
          </span>
        )}
      </div>

      <Link
        to="/profile"
        className="block w-full text-center bg-gray-800 hover:bg-black text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm mt-auto"
      >
        Edit Profile
      </Link>
    </div>
  );
};

const GithubActivityCard = ({ githubData, githubStatus, githubError }) => (
  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-gray-900 flex items-center">
        <Github size={16} className="mr-2 text-green-600" />
        GitHub Contributions
      </h3>
      {githubStatus === "succeeded" && (
        <span className="text-xs text-gray-500">
          {githubData?.totalContributions || 0} contributions
        </span>
      )}
    </div>
    <div className="h-32">
      {githubStatus === "loading" && (
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      )}
      {githubStatus === "failed" && (
        <div className="flex flex-col items-center justify-center h-full text-center text-sm text-yellow-800 bg-yellow-50 p-4 rounded-lg">
          <AlertCircle size={24} className="mb-2" />
          <p className="font-semibold">Could not fetch GitHub data.</p>
          <p className="text-xs text-yellow-700 mb-3">{githubError}</p>
          <Link
            to="/profile"
            className="text-xs font-bold text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md"
          >
            Add Credentials
          </Link>
        </div>
      )}
      {githubStatus === "succeeded" && (
        <LogActivityChart
          data={githubData?.contributions || []}
          color="green"
        />
      )}
    </div>
  </div>
);

const QuickStatsCard = ({ logs, githubData }) => {
  const totalLogs = logs?.length || 0;
  const totalCommits = githubData?.totalContributions || 0;
  const recentLogs = logs?.slice(0, 3) || [];

  return (
    <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <TrendingUp size={18} className="mr-2 text-blue-600" />
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-stone-100 p-4 rounded-xl text-center border border-stone-200">
          <Hash className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 mb-1">{totalLogs}</p>
          <p className="text-blue-700 text-xs font-medium">Dev Logs</p>
        </div>
        <div className="bg-stone-100 p-4 rounded-xl text-center border border-stone-200">
          <Github className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {totalCommits}
          </p>
          <p className="text-green-700 text-xs font-medium">Commits</p>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-gray-800 text-sm font-semibold flex items-center mb-3">
          <Clock size={14} className="mr-2 text-blue-600" />
          Recent Activity
        </p>
        {recentLogs.length > 0 ? (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log._id}
                className="p-3 bg-stone-100 rounded-lg border border-stone-200"
              >
                <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">
                  {log.entry}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(log.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 flex-1 flex flex-col justify-center items-center h-full">
            <p className="text-gray-500 text-sm">No recent logs</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailedStatsCard = ({ logs, githubData, logStats }) => {
  const thisWeekLogs =
    logs?.filter(
      (log) =>
        new Date(log.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0;
  const currentStreak = logStats?.currentStreak || 0;
  const productivityScore = Math.min(
    100,
    Math.round((thisWeekLogs / 7) * 100 + currentStreak * 5)
  );

  return (
    <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Star size={18} className="mr-2 text-amber-500" />
        Detailed Insights
      </h3>
      <div className="grid grid-cols-2 gap-4 text-xs mb-6">
        <div className="space-y-3">
          <div>
            <p className="text-gray-500">This Week</p>
            <p className="text-lg font-bold text-gray-900">{thisWeekLogs}</p>
            <p className="text-gray-600">New logs</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-gray-500">GitHub Streak</p>
            <p className="text-lg font-bold text-gray-900">
              {githubData?.longestStreak || 0}
            </p>
            <p className="text-gray-600">Days</p>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">
            Productivity Score
          </p>
          <span className="text-sm font-bold text-blue-600">
            {productivityScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${productivityScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

function HomePage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    logs,
    status: logsStatus,
    stats: logStats,
    statsStatus,
  } = useSelector((state) => state.logs);
  const {
    data: githubData,
    status: githubStatus,
    error: githubError,
  } = useSelector((state) => state.github);

  useEffect(() => {
    if (logsStatus === "idle") dispatch(fetchLogs());
    if (githubStatus === "idle") dispatch(fetchGithubData());
    if (statsStatus === "idle") dispatch(fetchLogStats());
  }, [logsStatus, githubStatus, statsStatus, dispatch]);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const enhancedUserInfo = {
    ...userInfo,
    publicRepositories: githubData?.publicRepositories,
  };

  return (
    <div className="p-6 relative text-gray-900">
      <header className="mb-6 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold">Developer Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back, {userInfo?.name || "Developer"}!
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <ProfileCard userInfo={enhancedUserInfo} />
        </div>
        <div className="lg:col-span-1">
          <QuickStatsCard logs={logs} githubData={githubData} />
        </div>
        <div className="lg:col-span-1">
          <DetailedStatsCard
            logs={logs}
            githubData={githubData}
            logStats={logStats}
          />
        </div>
      </div>

      <div className="w-full">
        <GithubActivityCard
          githubData={githubData}
          githubStatus={githubStatus}
          githubError={githubError}
        />
      </div>
    </div>
  );
}

export default HomePage;
