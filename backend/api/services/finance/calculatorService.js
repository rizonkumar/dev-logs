// Contract vs Full-Time Calculator and FIRE Calculator utilities

const computeContractVsFullTime = ({
  contract: {
    dayRate,
    daysPerWeek = 5,
    weeks = 48,
    benefitsValue = 0,
    taxRate = 0,
  },
  fullTime: {
    salary,
    bonus = 0,
    stockValue = 0,
    benefitsValue: ftBenefitsValue = 0,
    taxRate: ftTaxRate = 0,
  },
}) => {
  const grossContract = dayRate * daysPerWeek * weeks;
  const netContract = grossContract * (1 - taxRate) + benefitsValue;

  const grossFullTime = salary + bonus + stockValue;
  const netFullTime = grossFullTime * (1 - ftTaxRate) + ftBenefitsValue;

  return {
    grossContract,
    netContract,
    grossFullTime,
    netFullTime,
    differenceNet: netContract - netFullTime,
  };
};

// FIRE Calculator based on simple 4% rule assumptions
const computeFireProgress = ({
  currentSavings = 0,
  monthlyContribution = 0,
  expectedReturnRate = 0.05, // 5% annual
  withdrawalRate = 0.04, // 4% rule
  annualExpenses,
  years = 30,
}) => {
  const targetNumber = annualExpenses / withdrawalRate;
  // Future value of a series formula: FV = P*(1+r)^n + PMT*(((1+r)^n - 1)/r)
  const r = expectedReturnRate;
  const n = years;
  const pmt = monthlyContribution * 12;
  const futureValue =
    currentSavings * Math.pow(1 + r, n) + pmt * ((Math.pow(1 + r, n) - 1) / r);
  const progress = Math.min(1, futureValue / targetNumber);
  return { targetNumber, projectedNetWorth: futureValue, progress };
};

module.exports = { computeContractVsFullTime, computeFireProgress };
