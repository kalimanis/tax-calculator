import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, toggleDark] = useDarkMode();
  const navigate = useNavigate();

  const NAV_LINKS = [
    { label: t("navbar.employee"), href: "#misthotos" },
    { label: t("navbar.freelancer"), href: "#mplokaki" },
    { label: t("navbar.comparison"), href: "#comparison" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`font-outfit fixed top-0 right-0 left-0 z-50 will-change-transform transition-all duration-300 ${
        scrolled
          ? "bg-[var(--lp-warm-white)] shadow-sm md:bg-[var(--lp-warm-white)]/85 md:backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#" className="flex items-center">
          <Logo />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--lp-text-muted)] transition-colors hover:text-[var(--lp-navy)] dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => navigate("/calculator")}
            className="rounded-full bg-[var(--lp-teal)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--lp-teal)]/25 transition-all hover:bg-[var(--lp-teal-dark)] hover:shadow-xl hover:shadow-[var(--lp-teal)]/30"
          >
            {t("navbar.cta")}
          </button>
          <LanguageToggle className="text-[var(--lp-text-muted)] hover:text-[var(--lp-navy)] dark:hover:text-white" />
          <button
            onClick={toggleDark}
            className="rounded-lg p-2 text-[var(--lp-text-muted)] transition-colors hover:bg-[var(--lp-navy)]/5 hover:text-[var(--lp-navy)] dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={dark ? t("ui.lightTheme") : t("ui.darkTheme")}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle className="text-[var(--lp-navy)] dark:text-white" />
          <button
            onClick={toggleDark}
            className="rounded-lg p-2 text-[var(--lp-navy)] transition-colors hover:bg-[var(--lp-navy)]/5 dark:text-white dark:hover:bg-white/10"
            aria-label={dark ? t("ui.lightTheme") : t("ui.darkTheme")}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-[var(--lp-navy)] transition-colors hover:bg-[var(--lp-navy)]/5 dark:text-white dark:hover:bg-white/10"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--lp-navy)]/5 bg-[var(--lp-warm-white)] px-5 pb-5 dark:border-white/5 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--lp-text-muted)] transition-colors hover:bg-[var(--lp-navy)]/5 hover:text-[var(--lp-navy)] dark:hover:bg-white/5 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/calculator");
              }}
              className="mt-1 rounded-full bg-[var(--lp-teal)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--lp-teal)]/25"
            >
              {t("navbar.cta")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
