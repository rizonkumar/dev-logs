import React from "react";
import StatCard from "./StatCard";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import { CircleDollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);

export default function FinanceDashboard({ overview, goals, recent, currency }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard icon={Wallet} label="Balance (Month)" value={formatCurrency(overview?.balance || 0, currency)} color="bg-stone-200 dark:bg-stone-800" />
      <StatCard icon={TrendingUp} label="Income (Month)" value={formatCurrency(overview?.income || 0, currency)} color="bg-green-200/60 dark:bg-green-900/40" />
      <StatCard icon={TrendingDown} label="Expense (Month)" value={formatCurrency(overview?.expense || 0, currency)} color="bg-red-200/60 dark:bg-red-900/40" />
      <StatCard icon={CircleDollarSign} label="Goals" value={`${goals.length} goals`} color="bg-sky-200/60 dark:bg-sky-900/40" />

      <Card className="md:col-span-2">
        <SectionTitle>Recent Transactions</SectionTitle>
        <div className="space-y-3">
          {recent.map((t) => (
            <div key={t._id} className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs ${t.type === "INCOME" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"}`}>{t.type}</span>
                <span className="text-sm text-stone-600 dark:text-stone-300">{t.description || "—"}</span>
              </div>
              <div className="text-sm font-semibold">{formatCurrency(t.amount, currency)}</div>
            </div>
          ))}
          {recent.length === 0 && <p className="text-sm text-stone-500">No recent transactions</p>}
        </div>
      </Card>

      <Card className="md:col-span-2">
        <SectionTitle>Upcoming Bills</SectionTitle>
        <p className="text-sm text-stone-500">{(overview?.upcomingBills || []).length} scheduled</p>
      </Card>
    </div>
  );
}


