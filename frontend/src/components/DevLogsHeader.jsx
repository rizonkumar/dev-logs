import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  ScrollText,
  KanbanSquare,
  Wallet,
} from "lucide-react";

const DevLogsHeader = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      description: "Overview & Analytics",
    },
    {
      name: "Dev Logs",
      href: "/logs",
      icon: ScrollText,
      description: "Development Journal",
    },
    {
      name: "Dev Board",
      href: "/board",
      icon: KanbanSquare,
      description: "Project Management",
    },
    {
      name: "Finance",
      href: "/finance",
      icon: Wallet,
      description: "Financial Tracking",
    },
  ];

  const getNavigationStyles = (itemName, isActive) => {
    const baseStyles = {
      Dashboard: {
        active:
          "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25",
        inactive:
          "bg-white/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-200",
        icon: isActive ? "text-white" : "text-indigo-600 dark:text-indigo-300",
        border: "border-indigo-200/50 dark:border-indigo-800/50",
      },
      "Dev Logs": {
        active:
          "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25",
        inactive:
          "bg-white/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-200",
        icon: isActive ? "text-white" : "text-blue-600 dark:text-blue-300",
        border: "border-blue-200/50 dark:border-blue-800/50",
      },
      "Dev Board": {
        active:
          "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25",
        inactive:
          "bg-white/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:text-violet-700 dark:hover:text-violet-200",
        icon: isActive ? "text-white" : "text-violet-600 dark:text-violet-300",
        border: "border-violet-200/50 dark:border-violet-800/50",
      },
      Finance: {
        active:
          "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25",
        inactive:
          "bg-white/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-200",
        icon: isActive
          ? "text-white"
          : "text-emerald-600 dark:text-emerald-300",
        border: "border-emerald-200/50 dark:border-emerald-800/50",
      },
    };

    return baseStyles[itemName] || baseStyles["Dashboard"];
  };

  return (
    <div className="relative">
            {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        {/* Left Side - Profile */}
        <div className="flex items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative">
              <img
                src={
                  userInfo?.profileImage ||
                  `https://i.pravatar.cc/150?u=${userInfo?._id}`
                }
                alt={userInfo?.name || "Developer"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 sm:border-4 border-white/80 dark:border-stone-700/80 shadow-xl object-cover
                          group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 sm:border-3 border-white dark:border-stone-900 shadow-sm" />
            </div>
          </div>

          <div className="ml-3 sm:ml-4">
            <h2
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900
                          dark:from-stone-100 dark:via-stone-200 dark:to-stone-100 bg-clip-text text-transparent"
            >
              {userInfo?.name || "Developer"}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm font-medium">
              {userInfo?.title || "Software Developer | Building products"}
            </p>
            <div className="flex items-center mt-1 space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Active Developer
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Navigation */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-hidden">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const styles = getNavigationStyles(item.name, isActive);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative px-2 py-1.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-2xl border backdrop-blur-xl transition-all duration-300
                          hover:scale-105 flex-shrink-0 ${
                  isActive ? styles.active : styles.inactive
                }`}
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div
                    className={`p-1 sm:p-1.5 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 shadow-inner"
                        : "bg-stone-100/50 dark:bg-stone-700/50 group-hover:bg-white/30 dark:group-hover:bg-stone-600/50"
                    }`}
                  >
                    <Icon
                      className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-300 ${styles.icon}`}
                    />
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-semibold text-sm leading-tight whitespace-nowrap">
                      {item.name}
                    </div>
                  </div>
                  <div className="sm:hidden">
                    <div className="font-semibold text-xs leading-tight whitespace-nowrap">
                      {item.name === "Dev Logs" ? "Logs" :
                       item.name === "Dev Board" ? "Board" :
                       item.name === "Finance" ? "Fin" : item.name}
                    </div>
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-0.5 sm:w-6 sm:h-1 bg-white/60 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DevLogsHeader;
