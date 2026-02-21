import type { SalaryInput, SalaryResult } from "./types";
import { getBrackets, computeProgressiveTax, calculateTaxReduction } from "./tax-engine";
import { getEfkaRates } from "./salary-constants";
import { round2 } from "./utils";

function computeEfka(
  grossMonthly: number,
  rate: number,
  ceilingMonthly: number
): number {
  return round2(Math.min(grossMonthly, ceilingMonthly) * rate);
}

function calculateGrossToNet(input: SalaryInput): SalaryResult {
  const { fiscalYear, monthlySalary, payFrequency, children, ageGroup, hasArticle5G } = input;
  const efkaRates = getEfkaRates(fiscalYear);
  const ceilingMonthly = efkaRates.ceiling;

  const grossMonthly = monthlySalary;
  const grossAnnual = round2(grossMonthly * payFrequency);

  // EFKA per payment (capped at ceiling), deducted from all payments including bonuses
  const efkaEmployeeMonthly = computeEfka(grossMonthly, input.efkaEmployeeRate, ceilingMonthly);
  const efkaEmployee = round2(efkaEmployeeMonthly * payFrequency);
  const efkaEmployerMonthly = computeEfka(grossMonthly, input.efkaEmployerRate, ceilingMonthly);
  const efkaEmployer = round2(efkaEmployerMonthly * payFrequency);

  // Taxable income = gross annual - employee EFKA
  const taxableIncome = Math.max(0, round2(grossAnnual - efkaEmployee));

  // Progressive tax
  const brackets = getBrackets(fiscalYear, children, ageGroup);
  const bracketResults = computeProgressiveTax(taxableIncome, brackets);
  const grossTax = round2(bracketResults.reduce((sum, b) => sum + b.tax, 0));

  // Art. 16 tax reduction
  const taxReduction = Math.min(grossTax, calculateTaxReduction(taxableIncome, children));

  // Net tax (with optional Art. 5G 50% reduction)
  let netTax = round2(Math.max(0, grossTax - taxReduction));
  if (hasArticle5G) {
    netTax = round2(netTax * 0.5);
  }

  // Monthly tax withholding (rounded per-payment, as payroll does)
  const monthlyTax = round2(netTax / payFrequency);
  const totalWithheld = round2(monthlyTax * payFrequency);
  const settlementDiff = round2(netTax - totalWithheld);

  // Net monthly = what the payslip shows (using rounded monthly tax)
  const taxableMonthly = round2(grossMonthly - efkaEmployeeMonthly);
  const netMonthly = round2(taxableMonthly - monthlyTax);
  const netAnnual = round2(netMonthly * payFrequency);

  // Precise annual net (based on exact annual tax, not monthly × pays)
  const netAnnualPrecise = round2(grossAnnual - efkaEmployee - netTax);

  const effectiveRate = taxableIncome > 0 ? round2((netTax / taxableIncome) * 100) : 0;
  const employerCost = round2(grossAnnual + efkaEmployer);

  return {
    grossAnnual,
    grossMonthly,
    efkaEmployee,
    efkaEmployer,
    taxableIncome,
    brackets: bracketResults,
    grossTax,
    taxReduction: round2(taxReduction),
    netTax,
    netAnnual,
    netMonthly,
    netAnnualPrecise,
    settlementDiff,
    effectiveRate,
    employerCost,
  };
}

function solveNetToGross(input: SalaryInput): SalaryResult {
  const targetNetMonthly = input.monthlySalary;
  // Binary search: find gross monthly that yields target net monthly
  let lo = targetNetMonthly;
  let hi = targetNetMonthly * 3;

  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const trial = calculateGrossToNet({ ...input, monthlySalary: mid, direction: "gross-to-net" });
    if (Math.abs(trial.netMonthly - targetNetMonthly) < 0.01) {
      return trial;
    }
    if (trial.netMonthly < targetNetMonthly) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  // Return best approximation
  return calculateGrossToNet({ ...input, monthlySalary: (lo + hi) / 2, direction: "gross-to-net" });
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  if (input.direction === "net-to-gross") {
    return solveNetToGross(input);
  }
  return calculateGrossToNet(input);
}
