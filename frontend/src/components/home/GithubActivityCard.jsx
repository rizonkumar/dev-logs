import React from "react";
import { Link } from "react-router-dom";
import { Github, AlertCircle } from "lucide-react";
import LogActivityChart from "../LogActivityChart";
import Loader from "../Loader";

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

export default GithubActivityCard;
