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
    version: "1.1.0",
    date: "2026-02-20",
    title: "Υπολογιστής Μισθωτών",
    items: [
      { text: "Υπολογισμός καθαρού μισθού μισθωτών ιδιωτικού τομέα", type: "feature" },
      { text: "Υποστήριξη 14 μισθών (12 + δώρα)", type: "feature" },
      { text: "Υπολογισμός κόστους εργοδότη", type: "feature" },
      { text: "Υποστήριξη πελατών εξωτερικού για μπλοκάκι", type: "feature" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-02-10",
    title: "Αρχική Έκδοση",
    description: "Ο πρώτος Ελληνικός AI-powered φορολογικός υπολογιστής",
    items: [
      { text: "Υπολογιστής Μπλοκάκι (ελεύθεροι επαγγελματίες)", type: "feature" },
      { text: "Υπολογιστής Ατομικής Επιχείρησης", type: "feature" },
      { text: "Υποστήριξη φορολογικών ετών 2025 & 2026", type: "feature" },
      { text: "Αυτόματος υπολογισμός ΕΦΚΑ (6 κατηγορίες)", type: "feature" },
      { text: "Σύγκριση μεταξύ ετών και καθεστώτων", type: "feature" },
      { text: "Γραφήματα ανάλυσης φόρου", type: "feature" },
    ],
  },
];

// Latest released version (skip entries that are only "coming_soon")
const latestRelease = CHANGELOG.find((e) => e.items.some((i) => i.type !== "coming_soon")) ?? CHANGELOG[0];
export const LATEST_VERSION = latestRelease.version;
export const LATEST_DATE = latestRelease.date;
