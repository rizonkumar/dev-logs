import React, { useEffect, useMemo, useState } from "react";
import DevLogsHeader from "../components/DevLogsHeader";
import { getOverview } from "../services/finance/dashboardService";
import txService from "../services/finance/transactionsService";
import catService from "../services/finance/categoriesService";
import budgetService from "../services/finance/budgetsService";
import goalsService from "../services/finance/goalsService";
import projectsService from "../services/finance/projectsService";
import Loader from "../components/Loader";
import FinanceCurrencyPicker from "../components/finance/FinanceCurrencyPicker";
import FinanceDashboard from "../components/finance/FinanceDashboard";
import TransactionsSection from "../components/finance/page/TransactionsSection";
import BudgetsEditor from "../components/finance/page/BudgetsEditor";
import GoalsSection from "../components/finance/page/GoalsSection";
import CategoriesManager from "../components/finance/page/CategoriesManager";
import FinanceTab from "../components/finance/page/FinanceTab";
import BillsSection from "../components/finance/page/BillsSection";
import {
  CircleDollarSign,
  TrendingUp,
  Wallet,
  CalendarClock,
} from "lucide-react";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [overview, setOverview] = useState(null);
  const [recent, setRecent] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [txTotal, setTxTotal] = useState(0);
  const [txPage, setTxPage] = useState(1);
  const [txLimit, setTxLimit] = useState(25);
  const [filters, setFilters] = useState({ type: "", q: "" });

  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [progress, setProgress] = useState({});

  const [goals, setGoals] = useState([]);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(
    () => JSON.parse(localStorage.getItem("userInfo"))?.financeCurrency || "USD"
  );

  // removed unused local form states (moved into extracted components)

  const month = useMemo(() => new Date().getMonth() + 1, []);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.allSettled([
        (async () => {
          try {
            const ov = await getOverview();
            setOverview(ov);
            setRecent(ov.recentTransactions || []);
          } catch (e) {
            console.error("Error fetching overview", e);
          }
        })(),
        (async () => {
          try {
            setCategories(await catService.listCategories());
          } catch (e) {
            console.error("Error fetching categories", e);
          }
        })(),
        (async () => {
          try {
            setBudgets(await budgetService.listBudgets({ month, year }));
          } catch (e) {
            console.error("Error fetching budgets", e);
          }
        })(),
        (async () => {
          try {
            setGoals(await goalsService.listGoals());
          } catch (e) {
            console.error("Error fetching goals", e);
          }
        })(),
        (async () => {
          try {
            setProjects(await projectsService.listProjects());
          } catch (e) {
            console.error("Error fetching projects", e);
          }
        })(),
        (async () => {
          try {
            const res = await txService.listTransactions({
              limit: txLimit,
              page: txPage,
            });
            setTransactions(res.items || []);
            setTxTotal(res.total || 0);
          } catch (e) {
            console.error("Error fetching transactions", e);
          }
        })(),
      ]);
      setLoading(false);
    })();
  }, [month, year, txLimit, txPage]);

  const refreshOverview = async () => {
    try {
      const ov = await getOverview();
      setOverview(ov);
      setRecent(ov.recentTransactions || []);
    } catch {
      console.error("Failed to refresh overview");
    }
  };

  const refreshTransactions = async () => {
    try {
      const res = await txService.listTransactions({
        limit: txLimit,
        page: txPage,
      });
      setTransactions(res.items || []);
      setTxTotal(res.total || 0);
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

  const addGoalContribution = async (goalId, amount) => {
    const num = Number(amount);
    if (Number.isNaN(num) || num <= 0) return;
    await goalsService.addContribution(goalId, {
      amount: num,
      date: new Date().toISOString().slice(0, 10),
    });
    await refreshGoals();
  };

  const refreshCategories = async () => {
    try {
      setCategories(await catService.listCategories());
    } catch (e) {
      console.error("Failed to refresh categories", e);
    }
  };

  // removed unused refreshProjects (no in-page usage)

  const refreshProgress = async (categoryId) => {
    const data = await budgetService.getBudgetProgress({
      categoryId,
      month,
      year,
    });
    setProgress((p) => ({ ...p, [categoryId]: data }));
  };

  const refreshAllProgress = async () => {
    try {
      const expenseCategoryIds = (categories || [])
        .filter((c) => c.type === "EXPENSE")
        .map((c) => c._id);

      if (expenseCategoryIds.length === 0) {
        setProgress({});
        return;
      }

      const entries = await Promise.all(
        expenseCategoryIds.map(async (id) => {
          const data = await budgetService.getBudgetProgress({
            categoryId: id,
            month,
            year,
          });
          return [id, data];
        })
      );

      setProgress((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    } catch (e) {
      console.error("Failed to refresh all budget progress", e);
    }
  };

  // When the Budgets tab is opened, fetch progress for all expense categories
  useEffect(() => {
    if (!loading && activeTab === "budgets") {
      refreshAllProgress();
    }
  }, [activeTab, loading, month, year, categories]);

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

  return (
    <div className="p-4 sm:p-6">
      <DevLogsHeader />

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <FinanceTab
            id="dashboard"
            active={activeTab === "dashboard"}
            onClick={setActiveTab}
            icon={Wallet}
            variant="dashboard"
          >
            Dashboard
          </FinanceTab>
          <FinanceTab
            id="transactions"
            active={activeTab === "transactions"}
            onClick={setActiveTab}
            icon={TrendingUp}
            variant="transactions"
          >
            Transactions
          </FinanceTab>
          <FinanceTab
            id="budgets"
            active={activeTab === "budgets"}
            onClick={setActiveTab}
            icon={CircleDollarSign}
            variant="budgets"
          >
            Budgets
          </FinanceTab>
          <FinanceTab
            id="bills"
            active={activeTab === "bills"}
            onClick={setActiveTab}
            icon={CalendarClock}
            variant="bills"
          >
            Bills
          </FinanceTab>
          <FinanceTab
            id="goals"
            active={activeTab === "goals"}
            onClick={setActiveTab}
            icon={TrendingUp}
            variant="goals"
          >
            Goals
          </FinanceTab>
          <FinanceTab
            id="categories"
            active={activeTab === "categories"}
            onClick={setActiveTab}
            variant="categories"
          >
            Categories
          </FinanceTab>
        </div>
        <div className="flex items-center gap-3">
          <FinanceCurrencyPicker current={currency} onChange={setCurrency} />
        </div>
      </div>

      {loading ? (
        <Loader label="Loading finance data..." />
      ) : activeTab === "dashboard" ? (
        <FinanceDashboard
          overview={overview}
          goals={goals}
          recent={recent}
          currency={currency}
          onRefresh={async () => {
            await Promise.allSettled([
              (async () => {
                try {
                  const ov = await getOverview();
                  setOverview(ov);
                  setRecent(ov.recentTransactions || []);
                } catch (e) {
                  console.error("Error refreshing overview", e);
                }
              })(),
              (async () => {
                try {
                  setGoals(await goalsService.listGoals());
                } catch (e) {
                  console.error("Error refreshing goals", e);
                }
              })(),
            ]);
          }}
        />
      ) : null}

      {!loading && activeTab === "transactions" && (
        <TransactionsSection
          categories={categories}
          projects={projects}
          onCreated={refreshTransactions}
          onCategoryCreated={refreshCategories}
          transactions={filteredTx}
          currency={currency}
          filters={filters}
          onChangeFilters={setFilters}
          onDelete={async (id) => {
            await txService.deleteTransaction(id);
            await refreshTransactions();
          }}
          pagination={{
            page: txPage,
            limit: txLimit,
            total: txTotal,
            onPageChange: setTxPage,
            onLimitChange: setTxLimit,
          }}
        />
      )}

      {!loading && activeTab === "budgets" && (
        <BudgetsEditor
          categories={categories}
          budgets={budgets}
          month={month}
          year={year}
          currency={currency}
          progressByCategory={progress}
          onCreateCategory={async ({ name, type }) => {
            const createdCat = await catService.createCategory({ name, type });
            await refreshCategories();
            return createdCat;
          }}
          onCreateBudget={async (payload) => {
            await budgetService.createBudget(payload);
            setBudgets(await budgetService.listBudgets({ month, year }));
            await refreshProgress(payload.category);
          }}
          onUpdateBudget={async (id, updates) => {
            const updated = await budgetService.updateBudget(id, updates);
            setBudgets(await budgetService.listBudgets({ month, year }));
            const categoryId = updated?.category?._id || updated?.category;
            if (categoryId) await refreshProgress(categoryId);
          }}
          onDeleteBudget={async (id, categoryId) => {
            await budgetService.deleteBudget(id);
            setBudgets(await budgetService.listBudgets({ month, year }));
            if (categoryId) await refreshProgress(categoryId);
          }}
          onRefreshProgress={(categoryId) => refreshProgress(categoryId)}
        />
      )}

      {!loading && activeTab === "goals" && (
        <GoalsSection
          goals={goals}
          currency={currency}
          onAddContribution={addGoalContribution}
          onCreated={refreshGoals}
        />
      )}

      {!loading && activeTab === "bills" && (
        <BillsSection categories={categories} currency={currency} />
      )}

      {!loading && activeTab === "categories" && (
        <CategoriesManager
          categories={categories}
          onCreate={async ({ name, type }) => {
            await catService.createCategory({ name, type });
            await refreshCategories();
            return true;
          }}
        />
      )}
    </div>
  );
}
