import { useScrollReveal } from "@/hooks/useLanding";
import { BookOpen, RefreshCw, Lock, Coins, Zap, Smartphone } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: BookOpen,
    title: "Βασισμένο στη νομοθεσία",
    description: "Ν.4172/2013, Ν.5246/2025, Εγκ. e-ΕΦΚΑ",
    color: "var(--lp-teal)",
    bg: "bg-[var(--lp-teal)]/8",
  },
  {
    icon: RefreshCw,
    title: "Ενημερωμένο",
    description: "Κλίμακα 2026, ΕΦΚΑ 2025, κατώτατος €880",
    color: "var(--lp-indigo)",
    bg: "bg-[var(--lp-indigo)]/8",
  },
  {
    icon: Lock,
    title: "Ιδιωτικότητα",
    description: "Κανένα δεδομένο δεν αποθηκεύεται. Όλοι οι υπολογισμοί client-side.",
    color: "var(--lp-navy)",
    bg: "bg-[var(--lp-navy)]/8",
  },
  {
    icon: Coins,
    title: "100% Δωρεάν",
    description: "Χωρίς κρυφές χρεώσεις, χωρίς εγγραφή",
    color: "var(--lp-amber)",
    bg: "bg-[var(--lp-amber)]/8",
  },
  {
    icon: Zap,
    title: "Ακριβές",
    description: "Αντιπαραβολή με ΑΑΔΕ εκκαθαριστικά και payroll",
    color: "var(--lp-teal)",
    bg: "bg-[var(--lp-teal)]/8",
  },
  {
    icon: Smartphone,
    title: "Mobile-friendly",
    description: "Λειτουργεί σε κινητό, tablet, desktop",
    color: "var(--lp-indigo)",
    bg: "bg-[var(--lp-indigo)]/8",
  },
];

export function TrustSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="bg-white py-20 lg:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <p className="text-center text-sm font-semibold tracking-widest text-[var(--lp-teal)] uppercase">
            Εμπιστοσύνη
          </p>
          <h2 className="font-outfit mt-3 text-center text-3xl font-bold text-[var(--lp-navy)] sm:text-4xl">
            Γιατί να μας εμπιστευτείς
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`reveal-up stagger-${i + 1} flex items-start gap-4 rounded-xl border border-[var(--lp-navy)]/3 bg-[var(--lp-warm-white)]/40 p-6 transition-all duration-300 hover:border-[var(--lp-navy)]/8 hover:shadow-md ${isVisible ? "revealed" : ""}`}
              >
                <div
                  className={`flex-shrink-0 rounded-lg ${item.bg} p-2.5`}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div>
                  <h3 className="font-outfit text-sm font-bold text-[var(--lp-navy)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--lp-text-muted)]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
