import React, { useMemo, useState } from "react";
import StatCard from "./StatCard";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import {
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
  LayoutDashboard,
  BarChart3 as BarChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
} from "recharts";

const formatCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    n || 0
  );

export default function FinanceDashboard({
  overview,
  goals,
  recent,
  currency,
}) {
  const [view, setView] = useState("summary");

  const incomeVsExpenseData = useMemo(
    () => [
      { name: "Income", value: Number(overview?.income || 0) },
      { name: "Expense", value: Number(overview?.expense || 0) },
    ],
    [overview?.income, overview?.expense]
  );

  const expenseByCategoryData = useMemo(() => {
    const map = new Map();
    (recent || [])
      .filter((t) => t?.type === "EXPENSE")
      .forEach((t) => {
        const key = t?.category?.name || "Uncategorized";
        map.set(key, (map.get(key) || 0) + Number(t.amount || 0));
      });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [recent]);

  const netByDayData = useMemo(() => {
    const dayMap = new Map();
    (recent || [])
      .slice()
      .sort(
        (a, b) =>
          new Date(a.transactionDate || a.createdAt) -
          new Date(b.transactionDate || b.createdAt)
      )
      .forEach((t) => {
        const date = new Date(t.transactionDate || t.createdAt);
        const key = date.toISOString().slice(0, 10);
        const delta =
          t.type === "INCOME" ? Number(t.amount || 0) : -Number(t.amount || 0);
        dayMap.set(key, (dayMap.get(key) || 0) + delta);
      });
    const items = Array.from(dayMap.entries()).map(([iso, net]) => ({
      date: new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      net,
    }));
    return items;
  }, [recent]);

  const PIE_COLORS = [
    "#16a34a", // green-600
    "#dc2626", // red-600
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-stone-500">
          {view === "summary" ? "Summary view" : "Charts view"}
        </div>
        <div className="inline-flex rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setView("summary")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
              view === "summary"
                ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                : "bg-transparent text-stone-600 dark:text-stone-300 hover:bg-stone-100/60 dark:hover:bg-stone-800/60"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Summary
          </button>
          <button
            type="button"
            onClick={() => setView("charts")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
              view === "charts"
                ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                : "bg-transparent text-stone-600 dark:text-stone-300 hover:bg-stone-100/60 dark:hover:bg-stone-800/60"
            }`}
          >
            <BarChartIcon className="w-4 h-4" />
            Charts
          </button>
        </div>
      </div>

      {view === "summary" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Wallet}
            label="Balance (Month)"
            value={formatCurrency(overview?.balance || 0, currency)}
            color="bg-stone-200 dark:bg-stone-800"
          />
          <StatCard
            icon={TrendingUp}
            label="Income (Month)"
            value={formatCurrency(overview?.income || 0, currency)}
            color="bg-green-200/60 dark:bg-green-900/40"
          />
          <StatCard
            icon={TrendingDown}
            label="Expense (Month)"
            value={formatCurrency(overview?.expense || 0, currency)}
            color="bg-red-200/60 dark:bg-red-900/40"
          />
          <StatCard
            icon={CircleDollarSign}
            label="Goals"
            value={`${goals.length} goals`}
            color="bg-sky-200/60 dark:bg-sky-900/40"
          />

          <Card className="md:col-span-2">
            <SectionTitle>Recent Transactions</SectionTitle>
            <div className="space-y-3">
              {recent.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        t.type === "INCOME"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {t.type}
                    </span>
                    <span className="text-sm text-stone-600 dark:text-stone-300">
                      {t.description || "—"}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatCurrency(t.amount, currency)}
                  </div>
                </div>
              ))}
              {recent.length === 0 && (
                <p className="text-sm text-stone-500">No recent transactions</p>
              )}
            </div>
          </Card>

          <Card className="md:col-span-2">
            <SectionTitle>Upcoming Bills</SectionTitle>
            <p className="text-sm text-stone-500">
              {(overview?.upcomingBills || []).length} scheduled
            </p>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="xl:col-span-1">
              <SectionTitle>Income vs Expense</SectionTitle>
              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={incomeVsExpenseData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {incomeVsExpenseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [
                        formatCurrency(val, currency),
                        name,
                      ]}
                    />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="xl:col-span-2">
              <SectionTitle>Top Expenses by Category (Recent)</SectionTitle>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart
                    data={expenseByCategoryData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-15}
                      height={50}
                      tickMargin={10}
                    />
                    <YAxis
                      tickFormatter={(v) => formatCurrency(v, currency)}
                      width={80}
                    />
                    <Tooltip
                      formatter={(val) => formatCurrency(val, currency)}
                    />
                    <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card>
              <SectionTitle>Net Flow by Day (Recent)</SectionTitle>
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart
                    data={netByDayData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(v) => formatCurrency(v, currency)}
                      width={80}
                    />
                    <Tooltip
                      formatter={(val) => formatCurrency(val, currency)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
