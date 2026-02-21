import { describe, it, expect } from "vitest";
import { calculateTax, calculateTaxReduction, getBrackets } from "./tax-engine";
import type { TaxInput } from "./types";

const baseInput: TaxInput = {
  fiscalYear: 2025,
  regime: "mplokaki",
  grossIncome: 0,
  efkaAnnual: 0,
  otherExpenses: 0,
  children: 0,
  ageGroup: "standard",
  isFirstYearFiling: false,
  yearsInBusiness: 4,
  clientLocation: "domestic",
  domesticIncomeShare: 100,
};

describe("calculateTaxReduction", () => {
  it("base €777 for 0 children, decreases above €12K per whole €1K", () => {
    // taxableIncome = €22.372,15 → decrease = 20 * floor(10372.15/1000) = 20 * 10 = 200
    const reduction = calculateTaxReduction(22372.15, 0);
    expect(reduction).toBe(577);
  });

  it("returns full base for income ≤ €12K", () => {
    expect(calculateTaxReduction(12000, 0)).toBe(777);
    expect(calculateTaxReduction(10000, 2)).toBe(900);
  });

  it("returns full base for 5+ children regardless of income", () => {
    expect(calculateTaxReduction(50000, 5)).toBe(1560); // 1340 + 220
  });
});

describe("Example 1: Μπλοκάκι 2025, €22.372,15 taxable, 0 children", () => {
  it("calculates correct results", () => {
    const result = calculateTax({
      ...baseInput,
      grossIncome: 22372.15,
      efkaAnnual: 0,
      otherExpenses: 0,
      children: 0,
    });

    // Bracket 1: €10.000 × 9% = €900
    // Bracket 2: €10.000 × 22% = €2.200
    // Bracket 3: €2.372,15 × 28% = €664,20
    expect(result.grossTax).toBeCloseTo(3764.20, 1);

    // Reduction: base €777, decrease = 20 * floor(10372.15/1000) = 200 → 577
    expect(result.taxReduction).toBe(577);

    // Net tax = 3764.20 - 577 = 3187.20
    expect(result.netTax).toBeCloseTo(3187.20, 1);
  });
});

describe("Example 2: Ατομική Επιχείρηση 2025, €30.000 taxable, 2 children", () => {
  it("calculates correct results", () => {
    const result = calculateTax({
      ...baseInput,
      regime: "atomiki",
      grossIncome: 30000,
      children: 2,
    });

    // Gross tax: €900 + €2.200 + €2.800 = €5.900
    expect(result.grossTax).toBeCloseTo(5900, 0);

    // No tax reduction for ατομική
    expect(result.taxReduction).toBe(0);

    // Prepayment: €5.900 × 55% = €3.245
    expect(result.prepayment).toBeCloseTo(3245, 0);

    // Total: €9.145
    expect(result.totalObligation).toBeCloseTo(9145, 0);
  });
});

describe("Example 3: Μπλοκάκι 2026, €25.000 taxable, 2 children, age 35", () => {
  it("calculates correct results", () => {
    const result = calculateTax({
      ...baseInput,
      fiscalYear: 2026,
      grossIncome: 25000,
      children: 2,
      ageGroup: "standard",
    });

    // Bracket 1: €10.000 × 9% = €900
    // Bracket 2: €10.000 × 16% = €1.600 (reduced for 2 children)
    // Bracket 3: €5.000 × 22% = €1.100 (reduced for 2 children)
    expect(result.grossTax).toBeCloseTo(3600, 0);

    // Reduction: base €900, decrease = 20 * 13 = €260 → effective = €640
    expect(result.taxReduction).toBeCloseTo(640, 0);

    // Net tax = 3600 - 640 = 2960
    expect(result.netTax).toBeCloseTo(2960, 0);
  });
});

