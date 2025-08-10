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
  ChevronDown,
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
  AreaChart as ReAreaChart,
  Area,
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart as ReRadialBarChart,
  RadialBar,
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
  const [txChartType, setTxChartType] = useState("area"); // area | line | bar
  const [catChartType, setCatChartType] = useState("radial"); // pie | radial | radar
  const [txMenuOpen, setTxMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Keep grid/tick colors readable in both themes
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const compute = () => {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(
        document.documentElement.classList.contains("dark") || prefersDark
      );
    };
    compute();
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => compute();
    try {
      mql.addEventListener("change", listener);
    } catch {
      mql.addListener(listener);
    }
    const mo = new MutationObserver(compute);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      try {
        mql.removeEventListener("change", listener);
      } catch {
        mql.removeListener(listener);
      }
      mo.disconnect();
    };
  }, []);

  const gridStroke = isDark ? "#334155" : "#e5e7eb"; // slate-700 : gray-200
  const tickColor = isDark ? "#cbd5e1" : "#475569"; // slate-300 : slate-600

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
  const CATEGORY_COLORS = [
    "#2563eb", // blue-600
    "#06b6d4", // cyan-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#10b981", // emerald-500
    "#a855f7", // purple-500
    "#84cc16", // lime-500
    "#fb7185", // rose-400
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
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <Card className="xl:col-span-8">
              <div className="flex items-center justify-between">
                <SectionTitle>Transactions</SectionTitle>
                <div
                  className="relative"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget))
                      setTxMenuOpen(false);
                  }}
                >
                  <button
                    className="inline-flex items-center gap-2 rounded-md border border-stone-200 dark:border-stone-700 px-3 py-1.5 text-xs sm:text-sm hover:bg-stone-50 dark:hover:bg-stone-800"
                    onClick={(e) => {
                      e.preventDefault();
                      setTxMenuOpen((v) => !v);
                    }}
                    title="Select chart type"
                  >
                    {txChartType === "area"
                      ? "Area chart"
                      : txChartType === "line"
                      ? "Line chart"
                      : "Bar chart"}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {txMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm p-1">
                      {[
                        { id: "area", label: "Area chart" },
                        { id: "line", label: "Line chart" },
                        { id: "bar", label: "Bar chart" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          className={`w-full text-left px-2 py-1.5 rounded-md text-xs sm:text-sm ${
                            txChartType === opt.id
                              ? "bg-stone-100 dark:bg-stone-800 font-medium"
                              : "hover:bg-stone-50 dark:hover:bg-stone-800"
                          }`}
                          onClick={() => {
                            setTxChartType(opt.id);
                            setTxMenuOpen(false);
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full h-[240px] sm:h-[300px] lg:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  {txChartType === "area" ? (
                    <ReAreaChart
                      data={netByDayData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="incomeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="expenseGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={gridStroke}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: tickColor }}
                      />
                      <YAxis
                        tick={{ fill: tickColor }}
                        tickFormatter={(v) => formatCurrency(v, currency)}
                        width={80}
                      />
                      <Tooltip content={<CustomLineTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#incomeGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fill="url(#expenseGradient)"
                      />
                    </ReAreaChart>
                  ) : txChartType === "line" ? (
                    <ReLineChart
                      data={netByDayData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={gridStroke}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: tickColor }}
                      />
                      <YAxis
                        tick={{ fill: tickColor }}
                        tickFormatter={(v) => formatCurrency(v, currency)}
                        width={80}
                      />
                      <Tooltip content={<CustomLineTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 0 }}
                      />
                    </ReLineChart>
                  ) : (
                    <ReBarChart
                      data={netByDayData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={gridStroke}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: tickColor }}
                      />
                      <YAxis
                        tick={{ fill: tickColor }}
                        tickFormatter={(v) => formatCurrency(v, currency)}
                        width={80}
                      />
                      <Tooltip content={<CustomLineTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="income"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expense"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                      />
                    </ReBarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="xl:col-span-4">
              <div className="flex items-center justify-between">
                <SectionTitle>Categories</SectionTitle>
                <div
                  className="relative"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget))
                      setCatMenuOpen(false);
                  }}
                >
                  <button
                    className="inline-flex items-center gap-2 rounded-md border border-stone-200 dark:border-stone-700 px-3 py-1.5 text-xs sm:text-sm hover:bg-stone-50 dark:hover:bg-stone-800"
                    onClick={(e) => {
                      e.preventDefault();
                      setCatMenuOpen((v) => !v);
                    }}
                    title="Select chart type"
                  >
                    {catChartType === "pie"
                      ? "Pie chart"
                      : catChartType === "radar"
                      ? "Radar chart"
                      : "Radial chart"}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {catMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm p-1">
                      {[
                        { id: "radial", label: "Radial chart" },
                        { id: "pie", label: "Pie chart" },
                        { id: "radar", label: "Radar chart" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          className={`w-full text-left px-2 py-1.5 rounded-md text-xs sm:text-sm ${
                            catChartType === opt.id
                              ? "bg-stone-100 dark:bg-stone-800 font-medium"
                              : "hover:bg-stone-50 dark:hover:bg-stone-800"
                          }`}
                          onClick={() => {
                            setCatChartType(opt.id);
                            setCatMenuOpen(false);
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 items-center">
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {catChartType === "pie" ? (
                      <RePieChart>
                        <Pie
                          data={expenseByCategoryData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={2}
                        >
                          {expenseByCategoryData.map((entry, index) => (
                            <Cell
                              key={`cat-${index}`}
                              fill={
                                CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                              }
                            />
                          ))}
                          <Label
                            position="center"
                            content={({ viewBox }) => {
                              const { cx, cy } = viewBox;
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
                                    style={{ fontSize: 11 }}
                                  >
                                    Expenses
                                  </tspan>
                                  <tspan
                                    className="fill-stone-900 dark:fill-white"
                                    x={cx}
                                    dy="1.3em"
                                    style={{ fontSize: 13, fontWeight: 700 }}
                                  >
                                    by Category
                                  </tspan>
                                </text>
                              );
                            }}
                          />
                        </Pie>
                        <Tooltip content={<CustomBarTooltip />} />
                      </RePieChart>
                    ) : catChartType === "radar" ? (
                      <ReRadarChart
                        data={expenseByCategoryData}
                        outerRadius={90}
                      >
                        <PolarGrid />
                        <PolarAngleAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                        />
                        <PolarRadiusAxis tick={false} />
                        <Radar
                          name="Expenses"
                          dataKey="value"
                          stroke="#2563eb"
                          fill="#60a5fa"
                          fillOpacity={0.4}
                        />
                        <Tooltip content={<CustomBarTooltip />} />
                      </ReRadarChart>
                    ) : (
                      <ReRadialBarChart
                        innerRadius={30}
                        outerRadius={100}
                        data={expenseByCategoryData.map((c, i) => ({
                          ...c,
                          fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                        }))}
                      >
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={6}
                        />
                        <Legend verticalAlign="bottom" height={0} />
                        <Tooltip content={<CustomBarTooltip />} />
                      </ReRadialBarChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {expenseByCategoryData.length === 0 && (
                    <p className="text-sm text-stone-500">
                      No expense categories yet
                    </p>
                  )}
                  {expenseByCategoryData.map((c, i) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                          }}
                        />
                        <span className="text-sm text-stone-700 dark:text-stone-300 truncate max-w-[140px] sm:max-w-[160px]">
                          {c.name}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-stone-900 dark:text-white">
                        {formatCurrency(c.value || 0, currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
