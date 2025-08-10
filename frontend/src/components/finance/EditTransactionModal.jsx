import React, { useMemo, useState, useEffect } from "react";
import txService from "../../services/finance/transactionsService";
import catService from "../../services/finance/categoriesService";

export default function EditTransactionModal({
  open,
  onClose,
  transaction,
  categories = [],
  projects = [],
  onUpdated,
  onCategoryCreated,
}) {
  const [form, setForm] = useState(() => ({
    type: transaction?.type || "EXPENSE",
    amount: transaction?.amount ?? "",
    transactionDate: transaction?.transactionDate
      ? new Date(transaction.transactionDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    category: transaction?.category?._id || transaction?.category || "",
    description: transaction?.description || "",
    project: transaction?.project?._id || transaction?.project || "",
  }));

  useEffect(() => {
    if (!transaction) return;
    setForm({
      type: transaction.type,
      amount: transaction.amount,
      transactionDate: transaction.transactionDate
        ? new Date(transaction.transactionDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      category: transaction.category?._id || transaction.category || "",
      description: transaction.description || "",
      project: transaction.project?._id || transaction.project || "",
    });
  }, [transaction]);

  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === "INCOME"),
    [categories]
  );
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "EXPENSE"),
    [categories]
  );

  const [saving, setSaving] = useState(false);
  const [otherCategoryName, setOtherCategoryName] = useState("");

  if (!open) return null;

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    if (!transaction?._id) return;
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (!payload.project) delete payload.project;
      if (payload.type === "INCOME" && !payload.incomeType) {
        payload.incomeType = "OTHER";
      }
      if (payload.category === "OTHER") {
        const name = (otherCategoryName || "").trim();
        if (!name) return;
        const created = await catService.createCategory({
          name,
          type: payload.type,
        });
        payload.category = created._id;
        onCategoryCreated?.();
      }
      await txService.updateTransaction(transaction._id, payload);
      onUpdated?.();
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => (!saving ? onClose?.() : null)}
      />
      <div className="relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xl w-full max-w-2xl mx-4">
        <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <h3 className="font-semibold">Edit Transaction</h3>
          <button
            className="px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800"
            onClick={() => (!saving ? onClose?.() : null)}
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 grid gap-4 md:grid-cols-2">
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
            {(form.type === "INCOME"
              ? incomeCategories
              : expenseCategories
            ).map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
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
          <div className="md:col-span-2">
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 w-full"
              placeholder="Description (optional)"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-200 cursor-pointer"
              onClick={() => (!saving ? onClose?.() : null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-900 cursor-pointer hover:opacity-90 transition-colors shadow-sm"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
