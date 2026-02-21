export type FiscalYear = 2025 | 2026;
export type Regime = "misthotos" | "mplokaki" | "atomiki";
export type AgeGroup = "young" | "middle" | "standard";
export type ProfessionType = "standard" | "engineer" | "doctor";
export type ClientLocation = "domestic" | "foreign" | "mixed";

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
  clientLocation: ClientLocation;
  domesticIncomeShare: number;
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

export type SalaryDirection = "gross-to-net" | "net-to-gross";
export type PayFrequency = 14 | 12;
export type Seniority = 0 | 1 | 2 | 3;

export interface SalaryInput {
  fiscalYear: FiscalYear;
  direction: SalaryDirection;
  monthlySalary: number;
  payFrequency: PayFrequency;
  children: number;
  ageGroup: AgeGroup;
  efkaEmployeeRate: number;
  efkaEmployerRate: number;
  seniority: Seniority;
  hasArticle5G: boolean;
}

export interface SalaryResult {
  grossAnnual: number;
  grossMonthly: number;
  efkaEmployee: number;
  efkaEmployer: number;
  taxableIncome: number;
  brackets: BracketResult[];
  grossTax: number;
  taxReduction: number;
  netTax: number;
  netAnnual: number;
  netMonthly: number;
  netAnnualPrecise: number;
  settlementDiff: number;
  effectiveRate: number;
  employerCost: number;
}
