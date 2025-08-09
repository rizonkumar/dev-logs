import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  BookOpen,
  CheckSquare,
  GitBranch,
  Heart,
  Globe,
  Github,
  Mail,
  TwitterIcon,
  Moon,
  Sun,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";

// removed old email/password inputs

const FeatureCard = ({ icon, title, description, delay }) => (
  <Motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    className="flex items-start gap-4"
  >
    <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-900 flex-shrink-0 flex items-center justify-center border border-stone-200 dark:border-stone-700">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-stone-300">{description}</p>
    </div>
  </Motion.div>
);

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
    <Motion.div
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
    </Motion.div>
  );
};

// --- Main AuthPage Component ---

const AuthPage = () => {
  // Clerk-only auth page
  const [isLogin, setIsLogin] = useState(true);

  // Theme toggle for unauthenticated page
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      console.error("Error setting theme");
    }
    window.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { theme: next ? "dark" : "light" },
      })
    );
  };

  const navigate = useNavigate();

  useEffect(() => {
    // If already signed in via Clerk, redirect away from auth page
    try {
      const clerkState = window?.Clerk?.user;
      if (clerkState) navigate("/", { replace: true });
    } catch {}
  }, [navigate]);

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
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-4">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-full max-w-5xl lg:grid lg:grid-cols-2 rounded-2xl shadow-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 overflow-hidden"
      >
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="absolute top-3 right-3 p-2 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-gray-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="hidden lg:flex flex-col justify-between p-12 bg-stone-100/70 dark:bg-stone-800/40 relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold text-xl">
                D
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dev Dashboard
              </h1>
            </div>
            <Motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1 }}
            >
              <Motion.h2
                variants={formVariants}
                className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
              >
                A Central Hub for Your Entire Workflow.
              </Motion.h2>
              <Motion.p
                variants={formVariants}
                className="text-gray-600 dark:text-stone-300 mb-10"
              >
                From logging daily progress to managing complex projects, Dev
                Dashboard brings all your tools into one cohesive workspace.
              </Motion.p>
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
            </Motion.div>
          </div>
          <Footer />
        </div>

        {/* Right Panel: Clerk Auth */}
        <div className="w-full p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-stone-900">
          <AnimatePresence mode="wait">
            <Motion.div
              key={isLogin ? "clerk-signin" : "clerk-signup"}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-sm mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isLogin ? "Welcome Back" : "Get Started"}
                </h2>
                <p className="text-gray-500 dark:text-stone-300">
                  {isLogin
                    ? "Login to continue your journey."
                    : "Create an account to unlock your potential."}
                </p>
              </div>

              <SignedOut>
                <div className="space-y-6">
                  {isLogin ? (
                    <SignIn routing="virtual" afterSignInUrl="/" />
                  ) : (
                    <SignUp routing="virtual" afterSignUpUrl="/" />
                  )}
                  <div className="text-center">
                    <button
                      onClick={() => setIsLogin((v) => !v)}
                      className="text-sm text-gray-500 dark:text-stone-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {isLogin ? (
                        <>
                          Don't have an account?{" "}
                          <span className="font-semibold">Sign Up</span>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <span className="font-semibold">Sign In</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <button
                    onClick={() => navigate("/", { replace: true })}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Continue to dashboard
                  </button>
                </div>
              </SignedIn>

              {/* Social links footer remains on the left section */}
            </Motion.div>
          </AnimatePresence>
        </div>
      </Motion.div>
    </div>
  );
};

export default AuthPage;
