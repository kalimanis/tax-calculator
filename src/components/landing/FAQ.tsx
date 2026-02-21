import { useState } from "react";
import { useScrollReveal } from "@/hooks/useLanding";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Πώς υπολογίζεται ο καθαρός μισθός;",
    answer:
      "Μικτός − ΕΦΚΑ (13,37%) = Φορολογητέο → Κλίμακα Άρθ.15 − Μείωση Άρθ.16 = Φόρος → Καθαρός. Ο υπολογισμός γίνεται αυτόματα με βάση τον ΚΦΕ.",
  },
  {
    question: "Τι αλλάζει το 2026;",
    answer:
      "Νέα κλίμακα (Ν.5246/2025) με μειωμένους συντελεστές, ειδικά για οικογένειες και νέους. Νέο 6ο κλιμάκιο €40-60K στο 39%, μειώσεις στα πρώτα κλιμάκια για γονείς.",
  },
  {
    question: "Καλύπτει πελάτες εξωτερικού;",
    answer:
      "Ναι. Μπλοκάκι με ξένους πελάτες: χωρίς παρακράτηση 20%, αλλά ίδιος φόρος (ΠΟΛ.1029/2018). Υποστηρίζεται εγχώριο, εξωτερικό και μικτό.",
  },
  {
    question: "Είναι ακριβής ο υπολογισμός;",
    answer:
      "Βασίζεται στον ΚΦΕ και τις εγκυκλίους ΕΦΚΑ. Μικρές αποκλίσεις (±€1-2) λόγω στρογγυλοποίησης μισθοδοσίας.",
  },
  {
    question: "Τι είναι το Άρθρο 5Γ;",
    answer:
      "50% απαλλαγή φόρου για εργαζομένους που μεταφέρουν φορολογική κατοικία στην Ελλάδα. Ισχύει για μισθωτούς και ελεύθερους επαγγελματίες.",
  },
  {
    question: "Αποθηκεύονται τα δεδομένα μου;",
    answer:
      "Όχι. Τίποτα δεν αποστέλλεται σε server. Όλοι οι υπολογισμοί γίνονται αποκλειστικά στη συσκευή σου.",
  },
];

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof FAQ_ITEMS)[number];
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
  const { ref, isVisible } = useScrollReveal(0.1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-label="Συχνές ερωτήσεις"
      className="bg-gradient-to-b from-white to-[var(--lp-warm-white-dim)] py-20 dark:from-[var(--lp-warm-white)] dark:to-[var(--lp-warm-white-dim)] lg:py-28"
      ref={ref}
    >
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`}>
          <p className="text-center text-sm font-semibold tracking-widest text-[var(--lp-teal)] uppercase">
            FAQ
          </p>
          <h2 className="font-outfit mt-3 text-center text-3xl font-bold text-[var(--lp-navy)] dark:text-white sm:text-4xl">
            Συχνές Ερωτήσεις
          </h2>
        </div>

        <div
          className={`reveal-up stagger-2 mt-12 rounded-2xl border border-[var(--lp-navy)]/5 bg-white px-6 dark:border-white/5 dark:bg-white/5 ${isVisible ? "revealed" : ""}`}
        >
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
