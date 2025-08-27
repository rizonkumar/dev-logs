import React from "react";
import { ClipboardList, Plus, Sparkles, ArrowRight } from "lucide-react";

const EmptyState = ({ onAddTaskClick }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8 lg:p-12">
    <div
      className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl border border-stone-200/50 dark:border-stone-700/50
                    rounded-3xl p-8 sm:p-10 lg:p-12 max-w-2xl shadow-2xl shadow-stone-900/5 dark:shadow-stone-100/5
                    relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.blue.400)_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>

      <div className="relative z-10">
        <div
          className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500
                        text-white flex items-center justify-center rounded-3xl shadow-lg shadow-blue-500/25 mb-6
                        relative"
        >
          <ClipboardList size={40} className="sm:w-12 sm:h-12" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles size={16} className="text-yellow-800" />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900
                         dark:from-stone-100 dark:via-stone-200 dark:to-stone-100 bg-clip-text text-transparent leading-tight"
          >
            Ready to Organize?
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
            Your DevBoard is waiting for its first task. Break down your
            projects, track progress, and boost your productivity with our
            intuitive kanban system.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onAddTaskClick}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500
                       hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl
                       font-bold text-lg transition-all duration-300 shadow-xl shadow-blue-500/25
                       hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transform cursor-pointer"
          >
            <Plus size={24} />
            Create Your First Task
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </button>

          <div className="flex flex-wrap justify-center gap-3 text-sm text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Drag & Drop
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Real-time Updates
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Smart Filters
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default EmptyState;
