import { useScrollReveal } from "@/hooks/useLanding";
import { useTranslation } from "react-i18next";
import { ClipboardEdit, Cog, BarChart3 } from "lucide-react";

const STEP_ICONS = [ClipboardEdit, Cog, BarChart3];
const STEP_COLORS = [
  { color: "var(--lp-teal)", bg: "bg-[var(--lp-teal)]/8" },
  { color: "var(--lp-indigo)", bg: "bg-[var(--lp-indigo)]/8" },
  { color: "var(--lp-amber)", bg: "bg-[var(--lp-amber)]/8" },
];

export function HowItWorks() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal(0.1);

  const steps = t("howItWorks.steps", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section id="how-it-works" aria-label={t("howItWorks.label")} className="bg-white py-20 dark:bg-[var(--lp-warm-white)] lg:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <p className="text-center text-sm font-semibold tracking-widest text-[var(--lp-teal)] uppercase">
            {t("howItWorks.label")}
          </p>
          <h2 className="font-outfit mt-3 text-center text-3xl font-bold text-[var(--lp-navy)] dark:text-white sm:text-4xl">
            {t("howItWorks.title")}
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            const { color, bg } = STEP_COLORS[i];
            return (
              <div
                key={i}
                className={`reveal-up stagger-${i + 1} group relative rounded-2xl border border-[var(--lp-navy)]/5 bg-[var(--lp-warm-white)]/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--lp-navy)]/5 dark:border-white/5 dark:hover:shadow-white/5 ${isVisible ? "revealed" : ""}`}
              >
                <span className="font-outfit absolute top-6 right-6 text-5xl font-extrabold text-[var(--lp-navy)]/[0.1] dark:text-white/[0.1]">
                  {i + 1}
                </span>
                <div className={`mb-5 inline-flex items-center justify-center rounded-xl ${bg} p-3`}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 className="font-outfit text-lg font-bold text-[var(--lp-navy)] dark:text-white">
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
