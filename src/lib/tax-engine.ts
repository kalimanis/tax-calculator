import type { AgeGroup, Bracket, BracketResult, FiscalYear, TaxInput, TaxResult } from "./types";
import { BRACKETS_2025, BRACKETS_2026_BASE, TAX_REDUCTION_BASE, get2026ChildrenRates } from "./constants";
import { round2 } from "./utils";

export function getBrackets(
  year: FiscalYear,
  children: number,
  ageGroup: AgeGroup
): Bracket[] {
  if (year === 2025) {
    return BRACKETS_2025.map((b) => ({ ...b }));
  }

  // 2026: start with base brackets
  const brackets = BRACKETS_2026_BASE.map((b) => ({ ...b }));

  // Apply children rate adjustments (first 3 brackets only)
  const childRates = get2026ChildrenRates(children);
  brackets[0].rate = childRates[0];
  brackets[1].rate = childRates[1];
  brackets[2].rate = childRates[2];

  // Apply youth rates if more favorable
  if (ageGroup === "young") {
    // ≤25: 0% on first €20.000 (brackets 0 and 1)
    brackets[0].rate = 0;
    brackets[1].rate = 0;
  } else if (ageGroup === "middle") {
    // 26-30: 9% flat on first €20.000 (brackets 0 and 1)
    // Only override if more favorable
    brackets[0].rate = Math.min(brackets[0].rate, 0.09);
    brackets[1].rate = Math.min(brackets[1].rate, 0.09);
  }

  return brackets;
}

export function computeProgressiveTax(
  taxableIncome: number,
  brackets: Bracket[]
): BracketResult[] {
  const results: BracketResult[] = [];
  let remaining = taxableIncome;

  for (const bracket of brackets) {
    if (remaining <= 0) break;

    const bracketWidth = bracket.max === Infinity
      ? remaining
      : bracket.max - bracket.min;
    const taxableAmount = Math.min(remaining, bracketWidth);
    const tax = round2(taxableAmount * bracket.rate);

    results.push({
      min: bracket.min,
      max: bracket.max,
      rate: bracket.rate,
      baseRate: bracket.rate,
      taxableAmount,
      tax,
    });

    remaining -= taxableAmount;
  }

  return results;
}

export function calculateTaxReduction(
  taxableIncome: number,
  children: number
): number {
  const base =
    children <= 4
      ? TAX_REDUCTION_BASE[children]
      : 1340 + 220 * (children - 4);

  if (taxableIncome <= 12000 || children >= 5) {
    return base;
  }

  const decrease = 20 * ((taxableIncome - 12000) / 1000);
  return Math.max(0, round2(base - decrease));
}

export function calculatePrepayment(
  incomeTax: number,
  isFirstYear: boolean
): number {
  if (isFirstYear) return round2(incomeTax * 0.275);
  return round2(incomeTax * 0.55);
}

export function calculateTax(input: TaxInput): TaxResult {
  // 1. Taxable income
  const taxableIncome = Math.max(
    0,
    input.grossIncome - input.efkaAnnual - input.otherExpenses
  );

  // 2. Get brackets for year/children/age
  const brackets = getBrackets(
    input.fiscalYear,
    input.children,
    input.ageGroup
  );

  // Store base rates before new business modification
  const baseRates = brackets.map((b) => b.rate);

  // 3. Apply new business reduction if applicable (ατομική only)
  if (
    input.regime === "atomiki" &&
    input.yearsInBusiness <= 3 &&
    input.grossIncome <= 10000
  ) {
    brackets[0].rate = brackets[0].rate * 0.5;
  }

  // 4. Compute progressive tax
  const bracketResults = computeProgressiveTax(taxableIncome, brackets);

  // Set baseRate to the rate before new business modification
  bracketResults.forEach((br, i) => {
    br.baseRate = baseRates[i];
  });

  const grossTax = bracketResults.reduce((sum, b) => sum + b.tax, 0);

  // 5. Tax reduction (μπλοκάκι only)
  let taxReduction = 0;
  if (input.regime === "mplokaki") {
    taxReduction = Math.min(
      grossTax,
      calculateTaxReduction(taxableIncome, input.children)
    );
  }

  const netTax = round2(Math.max(0, grossTax - taxReduction));

  // 6. Prepayment (ατομική only)
  let prepayment = 0;
  if (input.regime === "atomiki") {
    prepayment = calculatePrepayment(netTax, input.isFirstYearFiling);
  }

  // 7. Withholding (μπλοκάκι)
  const withholding20 =
    input.regime === "mplokaki" ? round2(input.grossIncome * 0.2) : 0;

  // 8. Results
  const totalObligation = round2(netTax + prepayment);
  const effectiveRate =
    taxableIncome > 0 ? round2((netTax / taxableIncome) * 100) : 0;
  const netIncome = round2(
    input.grossIncome -
      input.efkaAnnual -
      input.otherExpenses -
      netTax -
      prepayment
  );
  const balanceDue =
    input.regime === "mplokaki"
      ? round2(netTax - withholding20)
      : round2(netTax + prepayment);

  return {
    taxableIncome,
    brackets: bracketResults,
    grossTax: round2(grossTax),
    taxReduction: round2(taxReduction),
    netTax,
    prepayment,
    totalObligation,
    effectiveRate,
    netIncome,
    withholding20,
    balanceDue,
    efkaAnnual: input.efkaAnnual,
  };
}
