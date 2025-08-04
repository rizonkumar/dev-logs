import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  CheckSquare,
  Timer,
  User,
  LogIn,
  LogOut,
} from "lucide-react";

// The navItems array is well-structured and easy to maintain.
const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/logs", icon: BookOpen, label: "Log Entry" },
  { path: "/todos", icon: CheckSquare, label: "Todo" },
  { path: "/timer", icon: Timer, label: "Timer" },
  { path: "/profile", icon: User, label: "User Profile" },
];

const MainLayout = ({ children }) => {
  return (
    // Establishes a single, consistent background for the entire app view.
    <div className="flex h-screen bg-gray-950 bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950/50 font-sans text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-black/30 border-r border-white/10 backdrop-blur-lg">
        {/* Logo/Brand */}
        <div className="p-4 h-20 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-violet-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg">
            R
          </div>
          <h1 className="text-xl font-bold text-white">Dev Dashboard</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2">
          {navItems.map((item) => (
            <li key={item.path} className="list-none">
              <NavLink
                to={item.path}
                end={item.path === "/"} // Ensures "Home" is only active on the exact path
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-violet-500/20 text-white font-semibold"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            disabled
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 cursor-not-allowed"
          >
            <LogIn size={20} />
            <span>Login</span>
          </button>
          <button
            disabled
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 cursor-not-allowed"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
