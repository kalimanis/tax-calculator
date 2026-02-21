import { describe, it, expect } from "vitest";
import { calculateSalary } from "./salary-engine";
import { getEfkaRates } from "./salary-constants";
import type { SalaryInput } from "./types";

const baseInput: SalaryInput = {
  fiscalYear: 2025,
  direction: "gross-to-net",
  monthlySalary: 0,
  payFrequency: 14,
  children: 0,
  ageGroup: "standard",
  efkaEmployeeRate: 0.1337,
  efkaEmployerRate: 0.2179,
  seniority: 0,
  hasArticle5G: false,
};

describe("minimum wage 2025", () => {
  it("€880 gross, 0 children, 14 pays → net ~€742-743", () => {
    const result = calculateSalary({
      ...baseInput,
      monthlySalary: 880,
    });

    expect(result.grossAnnual).toBe(12320);
    // EFKA: 880 * 0.1337 = 117.66/payment * 14 = 1647.24
    expect(result.efkaEmployee).toBeCloseTo(1647.24, 0);
    // Taxable: 12320 - 1647.24 = 10672.76
    expect(result.taxableIncome).toBeCloseTo(10672.76, 0);
    // Net monthly = €742.98
    expect(result.netMonthly).toBeCloseTo(742.98, 0);
  });
});

describe("€2,000 gross with 2 children", () => {
  it("2025, 14 pays → net ~€1,472-1,474", () => {
    const result = calculateSalary({
      ...baseInput,
      monthlySalary: 2000,
      children: 2,
    });

    expect(result.grossAnnual).toBe(28000);
    // EFKA: 2000 * 0.1337 = 267.40/payment * 14 = 3743.60
    expect(result.efkaEmployee).toBeCloseTo(3743.60, 0);
    // Net monthly around €1,472-1,474
    expect(result.netMonthly).toBeGreaterThan(1470);
    expect(result.netMonthly).toBeLessThan(1480);
  });
});

describe("EFKA ceiling", () => {
  it("€10,000 salary caps EFKA at ceiling", () => {
    const rates = getEfkaRates(2025);
    const result = calculateSalary({
      ...baseInput,
      monthlySalary: 10000,
    });

    // EFKA should be capped: ceiling * rate * 14 (all payments)
    const expectedEfka = Math.round(rates.ceiling * 0.1337 * 14 * 100) / 100;
    expect(result.efkaEmployee).toBeCloseTo(expectedEfka, 0);
    // Should be less than uncapped: 10000 * 0.1337 * 14
    expect(result.efkaEmployee).toBeLessThan(10000 * 0.1337 * 14);
  });
});

describe("Article 5G", () => {
  it("halves the net tax", () => {
    const without5G = calculateSalary({
      ...baseInput,
      monthlySalary: 3000,
    });
    const with5G = calculateSalary({
      ...baseInput,
      monthlySalary: 3000,
      hasArticle5G: true,
    });

    expect(with5G.netTax).toBeCloseTo(without5G.netTax / 2, 1);
    expect(with5G.netMonthly).toBeGreaterThan(without5G.netMonthly);
  });
});

describe("net-to-gross solver", () => {
  it("round-trip: solve gross from net, then verify", () => {
    // First get net from a known gross
    const forward = calculateSalary({
      ...baseInput,
      monthlySalary: 2000,
    });

    // Now solve backwards from that net
    const backward = calculateSalary({
      ...baseInput,
      direction: "net-to-gross",
      monthlySalary: forward.netMonthly,
    });

    // Should recover the original gross (within tolerance)
    expect(backward.grossMonthly).toBeCloseTo(2000, 0);
    expect(backward.netMonthly).toBeCloseTo(forward.netMonthly, 1);
  });
});

describe("rounding settlement diff", () => {
  it("is calculated for €880 gross", () => {
    const result = calculateSalary({
      ...baseInput,
      monthlySalary: 880,
    });

    // Monthly tax is rounded independently
    const expectedMonthlyTax = Math.round((result.netTax / 14) * 100) / 100;
    const totalWithheld = Math.round(expectedMonthlyTax * 14 * 100) / 100;
    expect(result.settlementDiff).toBeCloseTo(result.netTax - totalWithheld, 2);

    // Annual precise uses exact tax, not monthly × 14
    expect(result.netAnnualPrecise).toBe(
      Math.round((result.grossAnnual - result.efkaEmployee - result.netTax) * 100) / 100
    );
  });
});

describe("2026 brackets", () => {
  it("produce lower tax for 2 children vs 2025", () => {
    const result2025 = calculateSalary({
      ...baseInput,
      monthlySalary: 2000,
      children: 2,
    });
    const result2026 = calculateSalary({
      ...baseInput,
      fiscalYear: 2026,
      monthlySalary: 2000,
      children: 2,
    });

    expect(result2026.netTax).toBeLessThan(result2025.netTax);
    expect(result2026.netMonthly).toBeGreaterThan(result2025.netMonthly);
  });
});
