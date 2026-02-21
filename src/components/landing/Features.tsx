import { useScrollReveal } from "@/hooks/useLanding";
import { Briefcase, FileText, Building2 } from "lucide-react";

const FEATURES = [
  {
    id: "misthotos",
    icon: Briefcase,
    title: "Μισθωτός",
    subtitle: "Από μικτά σε καθαρά σε δευτερόλεπτα",
    accent: "var(--lp-teal)",
    accentBg: "bg-[var(--lp-teal)]/8",
    accentBorder: "group-hover:border-[var(--lp-teal)]/30",
    bullets: [
      "Εισφορές ΕΦΚΑ εργαζομένου",
      "14 μισθοί",
      "Άρθρο 5Γ",
      "Κόστος εργοδότη",
      "Αντίστροφος υπολογισμός",
    ],
  },
  {
    id: "mplokaki",
    icon: FileText,
    title: "Μπλοκάκι",
    subtitle: "Παρακράτηση 20%, Άρθ. 16, πελάτες εξωτερικού",
    accent: "var(--lp-indigo)",
    accentBg: "bg-[var(--lp-indigo)]/8",
    accentBorder: "group-hover:border-[var(--lp-indigo)]/30",
    bullets: [
      "6 κατηγορίες ΕΦΚΑ",
      "Κλίμακα 2025 & 2026",
      "Μείωση φόρου Άρθ. 16",
      "Ξένοι πελάτες",
    ],
  },
  {
    id: "atomiki",
    icon: Building2,
    title: "Ατομική Επιχείρηση",
    subtitle: "Προκαταβολή, τέλος επιτηδεύματος, σύγκριση",
    accent: "var(--lp-amber)",
    accentBg: "bg-[var(--lp-amber)]/8",
    accentBorder: "group-hover:border-[var(--lp-amber)]/30",
    bullets: [
      "Προκαταβολή φόρου (55% ή 27,5% 1ο έτος)",
      "Γράφημα ροής εισοδήματος",
      "Σύγκριση με μπλοκάκι",
    ],
  },
];

export function Features() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section
      id="features"
      aria-label="Χαρακτηριστικά"
      data-section="features"
      className="relative overflow-hidden bg-gradient-to-b from-white to-[var(--lp-warm-white-dim)] py-20 dark:from-[var(--lp-warm-white)] dark:to-[var(--lp-warm-white-dim)] lg:py-28"
      ref={ref}
    >
      {/* Subtle mesh — hidden on mobile for perf */}
      <div className="pointer-events-none absolute top-0 left-1/2 hidden h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--lp-teal)]/4 blur-[150px] md:block" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <p className="text-center text-sm font-semibold tracking-widest text-[var(--lp-teal)] uppercase">
            Τι καλύπτει
          </p>
          <h2 className="font-outfit mt-3 text-center text-3xl font-bold text-[var(--lp-navy)] dark:text-white sm:text-4xl">
            Ένας υπολογιστής, τρεις κόσμοι
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                id={feature.id}
                className={`reveal-up stagger-${i + 1} group relative rounded-2xl border border-[var(--lp-navy)]/5 bg-white/70 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--lp-navy)]/5 dark:border-white/5 dark:bg-white/5 dark:hover:shadow-white/5 ${feature.accentBorder} ${isVisible ? "revealed" : ""}`}
              >
                <div
                  className={`mb-5 inline-flex items-center justify-center rounded-xl ${feature.accentBg} p-3`}
                >
                  <Icon size={24} style={{ color: feature.accent }} />
                </div>

                <h3 className="font-outfit text-xl font-bold text-[var(--lp-navy)] dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-[var(--lp-text-muted)]">
                  {feature.subtitle}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {feature.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2.5 text-sm text-[var(--lp-text)]"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: feature.accent }}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
