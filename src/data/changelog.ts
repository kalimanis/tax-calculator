export type ChangeType = "feature" | "improvement" | "fix" | "coming_soon";

export interface ChangelogItem {
  text: string;
  type: ChangeType;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description?: string;
  items: ChangelogItem[];
}

// Newest first (reverse chronological)
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2026-02-22',
    title: 'Ερχόμενες Λειτουργίες',
    items: [
      { text: 'Υπολογιστής φορολογίας εταιρειών (ΙΚΕ, ΕΠΕ, ΑΕ, ΟΕ, ΕΕ)', type: 'coming_soon' },
      { text: 'Σύγκριση τύπων εταιρειών side-by-side', type: 'coming_soon' },
      { text: 'Υπολογισμός μερισμάτων & προκαταβολής φόρου', type: 'coming_soon' },
    ],
  },
  {
    version: '1.1.1',
    date: '2026-02-23',
    title: 'Ηλεκτρονικές Αποδείξεις',
    items: [
      { text: 'Πληροφοριακό κάρτα e-Αποδείξεων (Άρθ. 15 §6, Ν.4172/2013)', type: 'feature' },
      { text: 'Αυτόματος υπολογισμός απαιτούμενου ποσού (30% εισοδήματος, ανώτατο €20.000)', type: 'feature' },
      { text: 'Μηνιαίος στόχος & μέγιστο πρόστιμο 22%', type: 'feature' },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-02-20",
    title: "Υπολογιστής Μισθωτών",
    items: [
      { text: "Υπολογισμός καθαρού μισθού (Μικτός → Καθαρός & Καθαρός → Μικτός)", type: "feature" },
      { text: "Υποστήριξη 14 ή 12 μισθών", type: "feature" },
      { text: "Υπολογισμός κόστους εργοδότη & εισφορών ΕΦΚΑ", type: "feature" },
      { text: "Προϋπηρεσία & τριετίες (0-9+ έτη)", type: "feature" },
      { text: "Άρθρο 5Γ — 50% μείωση φόρου για φορολογικούς μετανάστες", type: "feature" },
      { text: "Αναλυτικός πίνακας μισθοδοσίας (μηνιαία & ετήσια)", type: "feature" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-02-10",
    title: "Αρχική Έκδοση",
    description: "Δωρεάν φορολογικός υπολογισμός για ελεύθερους επαγγελματίες στην Ελλάδα",
    items: [
      { text: "Υπολογιστής Μπλοκάκι (Άρθ. 12 §2στ) με παρακράτηση 20%", type: "feature" },
      { text: "Υπολογιστής Ατομικής Επιχείρησης (Άρθ. 29) με προκαταβολή φόρου", type: "feature" },
      { text: "Φορολογικά έτη 2025 & 2026 (Ν.5246/2025)", type: "feature" },
      { text: "Αυτόματος ΕΦΚΑ — 3 επαγγέλματα, 6 κατηγορίες, νέοι επαγγελματίες", type: "feature" },
      { text: "Πελάτες εσωτερικού/εξωτερικού/μικτό (μπλοκάκι)", type: "feature" },
      { text: "Σύγκριση 2025 vs 2026 & Μπλοκάκι vs Ατομική", type: "feature" },
      { text: "Γράφημα ανάλυσης εισοδήματος (waterfall)", type: "feature" },
      { text: "Ανάλυση φορολογικών κλιμακίων", type: "feature" },
      { text: "Κοινοποίηση μέσω URL & εκτύπωση αποτελεσμάτων", type: "feature" },
    ],
  },
];

// Latest released version (skip entries that are only "coming_soon")
const latestRelease = CHANGELOG.find((e) => e.items.some((i) => i.type !== "coming_soon")) ?? CHANGELOG[0];
export const LATEST_VERSION = latestRelease.version;
export const LATEST_DATE = latestRelease.date;
