import React from "react";
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
} from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/logs", icon: BookOpen, label: "Log Entry" },
  { path: "/todos", icon: CheckSquare, label: "Todo" },
  { path: "/timer", icon: Timer, label: "Timer" },
  { path: "/profile", icon: User, label: "User Profile" },
];

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/auth");
  };

  return (
    <div className="flex h-screen bg-gray-950 bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950/50 font-sans text-gray-200">
      <aside className="w-64 flex-shrink-0 flex flex-col bg-black/30 border-r border-white/10 backdrop-blur-lg">
        <div className="p-4 h-20 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-violet-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg">
            {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "D"}
          </div>
          <h1 className="text-xl font-bold text-white">
            {userInfo?.name
              ? `${userInfo.name.split(" ")[0]}'s Board`
              : "Dev Dashboard"}
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          {navItems.map((item) => (
            <li key={item.path} className="list-none">
              <NavLink
                to={item.path}
                end={item.path === "/"}
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

        <div className="p-3 border-t border-white/10 space-y-2">
          {userInfo ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink
              to="/auth"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-violet-500/10 hover:text-violet-400 transition-colors"
            >
              <LogIn size={20} />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
