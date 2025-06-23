import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import LogActivityChart from "../components/LogActivityChart";
import RecentLogs from "../components/RecentLogs";
import LogStats from "../components/LogStats";

const transformDataForCalendar = (logs) => {
  const counts = logs.reduce((acc, log) => {
    const date = log.date;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(counts).map((date) => {
    const count = counts[date];
    let level = 0;
    if (count > 0) level = 1;
    if (count > 2) level = 2;
    if (count > 4) level = 3;
    if (count > 6) level = 4;

    return {
      date: date,
      count: count,
      level: level,
    };
  });
};

function HomePage() {
  const [logs] = useState([
    {
      date: "2025-06-23",
      entry:
        "Replaced the static Tech Stack component with a more dynamic and scalable Log Stats widget. This new component calculates data directly from logs.",
    },
    {
      date: "2025-06-22",
      entry:
        "Refactored the homepage layout to be more modular, using a two-row grid system to better organize dashboard components.",
    },
    {
      date: "2025-06-21",
      entry:
        "Fixed a critical React Router bug caused by importing Link from the wrong package. A good lesson in debugging dependencies.",
    },
    {
      date: "2025-06-20",
      entry:
        "Planned new features for the homepage dashboard and decided to add more dynamic, data-driven components to fill whitespace.",
    },
    {
      date: "2025-05-15",
      entry:
        "Fixed a minor bug related to styling on mobile viewports, ensuring better responsiveness.",
    },
    {
      date: "2025-04-01",
      entry:
        "Initial project setup and configuration of Tailwind CSS with a custom Poppins font.",
    },
  ]);

  const calendarData = transformDataForCalendar(logs);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        <aside className="lg:col-span-1 xl:col-span-1 h-fit sticky top-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700/60">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://i.pravatar.cc/120?u=a042581f4e29026704d"
                alt="Your Name"
                className="w-24 h-24 rounded-full border-2 border-teal-400 object-cover mb-4"
              />
              <h1 className="text-2xl font-bold text-white">
                Rizon Kumar Rahi
              </h1>
              <p className="text-teal-400 font-medium">Software Developer</p>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center">
                <Briefcase
                  size={16}
                  className="mr-3 text-gray-400 flex-shrink-0"
                />
                <span>
                  Working at{" "}
                  <a
                    href="#"
                    className="font-semibold text-teal-400 hover:underline"
                  >
                    Merkle Inspire
                  </a>
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                A short bio. Passionate about building cool things with code.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-center">
              <Link
                to="/logs"
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-8 rounded-lg transition-colors duration-300"
              >
                View DevLogs
              </Link>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3 xl:col-span-4">
          <LogActivityChart data={calendarData} />
        </main>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentLogs logs={logs} />
        <LogStats logs={logs} />
      </div>
    </div>
  );
}

export default HomePage;
