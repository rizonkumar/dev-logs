import React from "react";
import Card from "./Card";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    n || 0
  );

export default function TransactionsTable({
  transactions,
  currency = "USD",
  filters,
  onChangeFilters,
  onDelete,
  pagination,
}) {
  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="px-3 py-2 rounded-md bg-stone-100 dark:bg-stone-800"
            value={filters.type}
            onChange={(e) =>
              onChangeFilters({ ...filters, type: e.target.value })
            }
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <input
            className="px-3 py-2 rounded-md bg-stone-100 dark:bg-stone-800 flex-1"
            placeholder="Search description..."
            value={filters.q}
            onChange={(e) => onChangeFilters({ ...filters, q: e.target.value })}
          />
          <select
            className="px-3 py-2 rounded-md bg-stone-100 dark:bg-stone-800"
            value={filters.category || ""}
            onChange={(e) =>
              onChangeFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            {/* Note: we only have names in the table; server expects ids if it’s for API.
                This is purely client-side filter across the current page’s rows. */}
          </select>
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500">
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Category</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t._id}
                  className="border-t border-stone-200 dark:border-stone-800"
                >
                  <td className="py-2">
                    {t.transactionDate
                      ? new Date(t.transactionDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        t.type === "INCOME"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                      {t.category?.name || "—"}
                    </span>
                  </td>
                  <td className="py-2">{t.description || "—"}</td>
                  <td className="py-2 text-right font-semibold">
                    {formatCurrency(t.amount, currency)}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 cursor-pointer transition-colors hover:bg-red-200 dark:hover:bg-red-800"
                      onClick={() => onDelete?.(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-stone-500">
                    No transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {pagination && (
        <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-300">
          <div>
            Page {pagination.page} of{" "}
            {Math.max(
              1,
              Math.ceil((pagination.total || 0) / (pagination.limit || 1))
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 rounded bg-stone-200 dark:bg-stone-800 cursor-pointer disabled:opacity-50"
              onClick={() =>
                pagination.onPageChange(Math.max(1, pagination.page - 1))
              }
              disabled={pagination.page <= 1}
            >
              Prev
            </button>
            <button
              className="px-2 py-1 rounded bg-stone-200 dark:bg-stone-800 cursor-pointer disabled:opacity-50"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={
                pagination.page >=
                Math.ceil((pagination.total || 0) / (pagination.limit || 1))
              }
            >
              Next
            </button>
            <select
              className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800"
              value={pagination.limit}
              onChange={(e) => pagination.onLimitChange(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
