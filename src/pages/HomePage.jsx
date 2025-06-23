import React from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      <aside className="lg:col-span-1 xl:col-span-1 h-fit sticky top-8">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700/60">
          <div className="flex flex-col items-center text-center">
            <img
              src="https://i.pravatar.cc/120?u=a042581f4e29026704d"
              alt="Your Name"
              className="w-24 h-24 rounded-full border-2 border-teal-400 object-cover mb-4"
            />
            <h1 className="text-2xl font-bold text-white">Rizon Kumar Rahi</h1>
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
              A short bio. Passionate about building cool things with code,
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
        <div className="bg-gray-800/80 p-8 rounded-2xl border border-gray-700/60 h-full flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to My Digital Garden
          </h2>
          <p className="text-gray-400 max-w-2xl">
            This is my personal space on the internet. The "About Me" card gives
            you a quick summary. To see my day-to-day progress, project updates,
            and random thoughts, head over to the dev logs.
          </p>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
