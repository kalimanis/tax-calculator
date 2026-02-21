import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCountUp } from "@/hooks/useLanding";
import { calculateSalary } from "@/lib/salary-engine";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";

const TRUST_BADGES = [
  "Ν.5246/2025",
  "ΕΦΚΑ 2025",
  "Κλίμακα 2026",
  "100% Δωρεάν",
];

const HERO_GROSS = 2000;

export function Hero() {
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

  return (
    <section
      id="hero"
      aria-label="Κύρια παρουσίαση"
      className="grain-overlay relative overflow-hidden bg-gradient-to-br from-[var(--lp-warm-white)] via-[var(--lp-warm-white-dim)] to-[#e8f4f3] pt-32 pb-14 dark:to-[#0d9488]/5 lg:pt-36 lg:pb-20"
    >
      {/* Gradient mesh decoration — hidden on mobile for perf */}
      <div className="pointer-events-none absolute -top-32 -right-32 hidden h-[500px] w-[500px] rounded-full bg-[var(--lp-teal)]/8 blur-[120px] md:block" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 hidden h-[400px] w-[400px] rounded-full bg-[var(--lp-amber)]/6 blur-[100px] md:block" />

      <div className="grain-content mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Copy */}
          <div
            className=""
          >
            <h1 className="font-outfit text-[2.75rem] leading-[1.1] font-extrabold tracking-tight text-[var(--lp-navy)] dark:text-white sm:text-5xl lg:text-[3.5rem]">
              Μάθε τι πραγματικά{" "}
              <span className="relative">
                κρατάς
                <span className="absolute -bottom-1 left-0 h-3 w-full bg-[var(--lp-amber)]/25 -skew-x-3" />
              </span>
              .
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--lp-text-muted)]">
              Υπολόγισε φόρο εισοδήματος και καθαρό μισθό —
              μισθωτός, μπλοκάκι ή ατομική — με βάση την κλίμακα{" "}
              <span className="font-semibold text-[var(--lp-navy)] dark:text-white">
                2025 &amp; 2026
              </span>
              .
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/calculator")}
                data-event="cta-hero-primary"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--lp-teal)] px-7 py-3.5 text-[15px] font-semibold text-white shadow-xl shadow-[var(--lp-teal)]/20 transition-all hover:bg-[var(--lp-teal-dark)] hover:shadow-2xl hover:shadow-[var(--lp-teal)]/30"
              >
                Υπολόγισε τον Μισθό σου
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--lp-navy)]/10 px-6 py-3.5 text-[15px] font-semibold text-[var(--lp-navy)] transition-all hover:border-[var(--lp-navy)]/20 hover:bg-[var(--lp-navy)]/3 dark:border-white/10 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/5"
              >
                Δες πώς λειτουργεί
                <ChevronDown size={18} />
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--lp-text-muted)]"
                >
                  <CheckCircle2
                    size={15}
                    className="text-[var(--lp-teal)]"
                  />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Calculator preview card */}
          <div
            className=""
          >
            <div className="relative mx-auto max-w-md lg:mx-0 lg:ml-auto">
              {/* Floating card with tilt */}
              <div className="relative rounded-2xl border border-[var(--lp-navy)]/8 bg-white p-8 shadow-2xl shadow-[var(--lp-navy)]/8 dark:border-white/8 dark:bg-white/5 md:bg-white/80 md:backdrop-blur-sm lg:-rotate-2">
                {/* Decorative dots */}
                <div className="mb-6 flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                  <div className="h-3 w-3 rounded-full bg-green-400/60" />
                </div>

                <p className="text-sm font-medium tracking-wide text-[var(--lp-text-light)] uppercase">
                  Καθαρός Μηνιαίος Μισθός
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-outfit text-5xl font-extrabold tabular-nums text-[var(--lp-navy)] dark:text-white">
                    €{count.toLocaleString("el-GR")}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--lp-text-muted)]">Μικτός</span>
                    <span className="font-medium text-[var(--lp-navy)] dark:text-white">
                      {formatCurrency(HERO_GROSS)}
                    </span>
                  </div>
                  <div className="h-px bg-[var(--lp-navy)]/5 dark:bg-white/5" />
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--lp-text-muted)]">ΕΦΚΑ</span>
                    <span className="font-medium text-red-500/80 dark:text-red-400/80">
                      -{formatCurrency(result.efka)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--lp-text-muted)]">Φόρος</span>
                    <span className="font-medium text-red-500/80 dark:text-red-400/80">
                      -{formatCurrency(result.tax)}
                    </span>
                  </div>
                  <div className="h-px bg-[var(--lp-navy)]/5 dark:bg-white/5" />
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-[var(--lp-teal)]">Καθαρός</span>
                    <span className="text-[var(--lp-teal)]">{formatCurrency(result.net)}</span>
                  </div>
                </div>

                {/* Glow behind card — hidden on mobile for perf */}
                <div className="pointer-events-none absolute -inset-4 -z-10 hidden rounded-3xl bg-[var(--lp-teal)]/5 blur-2xl md:block" />
              </div>

              {/* Floating badge */}
              <div className="mt-4 ml-auto w-fit rounded-xl border border-[var(--lp-amber)]/20 bg-white px-4 py-2.5 shadow-lg dark:bg-white/5">
                <p className="text-xs font-medium text-[var(--lp-text-muted)]">
                  Πραγματικός Φόρος
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
