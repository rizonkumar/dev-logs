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
      await goalsService.createGoal({ name: form.name, targetAmount: Number(form.targetAmount) });
      setForm({ name: "", targetAmount: "" });
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <SectionTitle>Create Goal</SectionTitle>
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Goal name" className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800" required />
        <input type="number" min="0" step="0.01" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="Target amount" className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800" required />
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={loading} className="px-3 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900">{loading ? "Saving..." : "Create"}</button>
        </div>
      </form>
    </Card>
  );
}


