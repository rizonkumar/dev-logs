import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, reset } from "../app/features/authSlice";
import { toast } from "react-toastify";
import {
  User,
  AtSign,
  Camera,
  Save,
  Loader2,
  Briefcase,
  Link as LinkIcon,
  Github,
  Info,
  Key,
  Share2,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    bio: "",
    company: "",
    portfolioUrl: "",
    githubUrl: "",
    githubUsername: "",
    githubToken: "",
    financeCurrency: "USD",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success("Profile updated successfully!");
    }
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        title: userInfo.title || "",
        bio: userInfo.bio || "",
        company: userInfo.company || "",
        portfolioUrl: userInfo.portfolioUrl || "",
        githubUrl: userInfo.githubUrl || "",
        githubUsername: userInfo.githubUsername || "",
        githubToken: userInfo.githubToken || "",
        financeCurrency: userInfo.financeCurrency || "USD",
      });
      setPreviewImage(userInfo.profileImage);
    }
  }, [userInfo]);

  const onChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB.");
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = new FormData();
    Object.keys(formData).forEach((key) => {
      userData.append(key, formData[key]);
    });
    if (profileImage) {
      userData.append("profileImage", profileImage);
    }
    dispatch(updateProfile(userData));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8 bg-stone-50 dark:bg-stone-950 min-h-full"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <User size={28} className="text-blue-600" /> User Profile
        </h1>
        <p className="text-gray-500 dark:text-stone-300 mt-1">
          Manage your account settings and profile information.
        </p>
      </header>

      <form onSubmit={onSubmit}>
        {/* Personal Information Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="relative group w-32 h-32 sm:w-40 sm:h-40 mb-4">
                <img
                  src={
                    previewImage ||
                    `https://i.pravatar.cc/150?u=${userInfo?._id}`
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-stone-200 dark:border-stone-700 group-hover:border-blue-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  <Camera size={32} className="text-white" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {userInfo?.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-stone-300">
                Click image to upload a new photo.
              </p>
            </div>
            <div className="md:col-span-2 space-y-6">
              <InputField
                icon={<User size={20} className="text-blue-500" />}
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={onChange}
              />
              <InputField
                icon={<AtSign size={20} className="text-blue-500" />}
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
              />
              <InputField
                icon={<Briefcase size={20} className="text-blue-500" />}
                label="Title / Role"
                name="title"
                value={formData.title}
                onChange={onChange}
                placeholder="e.g., Software Developer"
              />
              <InputField
                icon={<Info size={20} className="text-blue-500" />}
                label="Bio"
                name="bio"
                as="textarea"
                rows={3}
                value={formData.bio}
                onChange={onChange}
                placeholder="e.g., Building the future..."
              />
            </div>
          </div>
        </div>

        {/* Social & Links Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Share2 size={24} className="text-purple-600" />
            Social & Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={<Briefcase size={20} className="text-purple-500" />}
              label="Company"
              name="company"
              value={formData.company}
              onChange={onChange}
              placeholder="Your company name"
            />
            <InputField
              icon={<LinkIcon size={20} className="text-purple-500" />}
              label="Portfolio URL"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={onChange}
              placeholder="https://example.com"
            />
            <InputField
              icon={<Github size={20} className="text-purple-500" />}
              label="GitHub Profile URL"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={onChange}
              placeholder="https://github.com/username"
            />
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-stone-300 mb-2">
                Preferred Finance Currency
              </label>
              <div className="relative">
                <div className="absolute left-4 top-3.5">
                  <Wallet size={20} className="text-purple-500" />
                </div>
                <select
                  name="financeCurrency"
                  value={formData.financeCurrency}
                  onChange={onChange}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg py-3 pl-12 pr-4 text-gray-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[
                    "USD",
                    "EUR",
                    "GBP",
                    "INR",
                    "AUD",
                    "CAD",
                    "JPY",
                    "CHF",
                    "SEK",
                    "NZD",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Integration Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-sm p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Github size={24} className="text-green-600" />
            GitHub Integration
          </h3>
          <p className="text-sm text-gray-500 dark:text-stone-300 mb-6">
            Provide your GitHub username and a Personal Access Token (PAT) to
            display your contribution stats.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={<User size={20} className="text-green-500" />}
              label="GitHub Username"
              name="githubUsername"
              value={formData.githubUsername}
              onChange={onChange}
              placeholder="Your GitHub username"
            />
            <InputField
              icon={<Key size={20} className="text-green-500" />}
              label="GitHub Personal Access Token"
              name="githubToken"
              type="password"
              value={formData.githubToken}
              onChange={onChange}
              placeholder="Enter your PAT"
            />
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-sm disabled:bg-gray-400 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const InputField = ({ icon, label, name, as = "input", ...props }) => {
  const InputComponent = as;
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-600 dark:text-stone-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-3.5">{icon}</div>
        <InputComponent
          id={name}
          name={name}
          {...props}
          className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg py-3 pl-12 pr-4 text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
