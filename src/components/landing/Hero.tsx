import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCountUp } from "@/hooks/useLanding";
import { calculateSalary } from "@/lib/salary-engine";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { trackLandingCTA } from "@/lib/analytics";

const HERO_GROSS = 2000;

export function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const result = useMemo(() => {
    const r = calculateSalary({
      fiscalYear: 2026,
      direction: "gross-to-net",
      monthlySalary: HERO_GROSS,
      payFrequency: 14,
      children: 0,
      ageGroup: "standard",
      efkaEmployeeRate: 0.1337,
      efkaEmployerRate: 0.2179,
      seniority: 0,
      hasArticle5G: false,
    });
    const efkaMonthly = Math.round(HERO_GROSS * 0.1337 * 100) / 100;
    const taxMonthly = Math.round((HERO_GROSS - efkaMonthly - r.netMonthly) * 100) / 100;
    return { net: r.netMonthly, efka: efkaMonthly, tax: taxMonthly, rate: r.effectiveRate };
  }, []);

  const { count } = useCountUp(Math.round(result.net), 2000);
  const trustBadges = t("hero.trustBadges", { returnObjects: true }) as string[];

  return (
    <section
      id="hero"
      aria-label="Κύρια παρουσίαση"
      className="grain-overlay relative overflow-hidden bg-gradient-to-br from-[var(--lp-warm-white)] via-[var(--lp-warm-white-dim)] to-[#e8f4f3] pt-32 pb-14 dark:to-[#0d9488]/5 lg:pt-36 lg:pb-20"
    >
      <div className="pointer-events-none absolute -top-32 -right-32 hidden h-[500px] w-[500px] rounded-full bg-[var(--lp-teal)]/8 blur-[120px] md:block" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 hidden h-[400px] w-[400px] rounded-full bg-[var(--lp-amber)]/6 blur-[100px] md:block" />

      <div className="grain-content mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h1 className="font-outfit text-[2.75rem] leading-[1.1] font-extrabold tracking-tight text-[var(--lp-navy)] dark:text-white sm:text-5xl lg:text-[3.5rem]">
              {t("hero.titleMain")}{" "}
              <span className="relative">
                {t("hero.titleHighlight")}
                <span className="absolute -bottom-1 left-0 h-3 w-full bg-[var(--lp-amber)]/25 -skew-x-3" />
              </span>
              .
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--lp-text-muted)]">
              {t("hero.description").split("<1>")[0]}
              <span className="font-semibold text-[var(--lp-navy)] dark:text-white">
                {t("hero.description").split("<1>")[1]?.split("</1>")[0]}
              </span>
              {t("hero.description").split("</1>")[1]}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  trackLandingCTA("hero");
                  navigate("/calculator");
                }}
                data-event="cta-hero-primary"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--lp-teal)] px-7 py-3.5 text-[15px] font-semibold text-white shadow-xl shadow-[var(--lp-teal)]/20 transition-all hover:bg-[var(--lp-teal-dark)] hover:shadow-2xl hover:shadow-[var(--lp-teal)]/30"
              >
                {t("hero.ctaPrimary")}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--lp-navy)]/10 px-6 py-3.5 text-[15px] font-semibold text-[var(--lp-navy)] transition-all hover:border-[var(--lp-navy)]/20 hover:bg-[var(--lp-navy)]/3 dark:border-white/10 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/5"
              >
                {t("hero.ctaSecondary")}
                <ChevronDown size={18} />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--lp-text-muted)]"
                >
                  <CheckCircle2 size={15} className="text-[var(--lp-teal)]" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="relative mx-auto max-w-md lg:mx-0 lg:ml-auto">
              <div className="relative rounded-2xl border border-[var(--lp-navy)]/8 bg-white p-8 shadow-2xl shadow-[var(--lp-navy)]/8 dark:border-white/8 dark:bg-white/5 md:bg-white/80 md:backdrop-blur-sm lg:-rotate-2">
                <div className="mb-6 flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                  <div className="h-3 w-3 rounded-full bg-green-400/60" />
                </div>

                <p className="text-sm font-medium tracking-wide text-[var(--lp-text-light)] uppercase">
                  {t("hero.netMonthlySalary")}
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-outfit text-5xl font-extrabold tabular-nums text-[var(--lp-navy)] dark:text-white">
                    €{count.toLocaleString("el-GR")}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--lp-text-muted)]">{t("hero.gross")}</span>
                    <span className="font-medium text-[var(--lp-navy)] dark:text-white">
                      {formatCurrency(HERO_GROSS)}
                    </span>
                  </div>
                  <div className="h-px bg-[var(--lp-navy)]/5 dark:bg-white/5" />
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--lp-text-muted)]">{t("hero.efka")}</span>
                    <span className="font-medium text-red-500/80 dark:text-red-400/80">
                      -{formatCurrency(result.efka)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--lp-text-muted)]">{t("hero.tax")}</span>
                    <span className="font-medium text-red-500/80 dark:text-red-400/80">
                      -{formatCurrency(result.tax)}
                    </span>
                  </div>
                  <div className="h-px bg-[var(--lp-navy)]/5 dark:bg-white/5" />
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-[var(--lp-teal)]">{t("hero.net")}</span>
                    <span className="text-[var(--lp-teal)]">{formatCurrency(result.net)}</span>
                  </div>
                </div>

                <div className="pointer-events-none absolute -inset-4 -z-10 hidden rounded-3xl bg-[var(--lp-teal)]/5 blur-2xl md:block" />
              </div>

              <div className="mt-4 ml-auto w-fit rounded-xl border border-[var(--lp-amber)]/20 bg-white px-4 py-2.5 shadow-lg dark:bg-white/5">
                <p className="text-xs font-medium text-[var(--lp-text-muted)]">
                  {t("hero.effectiveTax")}
                </p>
                <p className="font-outfit text-lg font-bold text-[var(--lp-amber)]">
                  {formatPercent(result.rate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
