import React from "react";

const Tab = ({ id, active, onClick, children }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? "bg-stone-200 dark:bg-stone-800" : "hover:bg-stone-100 dark:hover:bg-stone-800"
    }`}
  >
    {children}
  </button>
);

export default Tab;


