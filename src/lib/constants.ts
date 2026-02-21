import type { Bracket } from "./types";

export const BRACKETS_2025: Bracket[] = [
  { min: 0, max: 10000, rate: 0.09 },
  { min: 10000, max: 20000, rate: 0.22 },
  { min: 20000, max: 30000, rate: 0.28 },
  { min: 30000, max: 40000, rate: 0.36 },
  { min: 40000, max: Infinity, rate: 0.44 },
];

export const BRACKETS_2026_BASE: Bracket[] = [
  { min: 0, max: 10000, rate: 0.09 },
  { min: 10000, max: 20000, rate: 0.20 },
  { min: 20000, max: 30000, rate: 0.26 },
  { min: 30000, max: 40000, rate: 0.34 },
  { min: 40000, max: 60000, rate: 0.39 },
  { min: 60000, max: Infinity, rate: 0.44 },
];

// 2026 bracket rate adjustments by children (brackets 1-3 indexed 0-2)
// [bracket0Rate, bracket1Rate, bracket2Rate]
const CHILDREN_RATE_OVERRIDES: Record<number, [number, number, number]> = {
  0: [0.09, 0.20, 0.26],
  1: [0.09, 0.18, 0.24],
  2: [0.09, 0.16, 0.22],
  3: [0.09, 0.09, 0.20],
  4: [0.00, 0.00, 0.18],
};

export function get2026ChildrenRates(children: number): [number, number, number] {
  if (children <= 4) return CHILDREN_RATE_OVERRIDES[children];
  // 5+ children: first two brackets 0%, third decreases by 2pp per child beyond 4
  const thirdRate = Math.max(0, 0.18 - 0.02 * (children - 4));
  return [0, 0, thirdRate];
}

export const TAX_REDUCTION_BASE: Record<number, number> = {
  0: 777,
  1: 810,
  2: 900,
  3: 1120,
  4: 1340,
};

export const LABELS = {
  appTitle: "Υπολογιστής Φόρου Ελεύθερων Επαγγελματιών",
  subtitle: "Φορολογικά Έτη 2025 & 2026",
  regime: {
    mplokaki: "Μπλοκάκι (Άρθ. 12 §2στ)",
    mplokakiShort: "Μπλοκάκι",
    atomiki: "Ατομική Επιχείρηση (Άρθ. 29)",
    atomikiShort: "Ατομική",
  },
  income: {
    gross: "Ακαθάριστα Έσοδα",
    efka: "Εισφορές ΕΦΚΑ",
    expenses: "Λοιπά Έξοδα / Δαπάνες",
    taxable: "Φορολογητέο Εισόδημα",
  },
  children: "Εξαρτώμενα Τέκνα",
  age: "Ηλικία",
  ageGroups: {
    young: "≤ 25 ετών",
    middle: "26-30 ετών",
    standard: "> 30 ετών",
  },
  results: {
    grossTax: "Μικτός Φόρος",
    taxReduction: "Μείωση Φόρου (Άρθ. 16)",
    netTax: "Καθαρός Φόρος Εισοδήματος",
    prepayment: "Προκαταβολή Φόρου",
    totalObligation: "Συνολική Φορολογική Υποχρέωση",
    effectiveRate: "Πραγματικός Συντελεστής",
    netIncome: "Καθαρό Εισόδημα (μετά φόρων & ΕΦΚΑ)",
    withholding: "Παρακράτηση Φόρου (20%)",
    balanceDue: "Υπόλοιπο / Επιστροφή",
  },
  efka: {
    auto: "Αυτόματος Υπολογισμός",
    manual: "Χειροκίνητη Εισαγωγή",
    category: "Ασφαλιστική Κατηγορία",
    profession: "Επάγγελμα",
    professions: {
      standard: "Ελεύθερος Επαγγελματίας",
      engineer: "Μηχανικός / Δικηγόρος",
      doctor: "Γιατρός",
    },
    newProfessional: "Νέος Επαγγελματίας (πρώτη 5ετία)",
    monthly: "Μηνιαία Εισφορά",
    annual: "Ετήσια Εισφορά",
  },
  clientLocation: {
    title: "Πελάτες",
    domestic: "Ελλάδα",
    foreign: "Εξωτερικό",
    mixed: "Μικτό",
    domesticShare: "Ποσοστό Εγχώριου Εισοδήματος (%)",
    noWithholding: "Χωρίς παρακράτηση — οι πελάτες εξωτερικού δεν παρακρατούν φόρο.",
    partialWithholding: "Παρακράτηση μόνο στα εγχώρια έσοδα.",
  },
  balanceDue: {
    owed: "Οφειλή στην Εκκαθάριση",
    refund: "Επιστροφή Φόρου",
    zero: "Μηδενικό Υπόλοιπο",
  },
  comparison: {
    title: "Σύγκριση",
    yearVsYear: "2025 vs 2026",
    regimeVsRegime: "Μπλοκάκι vs Ατομική",
    difference: "Διαφορά",
    savings: "Εξοικονόμηση",
  },
  brackets: {
    title: "Ανάλυση ανά Κλιμάκιο",
    bracket: "Κλιμάκιο",
    rate: "Συντελεστής",
    tax: "Φόρος",
    total: "Σύνολο",
  },
  waterfall: {
    title: "Ροή Εισοδήματος",
  },
  newBusiness: {
    label: "Νέα Επιχείρηση (πρώτα 3 έτη)",
    firstYear: "Πρώτο Έτος Δήλωσης",
    yearsActive: "Έτη Δραστηριότητας",
  },
  disclaimer:
    "Ο υπολογισμός είναι ενδεικτικός και δεν αποτελεί φορολογική συμβουλή. Συμβουλευτείτε τον λογιστή σας για ακριβή υπολογισμό. Βάσει Ν.4172/2013 (ΚΦΕ) & Ν.5246/2025.",
  fiscalYear: "Φορολογικό Έτος",
  taxRegime: "Καθεστώς Φορολόγησης",
  calculate: "Υπολογισμός",
  reset: "Καθαρισμός",
  notApplicable: "Δεν εφαρμόζεται",
} as const;

