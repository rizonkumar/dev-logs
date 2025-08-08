import React from "react";

const StatCard = ({ icon: Icon, label, value, color = "" }) => (
  <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-4">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-300">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default StatCard;


