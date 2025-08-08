import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs, fetchLogStats } from "../app/features/logsSlice";
import { fetchGithubData } from "../app/features/githubSlice";
import { getUserProfile } from "../app/features/authSlice";
import {
  Briefcase,
  GitBranch,
  Github,
  Star,
  Clock,
  TrendingUp,
  Globe,
  AlertCircle,
  BookOpen,
  Sparkles,
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
    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={profileImage || `https://i.pravatar.cc/150?u=${userInfo?._id}`}
          alt={name || "User"}
          className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover"
        />
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {name || "Your Name"}
          </h2>
          <p className="text-blue-600 text-sm font-medium">
            {title || "Your Title"}
          </p>
        </div>
      </div>

      <div className="mb-4 p-3 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
        <p className="text-center text-sm text-gray-700 dark:text-stone-300 italic">
          "{bio || "Add your bio in the profile section!"}"
        </p>
      </div>

      <div className="space-y-2 text-sm mb-4">
        {company && (
          <div className="flex items-center text-gray-600 dark:text-stone-300">
            <Briefcase size={14} className="mr-3 text-purple-500" />
            <span>{company}</span>
          </div>
        )}
        <div className="flex items-center text-gray-600 dark:text-stone-300">
          <GitBranch size={14} className="mr-3 text-green-500" />
          <span>{publicRepositories || 0} Public Repositories</span>
        </div>
      </div>

      <div className="flex space-x-2 mt-auto">
        {portfolioUrl && (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white hover:bg-stone-100 text-gray-700 border border-stone-300 rounded-lg p-2 transition-all duration-300 flex items-center justify-center space-x-2 text-xs font-semibold"
          >
            <Globe size={14} />
            <span>Portfolio</span>
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-800 hover:bg-black text-white rounded-lg p-2 transition-all duration-300 flex items-center justify-center space-x-2 text-xs font-semibold"
          >
            <Github size={14} />
            <span>GitHub</span>
          </a>
        )}
      </div>
      <Link
        to="/profile"
        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm mt-3"
      >
        Edit Profile
      </Link>
    </div>
  );
};

const GithubActivityCard = ({ githubData, githubStatus, githubError }) => (
  <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
        <Github size={18} className="mr-2 text-green-600" />
        GitHub Contributions
      </h3>
      {githubStatus === "succeeded" && (
        <span className="text-sm text-gray-500 dark:text-stone-300">
          {githubData?.totalContributions || 0} contributions
        </span>
      )}
    </div>
    <div className="h-60">
      {githubStatus === "loading" && <Loader />}
      {githubStatus === "failed" && (
        <div className="flex flex-col items-center justify-center h-full text-center text-sm text-yellow-800 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
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
    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <TrendingUp size={18} className="mr-2 text-blue-600" />
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl text-center border border-blue-200 dark:border-blue-900/40">
          <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {totalLogs}
          </p>
          <p className="text-blue-700 dark:text-blue-300 text-xs font-medium">
            Dev Logs
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl text-center border border-green-200 dark:border-green-900/40">
          <Github className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {totalCommits}
          </p>
          <p className="text-green-700 dark:text-green-300 text-xs font-medium">
            Commits
          </p>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-gray-800 dark:text-white text-sm font-semibold flex items-center mb-3">
          <Clock size={14} className="mr-2 text-gray-500 dark:text-stone-400" />
          Recent Activity
        </p>
        {recentLogs.length > 0 ? (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log._id}
                className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700"
              >
                <p className="text-gray-700 dark:text-stone-300 text-xs leading-relaxed line-clamp-2">
                  {log.entry}
                </p>
                <p className="text-gray-500 dark:text-stone-400 text-xs mt-1">
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

const DetailedStatsCard = ({ logs, logStats, githubData }) => {
  const thisWeekLogs =
    logs?.filter(
      (log) =>
        new Date(log.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0;

  const currentStreak = logStats?.currentStreak || 0;

  const productivityScore = Math.min(
    100,
    Math.round((thisWeekLogs / 7) * 50 + currentStreak * 5)
  );

  return (
    <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <Sparkles size={18} className="mr-2 text-purple-600" />
        Detailed Insights
      </h3>

      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-200 dark:border-purple-900/40 text-center">
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
              This Week
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {thisWeekLogs}
            </p>
            <p className="text-xs text-gray-500 dark:text-stone-300">logs</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-xl border border-orange-200 dark:border-orange-900/40 text-center">
            <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">
              Log Streak
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentStreak}
            </p>
            <p className="text-xs text-gray-500 dark:text-stone-300">days</p>
          </div>
        </div>

        <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              Productivity Score
            </p>
            <span className={`text-sm font-bold text-blue-600`}>
              {productivityScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-stone-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${productivityScore}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-500 flex-shrink-0 flex items-center justify-center">
            <Star size={20} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {githubData?.totalStars || 0}
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              GitHub Stars
            </p>
          </div>
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 relative text-gray-900 dark:text-stone-100 bg-stone-50 dark:bg-stone-950 min-h-full">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold">
            Developer Dashboard
          </h1>
          <p className="text-gray-500 dark:text-stone-300 text-sm">
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
              logStats={logStats}
              githubData={githubData}
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
    </div>
  );
}

export default HomePage;