describe("Example 4: Μπλοκάκι 2026, €18.000 taxable, age ≤ 25", () => {
  it("calculates zero tax", () => {
    const result = calculateTax({
      ...baseInput,
      fiscalYear: 2026,
      grossIncome: 18000,
      ageGroup: "young",
    });

    // €0–20.000 all at 0% (youth rate)
    expect(result.grossTax).toBe(0);
    expect(result.netTax).toBe(0);
  });
});

describe("getBrackets", () => {
  it("returns 2025 brackets unchanged", () => {
    const brackets = getBrackets(2025, 0, "standard");
    expect(brackets).toHaveLength(5);
    expect(brackets[0].rate).toBe(0.09);
    expect(brackets[4].rate).toBe(0.44);
  });

  it("applies 2026 children reductions", () => {
    const brackets = getBrackets(2026, 2, "standard");
    expect(brackets[0].rate).toBe(0.09);
    expect(brackets[1].rate).toBe(0.16);
    expect(brackets[2].rate).toBe(0.22);
    expect(brackets[3].rate).toBe(0.34);
  });

  it("applies 4+ children rates", () => {
    const brackets = getBrackets(2026, 4, "standard");
    expect(brackets[0].rate).toBe(0);
    expect(brackets[1].rate).toBe(0);
    expect(brackets[2].rate).toBe(0.18);
  });

  it("applies youth ≤25 rates", () => {
    const brackets = getBrackets(2026, 0, "young");
    expect(brackets[0].rate).toBe(0);
    expect(brackets[1].rate).toBe(0);
    expect(brackets[2].rate).toBe(0.26); // normal
  });

  it("applies youth 26-30 rates", () => {
    const brackets = getBrackets(2026, 0, "middle");
    expect(brackets[0].rate).toBe(0.09);
    expect(brackets[1].rate).toBe(0.09);
  });
});

describe("edge cases", () => {
  it("handles zero income", () => {
    const result = calculateTax({ ...baseInput, grossIncome: 0 });
    expect(result.taxableIncome).toBe(0);
    expect(result.grossTax).toBe(0);
    expect(result.netTax).toBe(0);
  });

  it("caps taxable income at 0 for negative", () => {
    const result = calculateTax({
      ...baseInput,
      grossIncome: 1000,
      efkaAnnual: 3000,
    });
    expect(result.taxableIncome).toBe(0);
    expect(result.grossTax).toBe(0);
  });

  it("applies new business reduction for atomiki", () => {
    const result = calculateTax({
      ...baseInput,
      regime: "atomiki",
      grossIncome: 8000,
      yearsInBusiness: 2,
    });
    // First bracket rate halved: 4.5% × 8000 = 360
    expect(result.grossTax).toBeCloseTo(360, 0);
  });

  it("first year filing gets 27.5% prepayment", () => {
    const result = calculateTax({
      ...baseInput,
      regime: "atomiki",
      grossIncome: 10000,
      isFirstYearFiling: true,
    });
    // 10000 × 9% = 900 (net tax) × 27.5% = 247.50
    expect(result.prepayment).toBeCloseTo(247.5, 1);
  });
});

describe("client location withholding", () => {
  it("foreign client: withholding = 0, balanceDue = netTax", () => {
    const result = calculateTax({
      ...baseInput,
      grossIncome: 30000,
      clientLocation: "foreign",
    });
    expect(result.withholding20).toBe(0);
    expect(result.balanceDue).toBe(result.netTax);
  });

  it("mixed 60% domestic: withholding = gross × 0.60 × 0.20", () => {
    const result = calculateTax({
      ...baseInput,
      grossIncome: 30000,
      clientLocation: "mixed",
      domesticIncomeShare: 60,
    });
    // 30000 × 0.60 × 0.20 = 3600
    expect(result.withholding20).toBe(3600);
  });

  it("atomiki ignores clientLocation: withholding always 0", () => {
    const result = calculateTax({
      ...baseInput,
      regime: "atomiki",
      grossIncome: 30000,
      clientLocation: "foreign",
    });
    expect(result.withholding20).toBe(0);
  });
});
