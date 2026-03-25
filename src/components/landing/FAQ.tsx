import { useState } from "react";
import { useScrollReveal } from "@/hooks/useLanding";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

type FAQItemType = { question: string; answer: string };

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItemType;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--lp-navy)]/5 last:border-b-0 dark:border-white/5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-[var(--lp-teal)]"
      >
        <span className="font-outfit pr-4 text-[15px] font-semibold text-[var(--lp-navy)] dark:text-white">
          {item.question}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[var(--lp-text-light)] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-[var(--lp-text-muted)]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal(0.1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = t("faq.items", { returnObjects: true }) as FAQItemType[];

  return (
    <section
      id="faq"
      aria-label={t("faq.title")}
      className="bg-gradient-to-b from-white to-[var(--lp-warm-white-dim)] py-20 dark:from-[var(--lp-warm-white)] dark:to-[var(--lp-warm-white-dim)] lg:py-28"
      ref={ref}
    >
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <p className="text-center text-sm font-semibold tracking-widest text-[var(--lp-teal)] uppercase">
            {t("faq.label")}
          </p>
          <h2 className="font-outfit mt-3 text-center text-3xl font-bold text-[var(--lp-navy)] dark:text-white sm:text-4xl">
            {t("faq.title")}
          </h2>
        </div>

        <div
          className={`reveal-up stagger-2 mt-12 rounded-2xl border border-[var(--lp-navy)]/5 bg-white px-6 dark:border-white/5 dark:bg-white/5 ${isVisible ? "revealed" : ""}`}
        >
          {items.map((item, i) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => {
                const isOpening = openIndex !== i;
                setOpenIndex(isOpening ? i : null);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
