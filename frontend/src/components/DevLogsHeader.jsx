import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ScrollText, KanbanSquare } from "lucide-react";

const DevLogsHeader = () => {
  const location = useLocation();

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
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center">
          <img
            src="https://i.pravatar.cc/100?u=a042581f4e29026704d"
            alt="Your Name"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Rizon Kumar Rahi
            </h1>
            <p className="text-sm text-gray-500">
              Software Developer<span className="text-blue-600"> | </span>
              Building products
            </p>
          </div>
        </div>

        <nav>
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium ${
                      isActive
                        ? "bg-stone-200 text-gray-900"
                        : "text-gray-500 hover:bg-stone-100 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
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
