import React, { useState } from "react";
import settingsService from "../../services/finance/settingsService";

const common = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "AUD",
  "CAD",
  "JPY",
  "CHF",
  "SEK",
  "NZD",
];

export default function FinanceCurrencyPicker({ current = "USD", onChange }) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (e) => {
    const code = e.target.value;
    onChange?.(code);
    try {
      setSaving(true);
      await settingsService.updateFinanceCurrency(code);
    } finally {
      setSaving(false);
    }
  };

  return (
    <label className="text-sm text-stone-600 dark:text-stone-300 flex items-center gap-2">
      Currency:
      <select
        className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
        defaultValue={current}
        onChange={handleChange}
        disabled={saving}
      >
        {common.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {saving && <span className="text-xs">Saving…</span>}
    </label>
  );
}
