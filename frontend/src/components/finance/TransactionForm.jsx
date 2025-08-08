import React, { useMemo, useState } from "react";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import txService from "../../services/finance/transactionsService";

export default function TransactionForm({ categories, projects, onCreated }) {
  const incomeCategories = useMemo(() => categories.filter((c) => c.type === "INCOME"), [categories]);
  const expenseCategories = useMemo(() => categories.filter((c) => c.type === "EXPENSE"), [categories]);
  const [form, setForm] = useState({ type: "EXPENSE", amount: "", transactionDate: new Date().toISOString().slice(0, 10), category: "", description: "", project: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (!payload.category) return;
      await txService.createTransaction(payload);
      onCreated?.();
      setForm((f) => ({ ...f, amount: "", description: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <SectionTitle>Add Transaction</SectionTitle>
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-3">
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800">
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
        <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800" placeholder="Amount" required />
        <input type="date" value={form.transactionDate} onChange={(e) => setForm({ ...form, transactionDate: e.target.value })} className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800" required>
          <option value="">Select Category</option>
          {(form.type === "INCOME" ? incomeCategories : expenseCategories).map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800">
          <option value="">No Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800 md:col-span-2" placeholder="Description (optional)" />
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={loading} className="px-3 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900">
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </form>
    </Card>
  );
}


