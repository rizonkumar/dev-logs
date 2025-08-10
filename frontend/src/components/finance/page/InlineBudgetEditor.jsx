import React from "react";

export default function InlineBudgetEditor({ initialAmount, onSave }) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(String(initialAmount ?? 0));
  return editing ? (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 w-28"
      />
      <button
        className="px-2 py-1 rounded bg-green-600 text-white text-xs cursor-pointer hover:bg-green-700 transition-colors"
        onClick={async () => {
          const num = Number(value);
          if (!Number.isNaN(num)) {
            await onSave(num);
            setEditing(false);
          }
        }}
      >
        ✓
      </button>
      <button
        className="px-2 py-1 rounded bg-stone-300 dark:bg-stone-700 text-xs cursor-pointer hover:bg-stone-400 dark:hover:bg-stone-600 transition-colors"
        onClick={() => {
          setValue(String(initialAmount ?? 0));
          setEditing(false);
        }}
      >
        ✕
      </button>
    </div>
  ) : (
    <button
      className="text-xs px-3 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
      onClick={() => setEditing(true)}
    >
      Edit Limit
    </button>
  );
}
