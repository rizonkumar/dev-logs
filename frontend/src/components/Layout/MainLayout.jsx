import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  Menu,
} from "lucide-react";

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
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/auth");
  };

  const colorConfig = {
    blue: {
      active: "bg-blue-50 text-blue-600 border-blue-500",
      inactive: "text-blue-500",
      hover: "hover:bg-blue-50",
      textHover: "group-hover:text-blue-600",
      border: "bg-blue-500",
    },
    purple: {
      active: "bg-purple-50 text-purple-600 border-purple-500",
      inactive: "text-purple-500",
      hover: "hover:bg-purple-50",
      textHover: "group-hover:text-purple-600",
      border: "bg-purple-500",
    },
    green: {
      active: "bg-green-50 text-green-600 border-green-500",
      inactive: "text-green-500",
      hover: "hover:bg-green-50",
      textHover: "group-hover:text-green-600",
      border: "bg-green-500",
    },
    yellow: {
      active: "bg-yellow-50 text-yellow-600 border-yellow-500",
      inactive: "text-yellow-500",
      hover: "hover:bg-yellow-50",
      textHover: "group-hover:text-yellow-600",
      border: "bg-yellow-500",
    },
    red: {
      active: "bg-red-50 text-red-600 border-red-500",
      inactive: "text-red-500",
      hover: "hover:bg-red-50",
      textHover: "group-hover:text-red-600",
      border: "bg-red-500",
    },
    indigo: {
      active: "bg-indigo-50 text-indigo-600 border-indigo-500",
      inactive: "text-indigo-500",
      hover: "hover:bg-indigo-50",
      textHover: "group-hover:text-indigo-600",
      border: "bg-indigo-500",
    },
  };

  const SidebarContent = ({ isExpanded }) => (
    <>
      <div
        className={`p-4 h-20 flex items-center gap-3 border-b border-stone-200 ${
          !isExpanded && "justify-center"
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
          {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "R"}
        </div>
        <h1
          className={`text-xl font-bold text-gray-900 overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          {userInfo?.name
            ? `${userInfo.name.split(" ")[0]}'s Board`
            : "Rizon's Board"}
        </h1>
      </div>

      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => (
          <li key={item.path} className="list-none">
            <NavLink
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `relative flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 group ${
                  !isExpanded && "justify-center"
                } ${
                  isActive
                    ? colorConfig[item.color].active
                    : colorConfig[item.color].hover
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div
                      className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${
                        colorConfig[item.color].border
                      }`}
                    ></div>
                  )}
                  <item.icon
                    size={20}
                    className={`flex-shrink-0 ${
                      isActive ? "" : colorConfig[item.color].inactive
                    }`}
                  />
                  <span
                    className={`transition-opacity duration-200 whitespace-nowrap ${
                      isExpanded ? "opacity-100" : "opacity-0 hidden"
                    } ${
                      isActive
                        ? "font-semibold"
                        : `text-gray-700 font-medium ${
                            colorConfig[item.color].textHover
                          }`
                    }`}
                  >
                    {item.label}
                  </span>
                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 text-sm bg-gray-800 text-white rounded-md scale-0 group-hover:scale-100 transition-transform origin-left whitespace-nowrap z-20">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </nav>

      <div className="p-3 border-t border-stone-200 space-y-2">
        <button
          onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          className={`w-full hidden lg:flex items-center gap-4 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-stone-100 hover:text-gray-900 transition-colors ${
            !isExpanded && "justify-center"
          }`}
        >
          <PanelLeft
            size={20}
            className={`transition-transform duration-300 flex-shrink-0 ${
              !isExpanded ? "rotate-180" : ""
            }`}
          />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap ${
              isExpanded ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Collapse Menu
          </span>
        </button>

        {userInfo ? (
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors ${
              !isExpanded && "justify-center"
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span
              className={`transition-opacity duration-200 whitespace-nowrap ${
                isExpanded ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Logout
            </span>
          </button>
        ) : (
          <NavLink
            to="/auth"
            className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-stone-100 hover:text-gray-800 transition-colors ${
              !isExpanded && "justify-center"
            }`}
          >
            <LogIn size={20} className="flex-shrink-0" />
            <span
              className={`transition-opacity duration-200 whitespace-nowrap ${
                isExpanded ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Login
            </span>
          </NavLink>
        )}
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden lg:flex bg-stone-50 font-sans text-gray-800">
      {/* Mobile-only overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-stone-200 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent isExpanded={true} />
      </aside>

      <aside
        className={`hidden lg:flex flex-shrink-0 flex-col bg-white border-r border-stone-200 transition-all duration-300 ease-in-out ${
          isDesktopSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <SidebarContent isExpanded={isDesktopSidebarOpen} />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-sm border-b border-stone-200 p-4 flex items-center gap-4 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold text-base flex-shrink-0">
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "D"}
            </div>
            <h1 className="text-lg font-bold text-gray-900">
              {userInfo?.name
                ? `${userInfo.name.split(" ")[0]}'s Board`
                : "Rizon's Board"}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
