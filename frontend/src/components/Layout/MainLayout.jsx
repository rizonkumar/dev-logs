import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  CheckSquare,
  Timer,
  User,
  LogIn,
  LogOut,
} from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/logs", icon: BookOpen, label: "Log Entry" },
  { path: "/todos", icon: CheckSquare, label: "Todo" },
  { path: "/timer", icon: Timer, label: "Timer" },
  { path: "/profile", icon: User, label: "User Profile" },
];

const MainLayout = ({ children }) => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="h-full flex flex-col">
          {/* Logo/Brand */}
          <div className="p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">Dev Logs</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-purple-500/20 text-purple-400"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`
                    }
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            <button
              disabled
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/30 text-gray-500 cursor-not-allowed"
            >
              <LogIn size={18} />
              <span>Login</span>
            </button>
            <button
              disabled
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/30 text-gray-500 cursor-not-allowed"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
