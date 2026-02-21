import type { FiscalYear, Seniority } from "./types";

interface EfkaRates {
  employee: number;
  employer: number;
  ceiling: number;
}

const EFKA_RATES: Record<FiscalYear, EfkaRates> = {
  2025: { employee: 0.1337, employer: 0.2179, ceiling: 7572.62 },
  2026: { employee: 0.1337, employer: 0.2179, ceiling: 7762.06 },
};

export function getEfkaRates(year: FiscalYear): EfkaRates {
  return EFKA_RATES[year];
}

const MINIMUM_WAGE: Record<FiscalYear, number> = {
  2025: 880,
  2026: 940,
};

export function getMinimumWage(year: FiscalYear): number {
  return MINIMUM_WAGE[year];
}

const SENIORITY_INCREMENTS: Record<Seniority, number> = {
  0: 0,
  1: 0.10,
  2: 0.20,
  3: 0.30,
};

export function getSeniorityIncrement(seniority: Seniority): number {
  return SENIORITY_INCREMENTS[seniority];
}

export const SALARY_LABELS = {
  formTitle: "Στοιχεία Μισθού",
  direction: {
    label: "Κατεύθυνση Υπολογισμού",
    grossToNet: "Μικτός → Καθαρός",
    netToGross: "Καθαρός → Μικτός",
  },
  monthlySalary: "Μηνιαίος Μισθός",
  grossSalary: "Μικτός Μισθός",
  targetNet: "Επιθυμητός Καθαρός",
  payFrequency: {
    label: "Μισθοδοσία",
    "14": "14 μισθοί",
    "12": "12 μισθοί",
  },
  seniority: {
    label: "Προϋπηρεσία",
    "0": "0-3 έτη",
    "1": "3-6 έτη (+10%)",
    "2": "6-9 έτη (+20%)",
    "3": "9+ έτη (+30%)",
  },
  efka: {
    employee: "ΕΦΚΑ Εργαζομένου",
    employer: "ΕΦΚΑ Εργοδότη",
  },
  article5G: "Άρθρο 5Γ (50% μείωση φόρου)",
  minimumWage: "Κατώτατος Μισθός",
  results: {
    grossMonthly: "Μικτός Μηνιαίος",
    grossAnnual: "Μικτός Ετήσιος",
    efkaEmployee: "ΕΦΚΑ Εργαζομένου",
    efkaEmployer: "ΕΦΚΑ Εργοδότη",
    taxable: "Φορολογητέο Εισόδημα",
    grossTax: "Μικτός Φόρος",
    taxReduction: "Μείωση Φόρου (Άρθ. 16)",
    netTax: "Καθαρός Φόρος",
    netMonthly: "Καθαρός Μηνιαίος",
    netAnnual: "Καθαρός Ετήσιος",
    effectiveRate: "Πραγματικός Συντελεστής",
    employerCost: "Κόστος Εργοδότη",
  },
  breakdown: "Ανάλυση Μισθοδοσίας",
  monthly: "Μηνιαία",
  annual: "Ετήσια",
} as const;

export const SALARY_TOOLTIPS = {
  efkaCeiling:
    "Ανώτατο μηνιαίο ποσό εισφορών ΕΦΚΑ. Εισφορές υπολογίζονται μέχρι αυτό το πλαφόν.",
  article5G:
    "Ειδικό καθεστώς Άρθ. 5Γ ΚΦΕ: Μείωση 50% του φόρου εισοδήματος για φορολογικούς κατοίκους που μετέφεραν τη φορολογική τους κατοικία στην Ελλάδα.",
  seniority:
    "Τα τριετή προσαύξησης βάσει προϋπηρεσίας (10% ανά τριετία, μέχρι 30%).",
  minimumWage: "Κατώτατος νόμιμος μισθός πλήρους απασχόλησης.",
  netToGross:
    "Υπολογίζει τον μικτό μισθό που αντιστοιχεί στον επιθυμητό καθαρό.",
} as const;
