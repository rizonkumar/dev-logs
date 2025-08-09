import React from "react";

const BudgetBar = ({ spent = 0, total = 0 }) => {
  const pct = Math.min(100, Math.round(((spent || 0) / (total || 1)) * 100));
  const color =
    pct > 90 ? "bg-red-500" : pct > 70 ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 rounded-full ${color} transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default BudgetBar;
