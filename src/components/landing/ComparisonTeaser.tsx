import { useMemo } from "react";
import { useScrollReveal } from "@/hooks/useLanding";
import { calculateSalary } from "@/lib/salary-engine";
import { calculateTax } from "@/lib/tax-engine";
import { TrendingUp } from "lucide-react";

interface CompRow {
  label: string;
  val2025: number;
  val2026: number;
  isMonthly: boolean;
}

export function ComparisonTeaser() {
  const { ref, isVisible } = useScrollReveal(0.1, "comparison");

  const rows = useMemo<CompRow[]>(() => {
    // Salary comparison: €2000 gross monthly
    const sal2025 = calculateSalary({
      fiscalYear: 2025,
      direction: "gross-to-net",
      monthlySalary: 2000,
      payFrequency: 14,
      children: 0,
      ageGroup: "standard",
      efkaEmployeeRate: 0.1337,
      efkaEmployerRate: 0.2179,
      seniority: 0,
      hasArticle5G: false,
    });
    const sal2026 = calculateSalary({
      fiscalYear: 2026,
      direction: "gross-to-net",
      monthlySalary: 2000,
      payFrequency: 14,
      children: 0,
      ageGroup: "standard",
      efkaEmployeeRate: 0.1337,
      efkaEmployerRate: 0.2179,
      seniority: 0,
      hasArticle5G: false,
    });

    // Mplokaki comparison: €30000 gross annual
    const efka2025 = 3643.08; // 2nd category
    const efka2026 = 3731.16;
    const tax2025 = calculateTax({
      fiscalYear: 2025,
      regime: "mplokaki",
      grossIncome: 30000,
      efkaAnnual: efka2025,
      otherExpenses: 0,
      children: 0,
      ageGroup: "standard",
      isFirstYearFiling: false,
      yearsInBusiness: 5,
      clientLocation: "domestic",
      domesticIncomeShare: 100,
    });
    const tax2026 = calculateTax({
      fiscalYear: 2026,
      regime: "mplokaki",
      grossIncome: 30000,
      efkaAnnual: efka2026,
      otherExpenses: 0,
      children: 0,
      ageGroup: "standard",
      isFirstYearFiling: false,
      yearsInBusiness: 5,
      clientLocation: "domestic",
      domesticIncomeShare: 100,
    });

    return [
      {
        label: "Μισθωτός €2.000 μικτά",
        val2025: sal2025.netMonthly,
        val2026: sal2026.netMonthly,
        isMonthly: true,
      },
      {
        label: "Μπλοκάκι €30.000 (ΕΦΚΑ 2η)",
        val2025: tax2025.netIncome,
        val2026: tax2026.netIncome,
        isMonthly: false,
      },
    ];
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString("el-GR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <section
      id="comparison"
      aria-label="Σύγκριση 2025 vs 2026"
      className="relative bg-gradient-to-b from-[var(--lp-warm-white-dim)] to-white py-20 dark:to-[var(--lp-warm-white)] lg:py-28"
      ref={ref}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <p className="text-center text-sm font-semibold tracking-widest text-[var(--lp-teal)] uppercase">
            Σύγκριση
          </p>
          <h2 className="font-outfit mt-3 text-center text-3xl font-bold text-[var(--lp-navy)] dark:text-white sm:text-4xl">
            2025 vs 2026 — Τι αλλάζει;
          </h2>
        </div>

        <div
          className={`reveal-up stagger-2 mx-auto mt-12 max-w-2xl ${isVisible ? "revealed" : ""}`}
        >
          <div className="overflow-hidden rounded-2xl border border-[var(--lp-navy)]/5 bg-white dark:border-white/5 dark:bg-white/5">
            {/* Header row */}
            <div className="grid grid-cols-4 gap-4 border-b border-[var(--lp-navy)]/5 bg-[var(--lp-warm-white)]/60 px-6 py-4 dark:border-white/5">
              <div className="text-sm font-medium text-[var(--lp-text-muted)]" />
              <div className="text-center text-sm font-semibold text-[var(--lp-navy)] dark:text-white">
                2025
              </div>
              <div className="text-center text-sm font-semibold text-[var(--lp-navy)] dark:text-white">
                2026
              </div>
              <div className="text-center text-sm font-semibold text-[var(--lp-teal)]">
                Διαφορά
              </div>
            </div>

            {/* Data rows */}
            {rows.map((row) => {
              const diff = row.val2026 - row.val2025;
              const suffix = row.isMonthly ? "/μήνα" : "/έτος";

              return (
                <div
                  key={row.label}
                  className="grid grid-cols-4 items-center gap-4 border-b border-[var(--lp-navy)]/3 px-6 py-5 last:border-b-0 dark:border-white/3"
                >
                  <div className="text-sm font-semibold text-[var(--lp-navy)] dark:text-white">
                    {row.label}
                  </div>
                  <div className="text-center font-mono text-sm text-[var(--lp-text-muted)]">
                    €{fmt(row.val2025)}
                  </div>
                  <div className="text-center font-mono text-sm font-semibold text-[var(--lp-navy)] dark:text-white">
                    €{fmt(row.val2026)}
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <TrendingUp size={14} className="text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +€{fmt(Math.round(diff))}
                      <span className="hidden font-normal text-emerald-500/70 dark:text-emerald-400/70 sm:inline">
                        {suffix}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual bars — zoomed to show the difference */}
          <div className="mt-8 space-y-5">
            {rows.map((row) => {
              const diff = row.val2026 - row.val2025;
              const base = row.val2025;
              // Show the 2025 portion + the 2026 gain on one bar
              const gainPct = (diff / base) * 100;
              // Scale up so the gain is visually meaningful (min 15% visible)
              const scaledGain = Math.max(gainPct * 8, 15);
              const basePct = 100 - scaledGain;

              return (
                <div key={row.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-[var(--lp-text-muted)]">
                      {row.label}
                    </p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      +€{fmt(Math.round(diff))}{" "}
                      <span className="font-normal text-emerald-500/70 dark:text-emerald-400/70">
                        ({row.isMonthly ? "μήνα" : "έτος"})
                      </span>
                    </p>
                  </div>
                  <div className="flex h-8 overflow-hidden rounded-lg">
                    {/* 2025 base */}
                    <div
                      className="flex items-center justify-center bg-[var(--lp-navy)]/10 dark:bg-white/10 transition-all duration-1000"
                      style={{ width: isVisible ? `${basePct}%` : "0%" }}
                    >
                      <span className="text-[11px] font-semibold text-[var(--lp-text-muted)]">
                        2025: €{fmt(row.val2025)}
                      </span>
                    </div>
                    {/* 2026 gain */}
                    <div
                      className="flex items-center justify-center bg-[var(--lp-teal)] transition-all duration-1000 delay-300"
                      style={{ width: isVisible ? `${scaledGain}%` : "0%" }}
                    >
                      <span className="text-[11px] font-bold text-white">
                        +€{fmt(Math.round(diff))}
                      </span>
                    </div>
                  </div>
                  <p className="text-right text-xs font-semibold text-[var(--lp-navy)] dark:text-white">
                    2026: €{fmt(row.val2026)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
