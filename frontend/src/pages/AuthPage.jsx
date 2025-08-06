import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, register, reset } from "../app/features/authSlice";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogIn,
  UserPlus,
  AtSign,
  Lock,
  User,
  BookOpen,
  CheckSquare,
  GitBranch,
  Heart,
  Globe,
  Github,
  Mail,
  TwitterIcon,
} from "lucide-react";

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
      {icon}
    </div>
    <input
      className="w-full bg-stone-50 border border-stone-300 rounded-lg py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
    <div className="w-12 h-12 rounded-lg bg-stone-100 flex-shrink-0 flex items-center justify-center border border-stone-200">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </motion.div>
);

// --- New Footer Component ---

const Footer = () => {
  const socialLinks = [
    {
      href: "https://rizonkumarrahi.in",
      icon: <Globe size={20} />,
      color: "hover:text-blue-600",
    },
    {
      href: "https://github.com/rizonkumar",
      icon: <Github size={20} />,
      color: "hover:text-gray-800",
    },
    {
      href: "https://x.com/rizonkumar",
      icon: <TwitterIcon size={20} />,
      color: "hover:text-black",
    },
    {
      href: "mailto:rizon.kumar.rahi@gmail.com",
      icon: <Mail size={20} />,
      color: "hover:text-red-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="relative z-10 mt-12 text-center"
    >
      <div className="flex justify-center items-center gap-4 mb-3">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full bg-stone-200 text-gray-600 transition-colors ${link.color}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
      <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
        Made with{" "}
        <Heart size={16} className="text-red-500" fill="currentColor" /> in
        India, by
        <a
          href="https://rizonkumarrahi.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-700 hover:text-blue-600"
        >
          Rizon Kumar Rahi
        </a>
      </p>
    </motion.div>
  );
};

// --- Main AuthPage Component ---

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="w-full max-w-5xl lg:grid lg:grid-cols-2 rounded-2xl shadow-2xl bg-white border border-stone-200 overflow-hidden"
      >
        {/* Left Panel: Feature Showcase */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-stone-100/70 relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold text-xl">
                D
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dev Dashboard
              </h1>
            </div>
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1 }}
            >
              <motion.h2
                variants={formVariants}
                className="text-4xl font-bold text-gray-900 mb-4 leading-tight"
              >
                A Central Hub for Your Entire Workflow.
              </motion.h2>
              <motion.p variants={formVariants} className="text-gray-600 mb-10">
                From logging daily progress to managing complex projects, Dev
                Dashboard brings all your tools into one cohesive workspace.
              </motion.p>
              <div className="space-y-6">
                <FeatureCard
                  icon={<BookOpen className="text-blue-600" />}
                  title="Daily Journaling"
                  description="Chronicle your coding journey, track discoveries, and reflect on your growth."
                  delay={0.2}
                />
                <FeatureCard
                  icon={<CheckSquare className="text-purple-600" />}
                  title="Kanban Boards"
                  description="Visualize your workflow and manage tasks with intuitive drag-and-drop boards."
                  delay={0.3}
                />
                <FeatureCard
                  icon={<GitBranch className="text-green-600" />}
                  title="GitHub Insights"
                  description="Monitor your contribution activity and repository stats directly from your dashboard."
                  delay={0.4}
                />
              </div>
            </motion.div>
          </div>
          <Footer />
        </div>

        {/* Right Panel: Form */}
        <div className="w-full p-8 sm:p-12 flex flex-col justify-center bg-white">
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isLogin ? "Welcome Back" : "Get Started"}
                </h2>
                <p className="text-gray-500">
                  {isLogin
                    ? "Login to continue your journey."
                    : "Create an account to unlock your potential."}
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                {!isLogin && (
                  <InputField
                    icon={<User size={18} className="text-gray-400" />}
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
                  icon={<AtSign size={18} className="text-gray-400" />}
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Email"
                  onChange={onChange}
                  required
                />
                <InputField
                  icon={<Lock size={18} className="text-gray-400" />}
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
                  className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-black text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-sm disabled:bg-gray-400 disabled:cursor-wait"
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
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors group"
                >
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <span className="font-semibold text-gray-800 group-hover:text-blue-600">
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
