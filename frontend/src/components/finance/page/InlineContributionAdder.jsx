import React from "react";

export default function InlineContributionAdder({ onSave }) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState("");
  return editing ? (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 w-28 border border-stone-300 dark:border-stone-700"
        placeholder="Amount"
        autoFocus
      />
      <button
        className="px-2 py-1 rounded bg-emerald-600 text-white text-xs cursor-pointer hover:bg-emerald-700 transition-colors"
        onClick={async () => {
          const num = Number(value);
          if (!Number.isNaN(num) && num > 0) {
            await onSave(num);
            setValue("");
            setEditing(false);
          }
        }}
      >
        ✓
      </button>
      <button
        className="px-2 py-1 rounded bg-rose-600 text-white text-xs cursor-pointer hover:bg-rose-700 transition-colors"
        onClick={() => {
          setValue("");
          setEditing(false);
        }}
      >
        ✕
      </button>
    </div>
  ) : (
    <button
      className="text-xs px-3 py-1 rounded bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors"
      onClick={() => setEditing(true)}
    >
      Add +
    </button>
  );
}
