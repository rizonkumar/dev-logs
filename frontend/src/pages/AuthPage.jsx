import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, register, reset } from "../app/features/authSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  UserPlus,
  AtSign,
  Lock,
  User,
  BookOpen,
  CheckSquare,
  GitBranch,
} from "lucide-react";

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 transition-colors duration-300 focus-within:text-violet-400">
      {icon}
    </div>
    <input
      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
      {...props}
    />
  </div>
);

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    className="flex items-start gap-4"
  >
    <div className="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0 flex items-center justify-center border border-white/10">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
    if (isSuccess || userInfo) {
      toast.success(`Welcome ${isLogin ? userInfo?.name || "" : name}!`);
      navigate("/");
    }
    dispatch(reset());
  }, [
    userInfo,
    isError,
    isSuccess,
    message,
    name,
    isLogin,
    navigate,
    dispatch,
  ]);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ email, password }));
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.98,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600 rounded-full filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute top-40 left-1/2 w-80 h-80 bg-teal-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full max-w-5xl lg:grid lg:grid-cols-2 rounded-2xl shadow-2xl shadow-violet-900/20 bg-black/30 border border-white/10 backdrop-blur-xl overflow-hidden"
      >
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-gray-900/20 to-violet-900/20 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-violet-500 to-pink-500 text-white flex items-center justify-center font-bold text-xl">
                R
              </div>
              <h1 className="text-2xl font-bold text-white">Dev Dashboard</h1>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                A Central Hub for Your Entire Workflow.
              </h2>
              <p className="text-gray-300 mb-10">
                From logging daily progress to managing complex projects, Dev
                Dashboard brings all your tools into one cohesive workspace.
              </p>
              <div className="space-y-6">
                <FeatureCard
                  icon={<BookOpen className="text-violet-400" />}
                  title="Daily Journaling"
                  description="Chronicle your coding journey, track discoveries, and reflect on your growth."
                  delay={0.4}
                />
                <FeatureCard
                  icon={<CheckSquare className="text-pink-400" />}
                  title="Kanban Boards"
                  description="Visualize your workflow and manage tasks with intuitive drag-and-drop boards."
                  delay={0.5}
                />
                <FeatureCard
                  icon={<GitBranch className="text-teal-400" />}
                  title="GitHub Insights"
                  description="Monitor your contribution activity and repository stats directly from your dashboard."
                  delay={0.6}
                />
              </div>
            </motion.div>
          </div>
          <div className="relative z-10 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Dev Dashboard. All rights
            reserved.
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full p-8 sm:p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-sm mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {isLogin ? "Welcome Back" : "Get Started"}
                </h2>
                <p className="text-gray-400">
                  {isLogin
                    ? "Login to continue your journey."
                    : "Create an account to unlock your potential."}
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                {!isLogin && (
                  <InputField
                    icon={<User size={18} />}
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    placeholder="Name"
                    onChange={onChange}
                    required
                  />
                )}
                <InputField
                  icon={<AtSign size={18} />}
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Email"
                  onChange={onChange}
                  required
                />
                <InputField
                  icon={<Lock size={18} />}
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={onChange}
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-60 disabled:cursor-wait disabled:scale-100"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : isLogin ? (
                    <>
                      <LogIn size={20} />
                      <span>Sign In</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-gray-400 hover:text-violet-400 transition-colors group"
                >
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <span className="font-semibold text-white group-hover:text-violet-300">
                    {" "}
                    {isLogin ? "Sign Up" : "Sign In"}
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
