import React from "react";

const ColumnSkeleton = () => (
  <div className="flex flex-col bg-stone-100 dark:bg-stone-900 rounded-xl min-w-[280px] border border-transparent dark:border-stone-700 animate-pulse">
    <div className="p-4 border-t-4 border-stone-300 dark:border-stone-700 rounded-t-xl">
      <div className="h-4 w-28 bg-stone-300/70 dark:bg-stone-700/60 rounded" />
    </div>
    <div className="flex-1 p-3 space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
        >
          <div className="h-3 w-3/4 bg-stone-200 dark:bg-stone-700 rounded" />
          <div className="mt-3 h-2 w-16 bg-stone-200 dark:bg-stone-700 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const KanbanSkeleton = () => {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto">
      {[0, 1, 2, 3].map((i) => (
        <ColumnSkeleton key={i} />
      ))}
    </div>
  );
};

export default KanbanSkeleton;
