import React, { useMemo, useState } from "react";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import txService from "../../services/finance/transactionsService";
import catService from "../../services/finance/categoriesService";

export default function TransactionForm({
  categories,
  projects,
  onCreated,
  onCategoryCreated,
}) {
  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === "INCOME"),
    [categories]
  );
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "EXPENSE"),
    [categories]
  );
  const [form, setForm] = useState({
    type: "EXPENSE",
    amount: "",
    transactionDate: new Date().toISOString().slice(0, 10),
    category: "",
    description: "",
    project: "",
  });
  const [loading, setLoading] = useState(false);
  const [otherCategoryName, setOtherCategoryName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (!payload.category) return;
      if (!payload.project) {
        delete payload.project;
      }
      if (payload.type === "INCOME" && !payload.incomeType) {
        payload.incomeType = "OTHER";
      }
      if (payload.category === "OTHER") {
        const name = otherCategoryName.trim();
        if (!name) return;
        const created = await catService.createCategory({
          name,
          type: payload.type,
        });
        payload.category = created._id;
        onCategoryCreated?.();
      }
      await txService.createTransaction(payload);
      onCreated?.();
      setForm((f) => ({ ...f, amount: "", description: "" }));
      setOtherCategoryName("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <SectionTitle>Add Transaction</SectionTitle>
      <form
        onSubmit={onSubmit}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value, category: "" })
          }
          className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
          placeholder="Amount"
          required
        />
        <input
          type="date"
          value={form.transactionDate}
          onChange={(e) =>
            setForm({ ...form, transactionDate: e.target.value })
          }
          className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
          required
        >
          <option value="">Select Category</option>
          {(form.type === "INCOME" ? incomeCategories : expenseCategories).map(
            (c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            )
          )}
          <option value="OTHER">Other…</option>
        </select>
        {form.category === "OTHER" ? (
          <input
            value={otherCategoryName}
            onChange={(e) => setOtherCategoryName(e.target.value)}
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
            placeholder={`New ${form.type.toLowerCase()} category`}
            required
          />
        ) : (
          <select
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
          >
            <option value="">No Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
        <div className="lg:col-span-2">
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 w-full"
            placeholder="Description (optional)"
          />
        </div>
        <div className="flex justify-end items-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-900 cursor-pointer hover:opacity-90 transition-colors shadow-sm"
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </form>
    </Card>
  );
}
