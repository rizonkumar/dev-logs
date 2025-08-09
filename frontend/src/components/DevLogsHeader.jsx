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
    },
    {
      name: "Dev Logs",
      href: "/logs",
      icon: ScrollText,
    },
    {
      name: "Dev Board",
      href: "/board",
      icon: KanbanSquare,
    },
    {
      name: "Finance",
      href: "/finance",
      icon: Wallet,
    },
  ];

  const colorStyles = {
    Dashboard: {
      active:
        "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200",
      hover:
        "hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-200",
      icon: "text-indigo-600 dark:text-indigo-300",
    },
    "Dev Logs": {
      active: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-200",
      hover:
        "hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-200",
      icon: "text-sky-600 dark:text-sky-300",
    },
    "Dev Board": {
      active:
        "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-200",
      hover:
        "hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-200",
      icon: "text-violet-600 dark:text-violet-300",
    },
    Finance: {
      active:
        "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200",
      hover:
        "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-200",
      icon: "text-emerald-600 dark:text-emerald-300",
    },
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center">
          <img
            src={
              userInfo?.profileImage ||
              `https://i.pravatar.cc/100?u=${userInfo?._id}`
            }
            alt={userInfo?.name || "User"}
            className="w-20 h-20 rounded-full border-4 border-white dark:border-stone-800 shadow-md object-cover"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {userInfo?.name || "Developer"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-stone-300">
              {userInfo?.title || "Software Developer | Building products"}
            </p>
          </div>
        </div>

        <nav>
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              const colors = colorStyles[item.name] || {};
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium ${
                      isActive
                        ? colors.active ||
                          "bg-stone-200 dark:bg-stone-800 text-gray-900 dark:text-white"
                        : `${
                            colors.hover ||
                            "hover:bg-stone-100 dark:hover:bg-stone-800"
                          } text-stone-600 dark:text-stone-300`
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${colors.icon || ""}`} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DevLogsHeader;
