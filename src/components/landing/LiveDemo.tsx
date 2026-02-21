import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollReveal, useCountUp } from "@/hooks/useLanding";
import { calculateSalary } from "@/lib/salary-engine";
import { calculateTax } from "@/lib/tax-engine";
import { ArrowRight } from "lucide-react";
import type { FiscalYear } from "@/lib/types";

type DemoMode = "misthotos" | "mplokaki";

export function LiveDemo() {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal(0.1);
  const [mode, setMode] = useState<DemoMode>("misthotos");
  const [amount, setAmount] = useState(1500);
  const [year] = useState<FiscalYear>(2026);

  const result = useMemo(() => {
    if (mode === "misthotos") {
      const salaryResult = calculateSalary({
        fiscalYear: year,
        direction: "gross-to-net",
        monthlySalary: amount,
        payFrequency: 14,
        children: 0,
        ageGroup: "standard",
        efkaEmployeeRate: 0.1337,
        efkaEmployerRate: 0.2179,
        seniority: 0,
        hasArticle5G: false,
      });
      return {
        net: salaryResult.netMonthly,
        label: "Καθαρός Μηνιαίος",
      };
    }

    const annualIncome = amount * 12;
    const efkaAnnual = 3731.16; // 2nd EFKA category 2026
    const taxResult = calculateTax({
      fiscalYear: year,
      regime: "mplokaki",
      grossIncome: annualIncome,
      efkaAnnual,
      otherExpenses: 0,
      children: 0,
      ageGroup: "standard",
      isFirstYearFiling: false,
      yearsInBusiness: 5,
      clientLocation: "domestic",
      domesticIncomeShare: 100,
    });
    return {
      net: Math.round((taxResult.netIncome / 12) * 100) / 100,
      label: "Καθαρός Μηνιαίος (εκτ.)",
    };
  }, [mode, amount, year]);

  const { count } = useCountUp(Math.round(result.net), 600);

  return (
    <section
      id="demo"
      className="relative overflow-hidden bg-[var(--lp-navy)] py-20 lg:py-28"
      ref={ref}
    >
      {/* Mesh decorations */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-[var(--lp-teal)]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-[300px] w-[300px] rounded-full bg-[var(--lp-amber)]/8 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <p className="text-center text-sm font-semibold tracking-widest text-[var(--lp-teal-light)] uppercase">
            Δοκίμασέ το
          </p>
          <h2 className="font-outfit mt-3 text-center text-3xl font-bold text-white sm:text-4xl">
            Δοκίμασέ το τώρα
          </h2>
        </div>

        <div
          className={`reveal-up stagger-2 mx-auto mt-12 max-w-lg ${isVisible ? "revealed" : ""}`}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            {/* Mode toggle */}
            <div className="mb-6 flex rounded-xl bg-white/5 p-1">
              {(["misthotos", "mplokaki"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                    mode === m
                      ? "bg-[var(--lp-teal)] text-white shadow-lg shadow-[var(--lp-teal)]/25"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {m === "misthotos" ? "Μισθωτός" : "Μπλοκάκι"}
                </button>
              ))}
            </div>

            {/* Input */}
            <label className="block text-sm font-medium text-white/60">
              {mode === "misthotos" ? "Μικτός Μηνιαίος Μισθός" : "Μηνιαίος Τζίρος"}
            </label>
            <div className="relative mt-2">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-lg font-semibold text-white/40">
                €
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setAmount(Math.max(0, Math.min(val, 20000)));
                }}
                className="font-outfit w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pr-4 pl-10 text-2xl font-bold text-white tabular-nums outline-none transition-colors focus:border-[var(--lp-teal)]/50 focus:ring-2 focus:ring-[var(--lp-teal)]/20"
              />
            </div>

            {/* Result */}
            <div className="mt-8 rounded-xl bg-white/5 p-6 text-center">
              <p className="text-sm font-medium text-white/50">
                {result.label}
              </p>
              <p className="font-outfit mt-2 text-5xl font-extrabold tabular-nums text-[var(--lp-teal-light)]">
                €{count.toLocaleString("el-GR")}
              </p>
              <p className="mt-1 text-xs text-white/30">
                Φορολογικό έτος {year}
                {mode === "mplokaki" && " · ΕΦΚΑ 2η κατηγορία"}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                const params = new URLSearchParams();
                params.set("y", String(year));
                params.set("r", mode);
                if (mode === "misthotos") {
                  params.set("ms", String(amount));
                } else {
                  params.set("gi", String(amount * 12));
                }
                navigate(`/calculator?${params.toString()}`);
              }}
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--lp-amber)] py-3.5 text-sm font-bold text-[var(--lp-navy)] transition-all hover:bg-[var(--lp-amber-light)] hover:shadow-xl hover:shadow-[var(--lp-amber)]/20"
            >
              Δες αναλυτικά
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
