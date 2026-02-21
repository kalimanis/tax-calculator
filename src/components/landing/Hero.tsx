import { useNavigate } from "react-router-dom";
import { useCountUp } from "@/hooks/useLanding";
import { ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";

const TRUST_BADGES = [
  "Ν.5246/2025",
  "ΕΦΚΑ 2025",
  "Κλίμακα 2026",
  "100% Δωρεάν",
];

export function Hero() {
  const navigate = useNavigate();
  const { count } = useCountUp(1472, 2000);

  return (
    <section
      className="grain-overlay relative overflow-hidden bg-gradient-to-br from-[var(--lp-warm-white)] via-[var(--lp-warm-white-dim)] to-[#e8f4f3] pt-24 pb-14 lg:pt-28 lg:pb-20"
    >
      {/* Gradient mesh decoration */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[var(--lp-teal)]/8 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[var(--lp-amber)]/6 blur-[100px]" />

      <div className="grain-content mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Copy */}
          <div
            className=""
          >
            <h1 className="font-outfit text-[2.75rem] leading-[1.1] font-extrabold tracking-tight text-[var(--lp-navy)] sm:text-5xl lg:text-[3.5rem]">
              Μάθε τι πραγματικά{" "}
              <span className="relative">
                κρατάς
                <span className="absolute -bottom-1 left-0 h-3 w-full bg-[var(--lp-amber)]/25 -skew-x-3" />
              </span>
              .
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--lp-text-muted)]">
              Ο πιο ακριβής υπολογιστής φόρου και καθαρού μισθού για την Ελλάδα.
              Μπλοκάκι, ατομική, μισθωτός — ενημερωμένος για{" "}
              <span className="font-semibold text-[var(--lp-navy)]">
                2025 &amp; 2026
              </span>
              .
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/calculator")}
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
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--lp-navy)]/10 px-6 py-3.5 text-[15px] font-semibold text-[var(--lp-navy)] transition-all hover:border-[var(--lp-navy)]/20 hover:bg-[var(--lp-navy)]/3"
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
              <div className="relative rounded-2xl border border-[var(--lp-navy)]/8 bg-white/80 p-8 shadow-2xl shadow-[var(--lp-navy)]/8 backdrop-blur-sm lg:-rotate-2">
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
                  <span className="font-outfit text-5xl font-extrabold tabular-nums text-[var(--lp-navy)]">
                    €{count.toLocaleString("el-GR")}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--lp-text-muted)]">Μικτός</span>
                    <span className="font-medium text-[var(--lp-navy)]">
                      €2.000
                    </span>
                  </div>
                  <div className="h-px bg-[var(--lp-navy)]/5" />
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--lp-text-muted)]">ΕΦΚΑ</span>
                    <span className="font-medium text-red-500/80">
                      -€267,40
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--lp-text-muted)]">Φόρος</span>
                    <span className="font-medium text-red-500/80">
                      -€260,60
                    </span>
                  </div>
                  <div className="h-px bg-[var(--lp-navy)]/5" />
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-[var(--lp-teal)]">Καθαρός</span>
                    <span className="text-[var(--lp-teal)]">€1.472</span>
                  </div>
                </div>

                {/* Glow behind card */}
                <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-[var(--lp-teal)]/5 blur-2xl" />
              </div>

              {/* Floating badge */}
              <div className="mt-4 ml-auto w-fit rounded-xl border border-[var(--lp-amber)]/20 bg-white px-4 py-2.5 shadow-lg">
                <p className="text-xs font-medium text-[var(--lp-text-muted)]">
                  Πραγματικός Φόρος
                </p>
                <p className="font-outfit text-lg font-bold text-[var(--lp-amber)]">
                  15,04%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
