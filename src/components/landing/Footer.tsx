import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, History } from "lucide-react";
import { ChangelogBadge } from "@/components/ChangelogBadge";
import { Logo } from "@/components/Logo";

// Obfuscated to prevent scraping — assembled at runtime
const EMAIL_PARTS = ["ilias.kalemanis", "gmail.com"];

export function Footer() {
  const { t } = useTranslation();
  const handleContact = useCallback(() => {
    window.location.href = `mailto:${EMAIL_PARTS[0]}@${EMAIL_PARTS[1]}`;
  }, []);

  return (
    <footer className="border-t border-[var(--lp-navy)]/5 bg-[var(--lp-warm-white)] py-10 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <Logo size="sm" />

          {/* Disclaimer */}
          <p className="max-w-lg text-xs leading-relaxed text-[var(--lp-text-light)]">
            {t("footer.disclaimer")}
          </p>

          {/* Privacy note */}
          <p className="max-w-lg text-xs leading-relaxed text-[var(--lp-text-light)]">
            {t("footer.privacy")}
          </p>

          {/* Copyright & contact */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--lp-text-light)]">
            <span>© {new Date().getFullYear()}</span>
            <span className="text-[var(--lp-navy)]/10">·</span>
            <span>{t("footer.madeWith")}</span>
            <span className="text-[var(--lp-navy)]/10">·</span>
            <Link
              to="/changelog"
              className="inline-flex items-center gap-1 transition-colors hover:text-[var(--lp-teal)]"
            >
              <History size={12} />
              {t("footer.changelog")}
              <ChangelogBadge />
            </Link>
            <span className="text-[var(--lp-navy)]/10">·</span>
            <button
              onClick={handleContact}
              className="inline-flex items-center gap-1 transition-colors hover:text-[var(--lp-teal)] select-none"
            >
              <Mail size={12} />
              {t("footer.contact")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