export const TOOLTIPS = {
  mplokaki:
    "Φορολόγηση ως μισθωτός (Άρθ. 12 §2στ ΚΦΕ). Μέγιστο 3 εργοδότες ή 75%+ έσοδα από έναν. Δικαίωμα αφορολόγητου.",
  atomiki:
    "Φορολόγηση επιχειρηματικού κέρδους (Άρθ. 29 ΚΦΕ). Χωρίς αφορολόγητο. Προκαταβολή φόρου 55%.",
  taxReduction:
    "Μείωση φόρου Άρθ. 16 ΚΦΕ. Εφαρμόζεται μόνο στο μπλοκάκι. Βάση: €777 (χωρίς τέκνα), μειώνεται €20/€1.000 πάνω από €12.000 εισοδήματος.",
  prepayment:
    "55% του φόρου (27,5% το πρώτο έτος). Εφαρμόζεται μόνο στην ατομική επιχείρηση.",
  withholding:
    "Ο εργοδότης παρακρατεί 20% επί των ακαθάριστων αμοιβών (Άρθ. 60 ΚΦΕ). Συμψηφίζεται με τον τελικό φόρο.",
  efka: "Οι εισφορές ΕΦΚΑ εκπίπτουν από τα ακαθάριστα έσοδα πριν τον υπολογισμό του φόρου.",
  foreignClient:
    "Σύμφωνα με την ΠΟΛ.1029/2018, οι αλλοδαποί εργοδότες/πελάτες χωρίς μόνιμη εγκατάσταση στην Ελλάδα δεν υποχρεούνται σε παρακράτηση φόρου. Απαιτείται σύμβαση που τεκμηριώνει τη σχέση.",
  changes2026:
    "Ν.5246/2025: Νέα κλίμακα με μειωμένους συντελεστές, 6ο κλιμάκιο €40-60K (39%), μειώσεις για τέκνα και νέους ≤30.",
} as const;
