import React, { useState } from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import InlineBudgetEditor from "./InlineBudgetEditor";
import BudgetBar from "../BudgetBar";

export default function BudgetsEditor({
  categories,
  budgets,
  month,
  year,
  currency,
  progressByCategory,
  onCreateBudget,
  onUpdateBudget,
  onDeleteBudget,
  onRefreshProgress,
  onCreateCategory,
}) {
  const [form, setForm] = useState({
    category: "",
    month: "",
    year: "",
    amount: "",
  });
  const [saving, setSaving] = useState(false);
  const [otherName, setOtherName] = useState("");

  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");

  return (
    <div className="grid gap-4">
      <Card>
        <SectionTitle>Create Monthly Budget</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <select
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {expenseCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
            <option value="OTHER">Other…</option>
          </select>
          {form.category === "OTHER" && (
            <input
              className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
              placeholder="New expense category name"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
            />
          )}
          <input
            type="month"
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
            value={`${String(form.year || year).padStart(4, "0")}-${String(
              form.month || month
            ).padStart(2, "0")}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-");
              setForm({ ...form, month: Number(m), year: Number(y) });
            }}
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 w-full"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <div className="justify-self-end">
            <button
              className="px-4 py-2 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-900 cursor-pointer hover:bg-black dark:hover:bg-stone-200 shadow-sm"
              disabled={saving || !form.category || !form.amount}
              onClick={async () => {
                try {
                  setSaving(true);
                  let categoryId = form.category;
                  if (categoryId === "OTHER") {
                    const name = (otherName || "").trim();
                    if (!name) return;
                    const createdCat = await onCreateCategory?.({
                      name,
                      type: "EXPENSE",
                    });
                    categoryId = createdCat?._id;
                  }
                  await onCreateBudget?.({
                    category: categoryId,
                    month: Number(form.month || month),
                    year: Number(form.year || year),
                    amount: Number(form.amount),
                  });
                  setForm({ category: "", month: "", year: "", amount: "" });
                  setOtherName("");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saving..." : "Create"}
            </button>
          </div>
        </div>
      </Card>

      {expenseCategories.map((c) => {
        const currentBudget = budgets.find(
          (b) => (b.category?._id || b.category) === c._id
        );
        return (
          <Card key={c._id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-stone-500">Monthly budget</p>
              </div>
              <div className="flex items-center gap-2">
                <InlineBudgetEditor
                  initialAmount={currentBudget?.amount ?? 0}
                  onSave={async (newAmount) => {
                    if (currentBudget) {
                      await onUpdateBudget?.(currentBudget._id, {
                        amount: newAmount,
                      });
                    } else {
                      await onCreateBudget?.({
                        category: c._id,
                        month,
                        year,
                        amount: newAmount,
                      });
                    }
                  }}
                />
                {currentBudget ? (
                  <button
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        `Delete budget for ${c.name}?`
                      );
                      if (!confirmDelete) return;
                      await onDeleteBudget?.(currentBudget._id, c._id);
                    }}
                    className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 cursor-pointer hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    Delete
                  </button>
                ) : null}
                <button
                  onClick={() => onRefreshProgress?.(c._id)}
                  className="text-xs px-3 py-1 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="mt-3">
              <BudgetBar
                spent={progressByCategory[c._id]?.spent || 0}
                total={progressByCategory[c._id]?.budgetAmount || 0}
              />
              <div className="mt-2 text-xs text-stone-500">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency,
                }).format(progressByCategory[c._id]?.spent || 0)}
                {" / "}
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency,
                }).format(progressByCategory[c._id]?.budgetAmount || 0)}
              </div>
            </div>
          </Card>
        );
      })}

      {budgets.length > 0 && (
        <Card>
          <SectionTitle>Existing Budgets (This Month)</SectionTitle>
          <ul className="text-sm space-y-1">
            {budgets.map((b) => (
              <li
                key={b._id}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate">
                  {typeof b.category === "object"
                    ? b.category?.name
                    : categories.find((c) => c._id === b.category)?.name || "—"}
                </span>
                <div className="flex items-center gap-3">
                  <span>
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency,
                    }).format(b.amount)}
                  </span>
                  <button
                    onClick={async () => {
                      const catId = b.category?._id || b.category;
                      const confirmDelete = window.confirm(
                        `Delete budget for ${
                          typeof b.category === "object"
                            ? b.category?.name
                            : categories.find((c) => c._id === b.category)
                                ?.name || "this category"
                        }?`
                      );
                      if (!confirmDelete) return;
                      await onDeleteBudget?.(b._id, catId);
                    }}
                    className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 cursor-pointer hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
