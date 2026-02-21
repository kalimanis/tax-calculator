import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useLanding";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section
      className="grain-overlay relative overflow-hidden bg-[var(--lp-navy)] py-20 lg:py-28"
      ref={ref}
    >
      {/* Mesh glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--lp-teal)]/8 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <h2 className="font-outfit text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Πόσα πραγματικά κρατάς;
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Μάθε σε λιγότερο από 30 δευτερόλεπτα.
          </p>
        </div>

        <div
          className={`reveal-up stagger-2 mt-10 ${isVisible ? "revealed" : ""}`}
        >
          <button
            onClick={() => navigate("/calculator")}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--lp-amber)] px-8 py-4 text-base font-bold text-[var(--lp-navy)] shadow-2xl shadow-[var(--lp-amber)]/20 transition-all hover:bg-[var(--lp-amber-light)] hover:shadow-2xl hover:shadow-[var(--lp-amber)]/30"
          >
            Υπολόγισε Τώρα — Δωρεάν
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
