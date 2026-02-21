export type FiscalYear = 2025 | 2026;
export type Regime = "mplokaki" | "atomiki";
export type AgeGroup = "young" | "middle" | "standard";
export type ProfessionType = "standard" | "engineer" | "doctor";

export interface TaxInput {
  fiscalYear: FiscalYear;
  regime: Regime;
  grossIncome: number;
  efkaAnnual: number;
  otherExpenses: number;
  children: number;
  ageGroup: AgeGroup;
  isFirstYearFiling: boolean;
  yearsInBusiness: number;
}

export interface TaxResult {
  taxableIncome: number;
  brackets: BracketResult[];
  grossTax: number;
  taxReduction: number;
  netTax: number;
  prepayment: number;
  totalObligation: number;
  effectiveRate: number;
  netIncome: number;
  withholding20: number;
  balanceDue: number;
  efkaAnnual: number;
}

export interface BracketResult {
  min: number;
  max: number;
  rate: number;
  baseRate: number;
  taxableAmount: number;
  tax: number;
}

export interface Bracket {
  min: number;
  max: number;
  rate: number;
}

export interface EfkaCategory {
  monthly: number;
  annual: number;
  label?: string;
}
