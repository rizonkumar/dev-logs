import React, { useState } from "react";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import goalsService from "../../services/finance/goalsService";

export default function GoalForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", targetAmount: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await goalsService.createGoal({
        name: form.name,
        targetAmount: Number(form.targetAmount),
      });
      setForm({ name: "", targetAmount: "" });
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <SectionTitle>Create Goal</SectionTitle>
      <form
        onSubmit={onSubmit}
        className="flex flex-col md:flex-row gap-3 items-stretch md:items-center"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Goal name"
          className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800 flex-1"
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.targetAmount}
          onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
          placeholder="Target amount"
          className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800 w-40"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900 whitespace-nowrap cursor-pointer hover:opacity-90 transition"
        >
          {loading ? "Saving..." : "Create"}
        </button>
      </form>
    </Card>
  );
}
