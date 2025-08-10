import React from "react";
import Card from "../Card";
import SectionTitle from "../SectionTitle";
import billsService from "../../../services/finance/billsService";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    n || 0
  );

export default function BillsSection({ categories = [], currency = "USD" }) {
  const [bills, setBills] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(25);

  const [form, setForm] = React.useState({
    amount: "",
    dueDate: new Date().toISOString().slice(0, 10),
    category: "",
    description: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(null);

  const expenseCategories = React.useMemo(
    () => categories.filter((c) => c.type === "EXPENSE"),
    [categories]
  );

  const fetchBills = React.useCallback(async () => {
    const res = await billsService.listBills({ limit, page });
    setBills(res.items || []);
    setTotal(res.total || 0);
  }, [limit, page]);

  React.useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const resetForm = () =>
    setForm({
      amount: "",
      dueDate: new Date().toISOString().slice(0, 10),
      category: "",
      description: "",
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (!payload.category) return;
      await billsService.createBill(payload);
      await fetchBills();
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const onSaveEdit = async () => {
    if (!editing?._id) return;
    setLoading(true);
    try {
      const payload = {
        amount: Number(editing.amount),
        dueDate: editing.dueDate,
        category: editing.category?._id || editing.category,
        description: editing.description || "",
      };
      await billsService.updateBill(editing._id, payload);
      setEditing(null);
      await fetchBills();
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    await billsService.deleteBill(id);
    await fetchBills();
  };

  return (
    <div className="grid gap-4">
      <Card>
        <SectionTitle>Schedule Bill</SectionTitle>
        <form
          onSubmit={onSubmit}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
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
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
            required
          >
            <option value="">Select Expense Category</option>
            {expenseCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="lg:col-span-2">
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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
              {loading ? "Saving..." : "Add Bill"}
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <SectionTitle>Upcoming Bills</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500">
                <th className="py-2">Due</th>
                <th className="py-2">Category</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b) => (
                <tr
                  key={b._id}
                  className="border-t border-stone-200 dark:border-stone-800"
                >
                  <td className="py-2">
                    {b.dueDate ? new Date(b.dueDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                      {b.category?.name || "—"}
                    </span>
                  </td>
                  <td className="py-2">{b.description || "—"}</td>
                  <td className="py-2 text-right font-semibold">
                    {formatCurrency(b.amount, currency)}
                  </td>
                  <td className="py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        className="text-xs px-2 py-1 rounded bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-200 cursor-pointer transition-colors hover:bg-stone-300 dark:hover:bg-stone-700"
                        onClick={() =>
                          setEditing({
                            ...b,
                            category: b.category?._id || b.category,
                            dueDate: b.dueDate
                              ? new Date(b.dueDate).toISOString().slice(0, 10)
                              : new Date().toISOString().slice(0, 10),
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 cursor-pointer transition-colors hover:bg-red-200 dark:hover:bg-red-800"
                        onClick={() => onDelete(b._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-stone-500">
                    No scheduled bills
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-300 mt-3">
          <div>
            Page {page} of {Math.max(1, Math.ceil((total || 0) / (limit || 1)))}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 rounded bg-stone-200 dark:bg-stone-800 cursor-pointer disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <button
              className="px-2 py-1 rounded bg-stone-200 dark:bg-stone-800 cursor-pointer disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil((total || 0) / (limit || 1))}
            >
              Next
            </button>
            <select
              className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setEditing(null)}
          />
          <div className="relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xl w-full max-w-2xl mx-4">
            <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <h3 className="font-semibold">Edit Bill</h3>
              <button
                className="px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800"
                onClick={() => setEditing(null)}
              >
                Close
              </button>
            </div>
            <div className="p-4 grid gap-4 md:grid-cols-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={editing.amount}
                onChange={(e) =>
                  setEditing({ ...editing, amount: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
                placeholder="Amount"
              />
              <input
                type="date"
                value={editing.dueDate}
                onChange={(e) =>
                  setEditing({ ...editing, dueDate: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
              />
              <select
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
                className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
              >
                <option value="">Select Expense Category</option>
                {expenseCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="md:col-span-2">
                <input
                  value={editing.description || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 w-full"
                  placeholder="Description (optional)"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-200 cursor-pointer"
                  onClick={() => setEditing(null)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={onSaveEdit}
                  className="px-4 py-2 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-900 cursor-pointer hover:opacity-90 transition-colors shadow-sm"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
