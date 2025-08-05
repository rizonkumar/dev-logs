import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs, fetchLogStats } from "../app/features/logsSlice";
import { fetchGithubData } from "../app/features/githubSlice";
import {
  Briefcase,
  Hash,
  GitBranch,
  Github,
  Star,
  Clock,
  TrendingUp,
  ExternalLink,
  Globe,
  AlertCircle,
} from "lucide-react";
import LogActivityChart from "../components/LogActivityChart";
import Loader from "../components/Loader";

// --- DYNAMIC PROFILE CARD ---
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
    <div className="bg-gray-800/60 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/20 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={profileImage}
          alt={name}
          className="w-12 h-12 rounded-full border-2 border-fuchsia-400 object-cover"
        />
        <div>
          <h2 className="text-lg font-bold text-white">
            {name || "Your Name"}
          </h2>
          <p className="text-fuchsia-400 text-sm font-medium">
            {title || "Your Title"}
          </p>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-blue-500/10 rounded-lg border border-fuchsia-500/20">
        <p className="text-center text-sm text-gray-300 italic">
          "{bio || "Add your bio in the profile section!"}"
        </p>
      </div>

      <div className="space-y-2 text-xs mb-4">
        {company && (
          <div className="flex items-center text-gray-300">
            <Briefcase size={12} className="mr-2 text-gray-400" />
            <span>{company}</span>
          </div>
        )}
        <div className="flex items-center text-gray-300">
          <GitBranch size={12} className="mr-2 text-gray-400" />
          <span>{publicRepositories || 0} Public Repositories</span>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        {portfolioUrl ? (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 border border-blue-500/30 rounded-lg p-2 transition-all duration-300 flex items-center justify-center space-x-1 text-xs"
          >
            <Globe size={12} />
            <span>Portfolio</span>
            <ExternalLink size={10} />
          </a>
        ) : (
          <span className="flex-1 bg-gray-700/20 text-gray-500 border border-gray-700/30 rounded-lg p-2 text-center text-xs">
            No Portfolio
          </span>
        )}
        {githubUrl ? (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white border border-gray-600/50 rounded-lg p-2 transition-all duration-300 flex items-center justify-center space-x-1 text-xs"
          >
            <Github size={12} />
            <span>GitHub</span>
            <ExternalLink size={10} />
          </a>
        ) : (
          <span className="flex-1 bg-gray-700/20 text-gray-500 border border-gray-700/30 rounded-lg p-2 text-center text-xs">
            No GitHub
          </span>
        )}
      </div>

      <Link
        to="/profile"
        className="block w-full text-center bg-fuchsia-500/80 hover:bg-fuchsia-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm mt-auto"
      >
        Edit Profile
      </Link>
    </div>
  );
};

// --- DYNAMIC GITHUB CARD ---
const GithubActivityCard = ({ githubData, githubStatus, githubError }) => (
  <div className="bg-gray-800/60 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-lg">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-white flex items-center">
        <Github size={16} className="mr-2 text-green-400" />
        GitHub Contributions
      </h3>
      {githubStatus === "succeeded" && (
        <span className="text-xs text-gray-400">
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
        <div className="flex flex-col items-center justify-center h-full text-center text-sm text-yellow-400 bg-yellow-500/10 p-4 rounded-lg">
          <AlertCircle size={24} className="mb-2" />
          <p className="font-semibold">Could not fetch GitHub data.</p>
          <p className="text-xs text-yellow-300/80 mb-3">{githubError}</p>
          <Link
            to="/profile"
            className="text-xs font-bold text-white bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-1 rounded-md"
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
    <div className="bg-gray-800/60 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/20 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <TrendingUp size={18} className="mr-2 text-purple-400" />
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4 rounded-xl text-center border border-purple-500/20">
          <Hash className="w-6 h-6 mx-auto mb-2 text-purple-400" />
          <p className="text-2xl font-bold text-white mb-1">{totalLogs}</p>
          <p className="text-purple-300 text-xs font-medium">Dev Logs</p>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-4 rounded-xl text-center border border-green-500/20">
          <Github className="w-6 h-6 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-white mb-1">{totalCommits}</p>
          <p className="text-green-300 text-xs font-medium">Commits</p>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-white text-sm font-semibold flex items-center mb-3">
          <Clock size={14} className="mr-2 text-purple-400" />
          Recent Activity
        </p>
        {recentLogs.length > 0 ? (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log._id}
                className="p-3 bg-gray-900/40 rounded-lg border border-gray-700/30"
              >
                <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
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

// --- DETAILED STATS CARD ---
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
    <div className="bg-gray-800/60 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/20 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <Star size={18} className="mr-2 text-yellow-400" />
        Detailed Insights
      </h3>
      <div className="grid grid-cols-2 gap-4 text-xs mb-6">
        <div className="space-y-3">
          <div>
            <p className="text-gray-400">This Week</p>
            <p className="text-lg font-bold text-white">{thisWeekLogs}</p>
            <p className="text-gray-500">New logs</p>
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
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-blue-500/20 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-white">Productivity Score</p>
          <span className="text-sm font-bold text-blue-400">
            {productivityScore}%
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
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

  const enhancedUserInfo = {
    ...userInfo,
    publicRepositories: githubData?.publicRepositories,
  };

  return (
    <div className="p-6 relative text-white">
      <header className="mb-6 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold">Developer Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Welcome back, {userInfo?.name || "Developer"}!
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
          <ProfileCard userInfo={enhancedUserInfo} />
        </div>
        <div className="col-span-1">
          <QuickStatsCard logs={logs} githubData={githubData} />
        </div>
        <div className="col-span-1">
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
