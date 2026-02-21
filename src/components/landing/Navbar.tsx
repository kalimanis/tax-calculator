import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Μισθωτός", href: "#misthotos" },
  { label: "Ελ. Επαγγελματίας", href: "#mplokaki" },
  { label: "Σύγκριση", href: "#comparison" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`font-outfit fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--lp-warm-white)]/85 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--lp-navy)] text-sm font-bold text-white">
            Φ
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--lp-navy)]">
            ΦοροΥπολογιστής
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--lp-text-muted)] transition-colors hover:text-[var(--lp-navy)]"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => navigate("/calculator")}
            className="rounded-full bg-[var(--lp-teal)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--lp-teal)]/25 transition-all hover:bg-[var(--lp-teal-dark)] hover:shadow-xl hover:shadow-[var(--lp-teal)]/30"
          >
            Υπολόγισε Τώρα
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[var(--lp-navy)] transition-colors hover:bg-[var(--lp-navy)]/5 md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--lp-navy)]/5 bg-[var(--lp-warm-white)]/95 px-5 pb-5 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--lp-text-muted)] transition-colors hover:bg-[var(--lp-navy)]/5 hover:text-[var(--lp-navy)]"
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
              Υπολόγισε Τώρα
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
