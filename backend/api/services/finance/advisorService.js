const dashboardService = require("./dashboardService");
const budgetService = require("./budgetService");
const categoryService = require("./categoryService");
const goalsService = require("./savingsGoalService");
const axios = require("axios");

const buildMonthlyContext = async (userId, { month, year }) => {
  const [overview, categories, budgets, goals] = await Promise.all([
    dashboardService.getOverview(userId),
    categoryService.listCategories(userId),
    budgetService.listBudgets(userId, { month, year }),
    goalsService.listGoals(userId),
  ]);

  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");

  const progressEntries = await Promise.all(
    expenseCategories.map(async (cat) => {
      const prog = await budgetService.getBudgetProgress(userId, {
        categoryId: cat._id,
        month,
        year,
      });
      const relatedBudget = budgets.find(
        (b) => String(b.category?._id || b.category) === String(cat._id)
      );
      return {
        categoryId: String(cat._id),
        categoryName: cat.name,
        spent: prog.spent || 0,
        budgetAmount: prog.budgetAmount || 0,
        currency:
          (relatedBudget && relatedBudget.currency) || prog.currency || "USD",
      };
    })
  );

  const goalsSummary = (goals || []).map((g) => {
    const current = (g.contributions || []).reduce(
      (sum, c) => sum + (c.amount || 0),
      0
    );
    return {
      name: g.name,
      targetAmount: g.targetAmount || 0,
      currentAmount: current,
      targetDate: g.targetDate || null,
    };
  });

  return {
    month,
    year,
    totals: {
      income: overview?.income || 0,
      expense: overview?.expense || 0,
      balance: overview?.balance || 0,
    },
    expenseByCategory: progressEntries,
    upcomingBillsCount: (overview?.upcomingBills || []).length,
    goals: goalsSummary,
  };
};

const generateHeuristicAdvice = (context, question) => {
  const { expenseByCategory, totals } = context;

  const analyzed = expenseByCategory.map((e) => ({
    ...e,
    ratio: e.budgetAmount > 0 ? e.spent / e.budgetAmount : e.spent > 0 ? 2 : 0,
    delta: e.spent - (e.budgetAmount || 0),
  }));

  analyzed.sort((a, b) => b.ratio - a.ratio);

  const suggestions = [];
  const insights = [];

  for (const item of analyzed.slice(0, 3)) {
    if (item.spent <= 0) continue;

    if (item.budgetAmount > 0 && item.spent > item.budgetAmount) {
      const target = Math.max(0, Math.round(item.budgetAmount * 0.9));
      suggestions.push({
        categoryName: item.categoryName,
        targetMonthlyAmount: target,
        rationale: `Spent ${Math.round(item.spent)} vs budget ${Math.round(
          item.budgetAmount
        )}. Reduce target by ~10% to curb overspending.`,
      });
      insights.push(
        `${item.categoryName}: over by ${Math.round(
          item.spent - item.budgetAmount
        )} (${(item.ratio * 100).toFixed(0)}% of budget)`
      );
    } else if (item.budgetAmount === 0 && item.spent > 0) {
      const target = Math.round(item.spent * 0.8);
      suggestions.push({
        categoryName: item.categoryName,
        targetMonthlyAmount: target,
        rationale: `No budget set but spent ${Math.round(
          item.spent
        )}. Set a cap at ~80% of last spend to encourage savings.`,
      });
      insights.push(
        `${item.categoryName}: no budget but spent ${Math.round(
          item.spent
        )} — consider setting a cap`
      );
    }
  }

  const tips = [
    "Schedule upcoming bills as SCHEDULED transactions to avoid surprises.",
    "Move discretionary purchases to categories with explicit monthly caps.",
    "Review subscriptions and negotiate rates to reduce fixed costs.",
  ];

  const followUps = [
    "Would you like me to apply these budget changes for next month?",
    "Do you want deeper analysis using detailed descriptions (more personal)?",
  ];

  const assumptions = [
    "This advice uses aggregate monthly data and category totals only.",
    "Discretionary vs. essential categories were not explicitly labeled.",
  ];

  return {
    insights,
    suggestedBudgetChanges: suggestions,
    tips,
    followUps,
    assumptions,
    confidence: 0.6,
  };
};

