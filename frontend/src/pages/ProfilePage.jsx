import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, reset } from "../app/features/authSlice";

import { toast } from "react-toastify";
import { User, AtSign, Camera, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
  });
  const { name, email } = formData;

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    userInfo?.profileImage || ""
  );

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message !== "") {
      // Check message to avoid firing on initial load
      toast.success("Profile updated successfully!");
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  // Update form if userInfo changes (e.g., after a successful update)
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name,
        email: userInfo.email,
      });
      setPreviewImage(userInfo.profileImage);
    }
  }, [userInfo]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation for file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size should not exceed 5MB.");
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email };
    if (profileImage) {
      userData.profileImage = profileImage;
    }
    dispatch(updateProfile(userData));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <User size={28} /> User Profile
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your account settings and profile information.
        </p>
      </header>

      <div className="bg-black/30 border border-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:col-span-1 flex flex-col items-center text-center"
          >
            <div className="relative group w-32 h-32 sm:w-40 sm:h-40 mb-4">
              <img
                src={previewImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-gray-700 group-hover:border-violet-500 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
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
            <h2 className="text-xl font-bold text-white">{userInfo?.name}</h2>
            <p className="text-sm text-gray-400">
              Click image to upload a new photo.
            </p>
          </motion.div>

          {/* User Details Section */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <AtSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-60 disabled:cursor-wait disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
