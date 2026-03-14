import { useScrollReveal } from "@/hooks/useLanding";
import { useTranslation } from "react-i18next";
import { BookOpen, RefreshCw, Lock, Coins, Zap, Smartphone } from "lucide-react";

const TRUST_STYLES = [
  { icon: BookOpen, color: "var(--lp-teal)", bg: "bg-[var(--lp-teal)]/8" },
  { icon: RefreshCw, color: "var(--lp-indigo)", bg: "bg-[var(--lp-indigo)]/8" },
  { icon: Lock, color: "var(--lp-navy)", bg: "bg-[var(--lp-navy)]/8" },
  { icon: Coins, color: "var(--lp-amber)", bg: "bg-[var(--lp-amber)]/8" },
  { icon: Zap, color: "var(--lp-teal)", bg: "bg-[var(--lp-teal)]/8" },
  { icon: Smartphone, color: "var(--lp-indigo)", bg: "bg-[var(--lp-indigo)]/8" },
];

export function TrustSection() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal(0.1);

  const items = t("trust.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section id="trust" aria-label={t("trust.title")} className="bg-white py-20 dark:bg-[var(--lp-warm-white)] lg:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <p className="text-center text-sm font-semibold tracking-widest text-[var(--lp-teal)] uppercase">
            {t("trust.label")}
          </p>
          <h2 className="font-outfit mt-3 text-center text-3xl font-bold text-[var(--lp-navy)] dark:text-white sm:text-4xl">
            {t("trust.title")}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const style = TRUST_STYLES[i];
            const Icon = style.icon;
            return (
              <div
                key={item.title}
                className={`reveal-up stagger-${i + 1} flex items-start gap-4 rounded-xl border border-[var(--lp-navy)]/3 bg-[var(--lp-warm-white)]/40 p-6 transition-all duration-300 hover:border-[var(--lp-navy)]/8 hover:shadow-md dark:border-white/5 dark:hover:border-white/10 ${isVisible ? "revealed" : ""}`}
              >
                <div className={`flex-shrink-0 rounded-lg ${style.bg} p-2.5`}>
                  <Icon size={20} style={{ color: style.color }} />
                </div>
                <div>
                  <h3 className="font-outfit text-sm font-bold text-[var(--lp-navy)] dark:text-white">
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
