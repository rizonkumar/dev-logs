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
  Label,
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
    const countMap = new Map();
    (recent || [])
      .filter((t) => t?.type === "EXPENSE")
      .forEach((t) => {
        const key = t?.category?.name || "Uncategorized";
        map.set(key, (map.get(key) || 0) + Number(t.amount || 0));
        countMap.set(key, (countMap.get(key) || 0) + 1);
      });
    const total = Array.from(map.values()).reduce((s, n) => s + n, 0) || 0;
    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        count: countMap.get(name) || 0,
        share: total ? value / total : 0,
      }))
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
        const current = dayMap.get(key) || {
          income: 0,
          expense: 0,
        };
        if (t.type === "INCOME") current.income += Number(t.amount || 0);
        if (t.type === "EXPENSE") current.expense += Number(t.amount || 0);
        dayMap.set(key, current);
      });
    const items = Array.from(dayMap.entries()).map(([iso, stats]) => ({
      date: new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      income: stats.income,
      expense: stats.expense,
      net: (stats.income || 0) - (stats.expense || 0),
    }));
    return items;
  }, [recent]);

  const PIE_COLORS = [
    "#16a34a", // green-600
    "#dc2626", // red-600
  ];

  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0];
    const value = p?.value || 0;
    const percent = (p?.payload?.percent || 0) * 100;
    return (
      <div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 shadow-sm">
        <div className="text-xs font-medium text-stone-700 dark:text-stone-200">
          {p.name}
        </div>
        <div className="text-sm font-semibold text-stone-900 dark:text-white">
          {formatCurrency(value, currency)}
          <span className="ml-1 text-xs font-medium text-stone-500 dark:text-stone-400">
            ({percent.toFixed(1)}%)
          </span>
        </div>
        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
          Based on this month's overview
        </div>
      </div>
    );
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0]?.payload || {};
    return (
      <div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 shadow-sm">
        <div className="text-xs font-medium text-stone-700 dark:text-stone-200">
          {label}
        </div>
        <div className="text-sm font-semibold text-stone-900 dark:text-white">
          {formatCurrency(p.value || 0, currency)}
        </div>
        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
          {((p.share || 0) * 100).toFixed(1)}% of recent expenses •{" "}
          {p.count || 0} tx
        </div>
      </div>
    );
  };

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    const row = (payload[0] && payload[0].payload) || {};
    return (
      <div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 shadow-sm">
        <div className="text-xs font-medium text-stone-700 dark:text-stone-200">
          {label}
        </div>
        <div className="text-xs mt-1 space-y-0.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-stone-500 dark:text-stone-400">Income</span>
            <span className="font-medium text-stone-900 dark:text-white">
              {formatCurrency(row.income || 0, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-stone-500 dark:text-stone-400">Expense</span>
            <span className="font-medium text-stone-900 dark:text-white">
              {formatCurrency(row.expense || 0, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 border-t border-stone-200 dark:border-stone-700 pt-1 mt-1">
            <span className="text-stone-600 dark:text-stone-300">Net</span>
            <span className="font-semibold text-stone-900 dark:text-white">
              {formatCurrency(row.net || 0, currency)}
            </span>
          </div>
        </div>
        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
          Derived from recent transactions
        </div>
      </div>
    );
  };

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
                    <defs>
                      <filter
                        id="shadow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feDropShadow
                          dx="0"
                          dy="2"
                          stdDeviation="3"
                          floodOpacity="0.15"
                        />
                      </filter>
                    </defs>
                    <Pie
                      data={incomeVsExpenseData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      stroke="#ffffff"
                      strokeWidth={1}
                      filter="url(#shadow)"
                    >
                      {incomeVsExpenseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                      <Label
                        position="center"
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox;
                          const balance =
                            (overview?.income || 0) - (overview?.expense || 0);
                          return (
                            <text
                              x={cx}
                              y={cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                className="fill-stone-500"
                                x={cx}
                                dy="-0.35em"
                                style={{ fontSize: 12 }}
                              >
                                Balance
                              </tspan>
                              <tspan
                                className="fill-stone-900 dark:fill-white"
                                x={cx}
                                dy="1.2em"
                                style={{ fontSize: 14, fontWeight: 700 }}
                              >
                                {formatCurrency(balance, currency)}
                              </tspan>
                            </text>
                          );
                        }}
                      />
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
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
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
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
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
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
