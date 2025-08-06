import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../app/features/authSlice";
import {
  Home,
  BookOpen,
  CheckSquare,
  Timer,
  User,
  LogIn,
  LogOut,
  Notebook,
  PanelLeft,
} from "lucide-react";

// Add a color scheme for each nav item
const navItems = [
  { path: "/", icon: Home, label: "Home", color: "blue" },
  { path: "/logs", icon: BookOpen, label: "Log Entry", color: "purple" },
  { path: "/todos", icon: CheckSquare, label: "Todo", color: "green" },
  { path: "/notes", icon: Notebook, label: "Notes", color: "yellow" },
  { path: "/timer", icon: Timer, label: "Timer", color: "red" },
  { path: "/profile", icon: User, label: "User Profile", color: "indigo" },
];

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/auth");
  };

  const getActiveClasses = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600 border-blue-500";
      case "purple":
        return "bg-purple-50 text-purple-600 border-purple-500";
      case "green":
        return "bg-green-50 text-green-600 border-green-500";
      case "yellow":
        return "bg-yellow-50 text-yellow-600 border-yellow-500";
      case "red":
        return "bg-red-50 text-red-600 border-red-500";
      case "indigo":
        return "bg-indigo-50 text-indigo-600 border-indigo-500";
      default:
        return "bg-stone-100 text-gray-900 border-gray-500";
    }
  };

  const getHoverClasses = (color) => {
    switch (color) {
      case "blue":
        return "hover:bg-blue-50 hover:text-blue-600";
      case "purple":
        return "hover:bg-purple-50 hover:text-purple-600";
      case "green":
        return "hover:bg-green-50 hover:text-green-600";
      case "yellow":
        return "hover:bg-yellow-50 hover:text-yellow-600";
      case "red":
        return "hover:bg-red-50 hover:text-red-600";
      case "indigo":
        return "hover:bg-indigo-50 hover:text-indigo-600";
      default:
        return "hover:bg-stone-100 hover:text-gray-900";
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 flex flex-col bg-white border-r border-stone-200 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`p-4 h-20 flex items-center gap-3 border-b border-stone-200 ${
            !isSidebarOpen && "justify-center"
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
            {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "D"}
          </div>
          <h1
            className={`text-xl font-bold text-gray-900 overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {userInfo?.name
              ? `${userInfo.name.split(" ")[0]}'s Board`
              : "Dev Dashboard"}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2">
          {navItems.map((item) => (
            <li key={item.path} className="list-none">
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `relative flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                    !isSidebarOpen && "justify-center"
                  } ${
                    isActive
                      ? `${getActiveClasses(item.color)} font-semibold`
                      : `text-gray-500 ${getHoverClasses(item.color)}`
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div
                        className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-${item.color}-500`}
                      ></div>
                    )}
                    <item.icon size={20} className="flex-shrink-0" />
                    <span
                      className={`transition-opacity duration-200 whitespace-nowrap ${
                        isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-stone-200 space-y-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-stone-100 hover:text-gray-900 transition-colors ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <PanelLeft
              size={20}
              className={`transition-transform duration-300 flex-shrink-0 ${
                !isSidebarOpen ? "rotate-180" : ""
              }`}
            />
            <span
              className={`transition-opacity duration-200 whitespace-nowrap ${
                isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Collapse Menu
            </span>
          </button>

          {userInfo ? (
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span
                className={`transition-opacity duration-200 whitespace-nowrap ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                Logout
              </span>
            </button>
          ) : (
            <NavLink
              to="/auth"
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-stone-100 hover:text-gray-800 transition-colors ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <LogIn size={20} className="flex-shrink-0" />
              <span
                className={`transition-opacity duration-200 whitespace-nowrap ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                Login
              </span>
            </NavLink>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
