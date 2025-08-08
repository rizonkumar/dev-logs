#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:5001}

echo "[1/15] Checking API availability at $BASE_URL ..."
if ! curl -s "$BASE_URL/" | grep -q "Welcome to the Dev-Logs API!"; then
  echo "API is not reachable at $BASE_URL. Please ensure the server is running." >&2
  exit 1
fi

timestamp=$(date +%s)
# Use a regex-compliant email (no '+') to satisfy backend validation
EMAIL="finance_test_${timestamp}@example.com"
NAME="Finance Test"
PASSWORD="Passw0rd!"

echo "[2/15] Registering test user $EMAIL ..."
register_response=$(curl -s -X POST "$BASE_URL/api/users/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$register_response" | node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);console.log(d.token||"");}catch(e){process.exit(1);}})')

if [ -z "$TOKEN" ]; then
  echo "Registration failed or token missing. Response:" >&2
  echo "$register_response" >&2
  exit 1
fi
echo "Obtained JWT"

auth_curl() { curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "$@"; }

create_category() {
  local name="$1"; local type="$2"; local resp id
  resp=$(auth_curl -X POST "$BASE_URL/api/finance/categories" -d "{\"name\":\"$name\",\"type\":\"$type\"}")
  id=$(echo "$resp" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);console.log(d._id||"");}catch(e){process.exit(1);}})')
  if [ -z "$id" ]; then echo "Failed creating category $name. Resp: $resp" >&2; exit 1; fi
  echo "$id"
}

echo "[3/15] Creating categories ..."
catSalary=$(create_category "Salary" "INCOME")
catFreelance=$(create_category "Freelance" "INCOME")
catContract=$(create_category "Contract" "INCOME")
catRSU=$(create_category "RSUs" "INCOME")
catSideProject=$(create_category "Side Project" "INCOME")
catSponsorship=$(create_category "Sponsorship" "INCOME")
catFood=$(create_category "Food" "EXPENSE")
catUtilities=$(create_category "Utilities" "EXPENSE")
catSaaS=$(create_category "SaaS Subscriptions" "EXPENSE")

echo "[4/15] Creating project ..."
project_resp=$(auth_curl -X POST "$BASE_URL/api/finance/projects" -d '{"name":"Client ACME App","client":"ACME"}')
projectId=$(echo "$project_resp" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);console.log(d._id||"");}catch(e){process.exit(1);}})')
if [ -z "$projectId" ]; then echo "Failed creating project. Resp: $project_resp" >&2; exit 1; fi

TODAY=$(date +%F)
MONTH=$(date +%m | sed 's/^0*//')
YEAR=$(date +%Y)

echo "[5/15] Creating budget for Food ($MONTH/$YEAR) ..."
budget_resp=$(auth_curl -X POST "$BASE_URL/api/finance/budgets" -d "{\"category\":\"$catFood\",\"month\":$MONTH,\"year\":$YEAR,\"amount\":500}")
budgetId=$(echo "$budget_resp" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);console.log(d._id||"");}catch(e){process.exit(1);}})')
if [ -z "$budgetId" ]; then echo "Failed creating budget. Resp: $budget_resp" >&2; exit 1; fi

echo "[6/15] Creating income transaction (Freelance 1200) ..."
income1=$(auth_curl -X POST "$BASE_URL/api/finance/transactions" -d "{\"type\":\"INCOME\",\"incomeType\":\"FREELANCE\",\"amount\":1200,\"transactionDate\":\"$TODAY\",\"category\":\"$catFreelance\",\"project\":\"$projectId\",\"description\":\"Freelance payment: ACME\"}")

echo "[7/15] Creating business expense (SaaS 50) ..."
expense1=$(auth_curl -X POST "$BASE_URL/api/finance/transactions" -d "{\"type\":\"EXPENSE\",\"amount\":50,\"transactionDate\":\"$TODAY\",\"category\":\"$catSaaS\",\"project\":\"$projectId\",\"isBusinessExpense\":true,\"description\":\"SaaS - Hosting\"}")

echo "[8/15] Creating personal expense (Food 35) ..."
expense2=$(auth_curl -X POST "$BASE_URL/api/finance/transactions" -d "{\"type\":\"EXPENSE\",\"amount\":35,\"transactionDate\":\"$TODAY\",\"category\":\"$catFood\",\"description\":\"Lunch\"}")

echo "[9/15] Getting budget progress for Food ..."
progress=$(auth_curl "$BASE_URL/api/finance/budgets/progress?categoryId=$catFood&month=$MONTH&year=$YEAR")

echo "[10/15] Creating savings goal ..."
goal_resp=$(auth_curl -X POST "$BASE_URL/api/finance/goals" -d '{"name":"New Laptop","targetAmount":2000}')
goalId=$(echo "$goal_resp" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const d=JSON.parse(s);console.log(d._id||"");}catch(e){process.exit(1);}})')
if [ -z "$goalId" ]; then echo "Failed creating goal. Resp: $goal_resp" >&2; exit 1; fi

echo "[11/15] Adding goal contribution ..."
contrib_resp=$(auth_curl -X POST "$BASE_URL/api/finance/goals/$goalId/contributions" -d "{\"amount\":200,\"date\":\"$TODAY\",\"note\":\"Initial deposit\"}")

echo "[12/15] Dashboard overview ..."
overview=$(auth_curl "$BASE_URL/api/finance/dashboard/overview")

echo "[13/15] Project profitability ..."
profit=$(auth_curl "$BASE_URL/api/finance/projects/$projectId/profitability")

echo "[14/15] Calculators (contract vs full-time) ..."
contract_vs=$(curl -s -X POST "$BASE_URL/api/finance/calculators/contract-vs-fulltime" -H "Content-Type: application/json" -d '{"contract":{"dayRate":600,"daysPerWeek":5,"weeks":46,"taxRate":0.35},"fullTime":{"salary":150000,"bonus":10000,"stockValue":15000,"taxRate":0.32}}')

echo "[15/15] Calculators (FIRE) ..."
fire=$(curl -s -X POST "$BASE_URL/api/finance/calculators/fire" -H "Content-Type: application/json" -d '{"currentSavings":50000,"monthlyContribution":2000,"expectedReturnRate":0.05,"withdrawalRate":0.04,"annualExpenses":60000,"years":25}')

echo "\n--- Seed Summary ---"
echo "User: $EMAIL"
echo "Project ID: $projectId"
echo "Categories: Food=$catFood, SaaS=$catSaaS, Freelance=$catFreelance"
echo "Budget ID: $budgetId"

echo "\nBudget Progress (Food)"
echo "$progress"

echo "\nDashboard Overview"
echo "$overview"

echo "\nProject Profitability"
echo "$profit"

echo "\nCalculator: Contract vs Full-Time"
echo "$contract_vs"

echo "\nCalculator: FIRE"
echo "$fire"

echo "\nDone."


