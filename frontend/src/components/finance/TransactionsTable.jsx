import React from "react";
import Card from "./Card";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

export default function TransactionsTable({ transactions, currency, filters, onChangeFilters }) {
  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="px-3 py-2 rounded-md bg-stone-100 dark:bg-stone-800"
            value={filters.type}
            onChange={(e) => onChangeFilters({ ...filters, type: e.target.value })}
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
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-t border-stone-200 dark:border-stone-800">
                  <td className="py-2">{t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : "—"}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${t.type === "INCOME" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"}`}>{t.type}</span>
                  </td>
                  <td className="py-2">{t.category?.name || "—"}</td>
                  <td className="py-2">{t.description || "—"}</td>
                  <td className="py-2 text-right font-semibold">{formatCurrency(t.amount, currency)}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-stone-500">No transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


