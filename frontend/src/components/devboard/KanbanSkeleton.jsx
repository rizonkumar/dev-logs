import React from "react";

const ColumnSkeleton = () => (
  <div
    className="flex flex-col bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-2xl min-w-[280px] sm:min-w-[300px] lg:min-w-[320px]
                  border border-stone-200/50 dark:border-stone-700/50 shadow-xl shadow-stone-900/5 dark:shadow-stone-100/5
                  animate-pulse"
  >
    <div className="p-4 sm:p-5 border-t-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/30 rounded" />
        </div>
        <div className="h-5 w-24 bg-white/30 rounded-lg" />
        <div className="ml-auto h-6 w-8 bg-white/30 rounded-full" />
      </div>
    </div>
    <div className="flex-1 p-3 sm:p-4 bg-stone-50/30 dark:bg-stone-950/30 rounded-b-2xl">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="p-4 mb-3 sm:mb-4 rounded-xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl
                     border border-stone-200/50 dark:border-stone-700/50 shadow-lg shadow-stone-900/5
                     dark:shadow-stone-100/5 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 mt-0.5 bg-stone-200/50 dark:bg-stone-700/50 rounded-lg">
              <div className="w-4 h-4 bg-stone-300/70 dark:bg-stone-600/70 rounded" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-stone-200/70 dark:bg-stone-700/70 rounded w-3/4" />
              <div className="flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
                <div className="h-3 w-12 bg-stone-200/70 dark:bg-stone-700/70 rounded" />
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-stone-200/70 dark:bg-stone-700/70 rounded-lg" />
                  <div className="w-8 h-8 bg-stone-200/70 dark:bg-stone-700/70 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const KanbanSkeleton = () => {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto">
      {[0, 1, 2, 3].map((i) => (
        <ColumnSkeleton key={i} />
      ))}
    </div>
  );
};

export default KanbanSkeleton;
