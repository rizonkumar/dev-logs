import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, GitBranch, Github, Globe } from "lucide-react";

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
            <Briefcase size={14} className="mr-3 text紫-500 text-purple-500" />
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

export default ProfileCard;
