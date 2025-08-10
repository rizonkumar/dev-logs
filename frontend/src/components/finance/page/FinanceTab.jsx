import React from "react";

export default function FinanceTab({
  id,
  active,
  onClick,
  children,
  icon: Icon,
  variant,
}) {
  const colorStyles = {
    dashboard: {
      active:
        "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800",
      hover:
        "hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-200",
      icon: "text-indigo-600 dark:text-indigo-300",
    },
    transactions: {
      active:
        "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-200 border-sky-200 dark:border-sky-800",
      hover:
        "hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-200",
      icon: "text-sky-600 dark:text-sky-300",
    },
    budgets: {
      active:
        "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800",
      hover:
        "hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-200",
      icon: "text-amber-600 dark:text-amber-300",
    },
    goals: {
      active:
        "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
      hover:
        "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-200",
      icon: "text-emerald-600 dark:text-emerald-300",
    },
    bills: {
      active:
        "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800",
      hover:
        "hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-200",
      icon: "text-amber-600 dark:text-amber-300",
    },
    categories: {
      active:
        "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-200 border-violet-200 dark:border-violet-800",
      hover:
        "hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-200",
      icon: "text-violet-600 dark:text-violet-300",
    },
  };
  const colors = colorStyles[variant] || {};
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border flex items-center gap-2 ${
        active
          ? colors.active ||
            "bg-stone-200 dark:bg-stone-800 text-gray-900 dark:text-white border-stone-300 dark:border-stone-700"
          : `${
              colors.hover || "hover:bg-stone-100 dark:hover:bg-stone-800"
            } border-transparent text-stone-700 dark:text-stone-300`
      }`}
    >
      {Icon ? <Icon className={`w-4 h-4 ${colors.icon || ""}`} /> : null}
      {children}
    </button>
  );
}
