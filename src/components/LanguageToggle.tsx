import { useTranslation } from "react-i18next";

export function LanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const select = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex rounded-lg bg-[var(--lp-navy)]/5 p-0.5 dark:bg-white/10">
      {(["ΕΛ", "EN"] as const).map((label) => {
        const lang = label === "ΕΛ" ? "el" : "en";
        const active = current === lang;
        return (
          <button
            key={lang}
            onClick={() => select(lang)}
            className={`rounded-md px-2 py-1 text-xs font-semibold transition-all ${
              active
                ? "bg-white text-[var(--lp-navy)] shadow-sm dark:bg-white/20 dark:text-white"
                : `text-[var(--lp-text-muted)] hover:text-[var(--lp-navy)] dark:hover:text-white ${className ?? ""}`
            }`}
            aria-label={lang === "el" ? "Αλλαγή σε Ελληνικά" : "Switch to English"}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
