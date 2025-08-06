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
  Notebook,
} from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/logs", icon: BookOpen, label: "Log Entry" },
  { path: "/todos", icon: CheckSquare, label: "Todo" },
  { path: "/notes", icon: Notebook, label: "Notes" },
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
    <div className="flex h-screen bg-stone-50 font-sans text-gray-800">
      {/* Sidebar with a clean, white background and light borders */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-stone-200">
        <div className="p-4 h-20 flex items-center gap-3 border-b border-stone-200">
          <div className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold text-lg">
            {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "D"}
          </div>
          <h1 className="text-xl font-bold text-gray-900">
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
                      ? "bg-stone-100 text-gray-900 font-semibold"
                      : "text-gray-500 hover:bg-stone-100 hover:text-gray-900"
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </nav>

        <div className="p-3 border-t border-stone-200 space-y-2">
          {userInfo ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink
              to="/auth"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-stone-100 hover:text-gray-800 transition-colors"
            >
              <LogIn size={20} />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
