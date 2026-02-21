import { useScrollReveal } from "@/hooks/useLanding";
import { ClipboardEdit, Cog, BarChart3 } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardEdit,
    title: "Εισάγεις τα στοιχεία σου",
    description: "Μικτό μισθό ή ετήσιο τζίρο, καθεστώς, τέκνα",
    color: "var(--lp-teal)",
    bg: "bg-[var(--lp-teal)]/8",
  },
  {
    icon: Cog,
    title: "Υπολογίζουμε ακριβώς",
    description: "ΕΦΚΑ, φόρος, προκαταβολή, μείωση Άρθ. 16 — όλα αυτόματα",
    color: "var(--lp-indigo)",
    bg: "bg-[var(--lp-indigo)]/8",
  },
  {
    icon: BarChart3,
    title: "Βλέπεις τα αποτελέσματα",
    description: "Καθαρός μισθός, αναλυτική κατάσταση, σύγκριση ετών",
    color: "var(--lp-amber)",
    bg: "bg-[var(--lp-amber)]/8",
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id="how-it-works" className="bg-white py-20 lg:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <p className="text-center text-sm font-semibold tracking-widest text-[var(--lp-teal)] uppercase">
            Πώς λειτουργεί
          </p>
          <h2 className="font-outfit mt-3 text-center text-3xl font-bold text-[var(--lp-navy)] sm:text-4xl">
            3 απλά βήματα
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={`reveal-up stagger-${i + 1} group relative rounded-2xl border border-[var(--lp-navy)]/5 bg-[var(--lp-warm-white)]/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--lp-navy)]/5 ${isVisible ? "revealed" : ""}`}
              >
                {/* Step number */}
                <span className="font-outfit absolute top-6 right-6 text-5xl font-extrabold text-[var(--lp-navy)]/[0.1]">
                  {i + 1}
                </span>

                <div
                  className={`mb-5 inline-flex items-center justify-center rounded-xl ${step.bg} p-3`}
                >
                  <Icon size={24} style={{ color: step.color }} />
                </div>

                <h3 className="font-outfit text-lg font-bold text-[var(--lp-navy)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--lp-text-muted)]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
