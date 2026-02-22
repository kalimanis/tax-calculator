import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sparkles } from "lucide-react";
import { CHANGELOG, LATEST_VERSION } from "@/data/changelog";
import { shouldShowWhatsNew, dismissWhatsNew, formatGreekDate } from "@/lib/changelog-utils";
import { trackWhatsNewShown, trackWhatsNewDismissed } from "@/lib/analytics";

export function WhatsNewModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const latest = CHANGELOG.find((e) => e.version === LATEST_VERSION) ?? CHANGELOG[0];

  useEffect(() => {
    if (shouldShowWhatsNew()) {
      const timer = setTimeout(() => {
        setOpen(true);
        trackWhatsNewShown();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setOpen(false);
    dismissWhatsNew();
    trackWhatsNewDismissed();
  }, []);

  const handleViewAll = useCallback(() => {
    handleDismiss();
    navigate("/changelog");
  }, [handleDismiss, navigate]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleDismiss]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="font-outfit relative w-full max-w-md animate-[slide-up_0.3s_ease-out] rounded-2xl bg-[var(--lp-warm-white)] p-6 shadow-2xl dark:shadow-black/40">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 rounded-lg p-1 text-[var(--lp-text-light)] transition-colors hover:text-[var(--lp-text)]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--lp-teal)]" />
          <h2 className="text-lg font-bold text-[var(--lp-text)]">Τι Νέο στο Forologisi</h2>
        </div>

        {/* Version info */}
        <div className="mb-3 flex items-center gap-2 text-sm text-[var(--lp-text-muted)]">
          <span className="font-semibold text-[var(--lp-text)]">v{latest.version}</span>
          <span>— {formatGreekDate(latest.date)}</span>
        </div>

        <h3 className="mb-3 font-semibold text-[var(--lp-text)]">{latest.title}</h3>

        {/* Items */}
        <ul className="mb-5 space-y-1.5">
          {latest.items.map((item) => (
            <li key={item.text} className="flex items-start gap-2 text-sm text-[var(--lp-text-muted)]">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--lp-teal)]" />
              {item.text}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={handleViewAll}
          className="w-full rounded-xl bg-[var(--lp-teal)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--lp-teal-dark)]"
        >
          Δείτε όλες τις αλλαγές →
        </button>
      </div>
    </div>
  );
}