const getBudgetAdvice = async (userId, { question, month, year, privacy }) => {
  const now = new Date();
  const m = Number(month) || now.getMonth() + 1;
  const y = Number(year) || now.getFullYear();

  const context = await buildMonthlyContext(userId, { month: m, year: y });

  const hfToken = process.env.HUGGING_FACE_API_KEY;
  const modelId =
    process.env.AI_MODEL_ID || "mistralai/Mistral-7B-Instruct-v0.2";

  if (!hfToken) {
    const advice = generateHeuristicAdvice(context, question);
    return {
      model: "heuristic-v1",
      advice,
      contextHints: { month: m, year: y },
    };
  }

  try {
    const prompt = renderPrompt({
      context,
      question,
      privacy: privacy || "aggregate",
    });
    const completion = await callHuggingFace({ modelId, prompt, hfToken });
    const parsed =
      safeParseAdvice(completion) || generateHeuristicAdvice(context, question);
    return {
      model: modelId,
      advice: parsed,
      contextHints: { month: m, year: y },
    };
  } catch (_) {
    const advice = generateHeuristicAdvice(context, question);
    return {
      model: "heuristic-v1",
      advice,
      contextHints: { month: m, year: y },
      error: "llm_failed",
    };
  }
};

module.exports = {
  getBudgetAdvice,
};

function renderPrompt({ context, question, privacy }) {
  const baseInstruction = `You are a seasoned personal finance coach.
Analyze the monthly context and propose concrete, safe, and practical ways to reduce expenses and increase savings.
Focus on category-level budget caps, not extreme measures.
Return STRICT JSON matching the schema with no extra text.`;

  const schema = {
    insights: ["string"],
    suggestedBudgetChanges: [
      { categoryName: "string", targetMonthlyAmount: 0, rationale: "string" },
    ],
    tips: ["string"],
    followUps: ["string"],
    assumptions: ["string"],
    confidence: 0.0,
  };

  const payload = {
    privacy,
    month: context.month,
    year: context.year,
    totals: context.totals,
    expenseByCategory: context.expenseByCategory.map((e) => ({
      categoryName: e.categoryName,
      spent: Math.round(e.spent),
      budgetAmount: Math.round(e.budgetAmount),
    })),
    goals: context.goals,
  };

  return [
    baseInstruction,
    `Question: ${question || "How can I save more this month?"}`,
    `Schema: ${JSON.stringify(schema)}`,
    `Context: ${JSON.stringify(payload)}`,
    "Answer as STRICT JSON only.",
  ].join("\n\n");
}

async function callHuggingFace({ modelId, prompt, hfToken }) {
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(
    modelId
  )}`;
  const { data } = await axios.post(
    url,
    {
      inputs: prompt,
      parameters: {
        max_new_tokens: 600,
        temperature: 0.3,
        return_full_text: false,
        top_p: 0.9,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    }
  );

  if (
    Array.isArray(data) &&
    data[0] &&
    typeof data[0].generated_text === "string"
  ) {
    return data[0].generated_text;
  }
  if (data && typeof data.generated_text === "string")
    return data.generated_text;
  if (typeof data === "string") return data;
  return JSON.stringify(data);
}

function safeParseAdvice(text) {
  if (!text || typeof text !== "string") return null;

  try {
    const firstChar = text.trim()[0];
    if (firstChar === "{" || firstChar === "[") {
      const parsed = JSON.parse(text);
      return normalizeAdvice(parsed);
    }
  } catch (_) {}

  const match = text.match(/[\[{][\s\S]*[\]}]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      return normalizeAdvice(parsed);
    } catch (_) {}
  }
  return null;
}

function normalizeAdvice(parsed) {
  const def = {
    insights: [],
    suggestedBudgetChanges: [],
    tips: [],
    followUps: [],
    assumptions: [],
    confidence: 0.5,
  };
  if (!parsed || typeof parsed !== "object") return def;
  return {
    insights: Array.isArray(parsed.insights) ? parsed.insights : [],
    suggestedBudgetChanges: Array.isArray(parsed.suggestedBudgetChanges)
      ? parsed.suggestedBudgetChanges.filter(Boolean).map((s) => ({
          categoryName: String(s.categoryName || "").trim(),
          targetMonthlyAmount: Number(s.targetMonthlyAmount) || 0,
          rationale: String(s.rationale || "").trim(),
        }))
      : [],
    tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    followUps: Array.isArray(parsed.followUps) ? parsed.followUps : [],
    assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions : [],
    confidence:
      typeof parsed.confidence === "number" &&
      parsed.confidence >= 0 &&
      parsed.confidence <= 1
        ? parsed.confidence
        : 0.5,
  };
}
