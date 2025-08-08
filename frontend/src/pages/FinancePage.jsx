import React, { useEffect, useMemo, useState } from "react";
import DevLogsHeader from "../components/DevLogsHeader";
import { getOverview } from "../services/finance/dashboardService";
import txService from "../services/finance/transactionsService";
import catService from "../services/finance/categoriesService";
import budgetService from "../services/finance/budgetsService";
import goalsService from "../services/finance/goalsService";
import projectsService from "../services/finance/projectsService";
import calculatorsService from "../services/finance/calculatorsService";
import TransactionForm from "../components/finance/TransactionForm";
import GoalForm from "../components/finance/GoalForm";
import StatCard from "../components/finance/StatCard";
import {
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-4 ${className}`}
  >
    {children}
  </div>
);

// StatCard imported from components/finance/StatCard

const Tab = ({ id, active, onClick, children }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-stone-200 dark:bg-stone-800"
        : "hover:bg-stone-100 dark:hover:bg-stone-800"
    }`}
  >
    {children}
  </button>
);

const formatCurrency = (n) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n || 0);

const BudgetBar = ({ spent, total }) => {
  const pct = Math.min(100, Math.round(((spent || 0) / (total || 1)) * 100));
  return (
    <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-3">
      <div
        className={`h-3 rounded-full ${
          pct > 90 ? "bg-red-500" : pct > 70 ? "bg-yellow-500" : "bg-green-500"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const SectionTitle = ({ children, right }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-stone-800 dark:text-stone-100">
      {children}
    </h3>
    {right}
  </div>
);

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [overview, setOverview] = useState(null);
  const [recent, setRecent] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ type: "", q: "" });

  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [progress, setProgress] = useState({});

  const [goals, setGoals] = useState([]);

  const [projects, setProjects] = useState([]);
  const [profit, setProfit] = useState({});

  // Simple create-form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: "EXPENSE",
  });
  const [savingCategory, setSavingCategory] = useState(false);

  const [budgetForm, setBudgetForm] = useState({
    category: "",
    month: "",
    year: "",
    amount: "",
  });
  const [savingBudget, setSavingBudget] = useState(false);

  const [projectForm, setProjectForm] = useState({ name: "", client: "" });
  const [savingProject, setSavingProject] = useState(false);

  const month = useMemo(() => new Date().getMonth() + 1, []);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    (async () => {
      try {
        const ov = await getOverview();
        setOverview(ov);
        setRecent(ov.recentTransactions || []);
      } catch {
        console.error("Error fetching overview");
      }
      try {
        setCategories(await catService.listCategories());
      } catch {
        console.error("Error fetching categories");
      }
      try {
        setBudgets(await budgetService.listBudgets({ month, year }));
      } catch {
        console.error("Error fetching budgets");
      }
      try {
        setGoals(await goalsService.listGoals());
      } catch {
        console.error("Error fetching goals");
      }
      try {
        setProjects(await projectsService.listProjects());
      } catch {
        console.error("Error fetching projects");
      }
      try {
        setTransactions(await txService.listTransactions({ limit: 50 }));
      } catch {
        console.error("Error fetching transactions");
      }
    })();
  }, [month, year]);

  const refreshOverview = async () => {
    try {
      const ov = await getOverview();
      setOverview(ov);
      setRecent(ov.recentTransactions || []);
    } catch {
      // noop
    }
  };

  const refreshTransactions = async () => {
    try {
      setTransactions(await txService.listTransactions({ limit: 50 }));
      await refreshOverview();
    } catch (e) {
      console.error("Failed to refresh transactions", e);
    }
  };

  const refreshGoals = async () => {
    try {
      setGoals(await goalsService.listGoals());
      await refreshOverview();
    } catch (e) {
      console.error("Failed to refresh goals", e);
    }
  };

  const refreshCategories = async () => {
    try {
      setCategories(await catService.listCategories());
    } catch (e) {
      console.error("Failed to refresh categories", e);
    }
  };

  const refreshProjects = async () => {
    try {
      setProjects(await projectsService.listProjects());
    } catch (e) {
      console.error("Failed to refresh projects", e);
    }
  };

  const refreshProgress = async (categoryId) => {
    const data = await budgetService.getBudgetProgress({
      categoryId,
      month,
      year,
    });
    setProgress((p) => ({ ...p, [categoryId]: data }));
  };

  const filteredTx = useMemo(() => {
    return transactions.filter(
      (t) =>
        (filters.type ? t.type === filters.type : true) &&
        (filters.q
          ? (t.description || "")
              .toLowerCase()
              .includes(filters.q.toLowerCase())
          : true)
    );
  }, [transactions, filters]);

  // Theme is globally controlled in layout; no local toggle here

  return (
    <div className="p-4 sm:p-6">
      <DevLogsHeader />

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Tab
            id="dashboard"
            active={activeTab === "dashboard"}
            onClick={setActiveTab}
          >
            Dashboard
          </Tab>
          <Tab
            id="transactions"
            active={activeTab === "transactions"}
            onClick={setActiveTab}
          >
            Transactions
          </Tab>
          <Tab
            id="budgets"
            active={activeTab === "budgets"}
            onClick={setActiveTab}
          >
            Budgets
          </Tab>
          <Tab id="goals" active={activeTab === "goals"} onClick={setActiveTab}>
            Goals
          </Tab>
          <Tab
            id="projects"
            active={activeTab === "projects"}
            onClick={setActiveTab}
          >
            Projects
          </Tab>
          <Tab
            id="categories"
            active={activeTab === "categories"}
            onClick={setActiveTab}
          >
            Categories
          </Tab>
          <Tab
            id="calculators"
            active={activeTab === "calculators"}
            onClick={setActiveTab}
          >
            Calculators
          </Tab>
        </div>
        {/* Global theme toggle exists in layout; removed local toggle */}
      </div>

      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Wallet}
            label="Balance (Month)"
            value={formatCurrency(overview?.balance || 0)}
            color="bg-stone-200 dark:bg-stone-800"
          />
          <StatCard
            icon={TrendingUp}
            label="Income (Month)"
            value={formatCurrency(overview?.income || 0)}
            color="bg-green-200/60 dark:bg-green-900/40"
          />
          <StatCard
            icon={TrendingDown}
            label="Expense (Month)"
            value={formatCurrency(overview?.expense || 0)}
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
                    {formatCurrency(t.amount)}
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
      )}

      {activeTab === "transactions" && (
        <div className="grid gap-4">
          <TransactionForm
            categories={categories}
            projects={projects}
            onCreated={refreshTransactions}
          />
          <Card>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="px-3 py-2 rounded-md bg-stone-100 dark:bg-stone-800"
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
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
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
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
                  {filteredTx.map((t) => (
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
                          className={`px-2 py-0.5 rounded text-xs ${
                            t.type === "INCOME"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="py-2">{t.category?.name || "—"}</td>
                      <td className="py-2">{t.description || "—"}</td>
                      <td className="py-2 text-right font-semibold">
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                  {filteredTx.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 text-center text-stone-500"
                      >
                        No transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "budgets" && (
        <div className="grid gap-4">
          <Card>
            <SectionTitle>Create Monthly Budget</SectionTitle>
            <div className="grid md:grid-cols-4 gap-3">
              <select
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                value={budgetForm.category}
                onChange={(e) =>
                  setBudgetForm({ ...budgetForm, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories
                  .filter((c) => c.type === "EXPENSE")
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <input
                type="number"
                min="1"
                max="12"
                placeholder="Month"
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                value={budgetForm.month || month}
                onChange={(e) =>
                  setBudgetForm({ ...budgetForm, month: e.target.value })
                }
              />
              <input
                type="number"
                min="2000"
                max="2100"
                placeholder="Year"
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                value={budgetForm.year || year}
                onChange={(e) =>
                  setBudgetForm({ ...budgetForm, year: e.target.value })
                }
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount"
                  className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800 flex-1"
                  value={budgetForm.amount}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, amount: e.target.value })
                  }
                />
                <button
                  className="px-3 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                  disabled={
                    savingBudget || !budgetForm.category || !budgetForm.amount
                  }
                  onClick={async () => {
                    try {
                      setSavingBudget(true);
                      await budgetService.createBudget({
                        category: budgetForm.category,
                        month: Number(budgetForm.month || month),
                        year: Number(budgetForm.year || year),
                        amount: Number(budgetForm.amount),
                      });
                      setBudgets(
                        await budgetService.listBudgets({ month, year })
                      );
                      await refreshProgress(budgetForm.category);
                      setBudgetForm({
                        category: "",
                        month: "",
                        year: "",
                        amount: "",
                      });
                    } finally {
                      setSavingBudget(false);
                    }
                  }}
                >
                  {savingBudget ? "Saving..." : "Create"}
                </button>
              </div>
            </div>
          </Card>
          {categories
            .filter((c) => c.type === "EXPENSE")
            .map((c) => (
              <Card key={c._id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-stone-500">Monthly budget</p>
                  </div>
                  <button
                    onClick={() => refreshProgress(c._id)}
                    className="text-xs px-3 py-1 rounded bg-stone-200 dark:bg-stone-800"
                  >
                    Refresh
                  </button>
                </div>
                <div className="mt-3">
                  <BudgetBar
                    spent={progress[c._id]?.spent || 0}
                    total={progress[c._id]?.budgetAmount || 0}
                  />
                  <div className="mt-2 text-xs text-stone-500">
                    {formatCurrency(progress[c._id]?.spent || 0)} /{" "}
                    {formatCurrency(progress[c._id]?.budgetAmount || 0)}
                  </div>
                </div>
              </Card>
            ))}
          {categories.filter((c) => c.type === "EXPENSE").length === 0 && (
            <p className="text-sm text-stone-500">No expense categories yet.</p>
          )}
          {budgets.length > 0 && (
            <Card>
              <SectionTitle>Existing Budgets (This Month)</SectionTitle>
              <ul className="text-sm space-y-1">
                {budgets.map((b) => (
                  <li key={b._id} className="flex justify-between">
                    <span>
                      {categories.find((c) => c._id === b.category)?.name ||
                        "—"}
                    </span>
                    <span>{formatCurrency(b.amount)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {activeTab === "goals" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="sm:col-span-2 xl:col-span-3">
            <GoalForm onCreated={refreshGoals} />
          </div>
          {goals.map((g) => {
            const current = (g.contributions || []).reduce(
              (sum, c) => sum + (c.amount || 0),
              0
            );
            return (
              <Card key={g._id}>
                <SectionTitle>{g.name}</SectionTitle>
                <BudgetBar spent={current} total={g.targetAmount || 0} />
                <div className="mt-2 text-sm">
                  {formatCurrency(current)} / {formatCurrency(g.targetAmount)}
                </div>
              </Card>
            );
          })}
          {goals.length === 0 && (
            <p className="text-sm text-stone-500">No goals</p>
          )}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="grid gap-4">
          <Card>
            <div className="grid md:grid-cols-3 gap-3">
              <input
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                placeholder="Project name"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, name: e.target.value })
                }
              />
              <input
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                placeholder="Client (optional)"
                value={projectForm.client}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, client: e.target.value })
                }
              />
              <div className="flex items-center justify-end">
                <button
                  className="px-3 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                  disabled={savingProject || !projectForm.name}
                  onClick={async () => {
                    try {
                      setSavingProject(true);
                      await projectsService.createProject({
                        name: projectForm.name,
                        client: projectForm.client || undefined,
                      });
                      setProjectForm({ name: "", client: "" });
                      await refreshProjects();
                    } finally {
                      setSavingProject(false);
                    }
                  }}
                >
                  {savingProject ? "Saving..." : "Create"}
                </button>
              </div>
            </div>
          </Card>
          {projects.map((p) => (
            <Card key={p._id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-stone-500">{p.client || "—"}</p>
                </div>
                <button
                  className="text-xs px-3 py-1 rounded bg-stone-200 dark:bg-stone-800"
                  onClick={async () =>
                    setProfit({
                      ...profit,
                      [p._id]: await projectsService.getProfitability(p._id),
                    })
                  }
                >
                  View Profitability
                </button>
              </div>
              {profit[p._id] && (
                <div className="mt-3 text-sm">
                  <div>Income: {formatCurrency(profit[p._id].totalIncome)}</div>
                  <div>
                    Expense: {formatCurrency(profit[p._id].totalExpense)}
                  </div>
                  <div className="font-semibold">
                    Profit: {formatCurrency(profit[p._id].profit)}
                  </div>
                </div>
              )}
            </Card>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-stone-500">No projects</p>
          )}
        </div>
      )}

      {activeTab === "categories" && (
        <div className="grid gap-4">
          <Card>
            <SectionTitle>Create Category</SectionTitle>
            <div className="grid md:grid-cols-3 gap-3">
              <input
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
              />
              <select
                className="px-3 py-2 rounded bg-stone-100 dark:bg-stone-800"
                value={categoryForm.type}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, type: e.target.value })
                }
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              <div className="flex items-center justify-end">
                <button
                  className="px-3 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                  disabled={savingCategory || !categoryForm.name}
                  onClick={async () => {
                    try {
                      setSavingCategory(true);
                      await catService.createCategory({
                        name: categoryForm.name.trim(),
                        type: categoryForm.type,
                      });
                      setCategoryForm({ name: "", type: "EXPENSE" });
                      await refreshCategories();
                    } finally {
                      setSavingCategory(false);
                    }
                  }}
                >
                  {savingCategory ? "Saving..." : "Create"}
                </button>
              </div>
            </div>
          </Card>
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <SectionTitle>Income Categories</SectionTitle>
                <ul className="text-sm space-y-1">
                  {categories
                    .filter((c) => c.type === "INCOME")
                    .map((c) => (
                      <li key={c._id}>{c.name}</li>
                    ))}
                </ul>
              </div>
              <div>
                <SectionTitle>Expense Categories</SectionTitle>
                <ul className="text-sm space-y-1">
                  {categories
                    .filter((c) => c.type === "EXPENSE")
                    .map((c) => (
                      <li key={c._id}>{c.name}</li>
                    ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "calculators" && (
        <div className="grid gap-4 max-w-3xl">
          <Card>
            <SectionTitle>Contract vs Full-Time</SectionTitle>
            <button
              className="px-3 py-2 rounded bg-stone-200 dark:bg-stone-800 text-sm"
              onClick={async () => {
                const res = await calculatorsService.contractVsFullTime({
                  contract: {
                    dayRate: 600,
                    daysPerWeek: 5,
                    weeks: 46,
                    taxRate: 0.35,
                  },
                  fullTime: {
                    salary: 150000,
                    bonus: 10000,
                    stockValue: 15000,
                    taxRate: 0.32,
                  },
                });
                alert(`Net diff: ${formatCurrency(res.differenceNet)}`);
              }}
            >
              Run Example
            </button>
          </Card>

          <Card>
            <SectionTitle>FIRE Calculator</SectionTitle>
            <button
              className="px-3 py-2 rounded bg-stone-200 dark:bg-stone-800 text-sm"
              onClick={async () => {
                const res = await calculatorsService.fire({
                  currentSavings: 50000,
                  monthlyContribution: 2000,
                  expectedReturnRate: 0.05,
                  withdrawalRate: 0.04,
                  annualExpenses: 60000,
                  years: 25,
                });
                alert(
                  `Projected NW: ${formatCurrency(
                    res.projectedNetWorth
                  )} | Progress: ${(res.progress * 100).toFixed(1)}%`
                );
              }}
            >
              Run Example
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
