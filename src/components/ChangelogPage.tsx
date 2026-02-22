import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { ArrowLeft } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { CHANGELOG, LATEST_VERSION } from "@/data/changelog";
import { markChangelogSeen } from "@/lib/changelog-utils";
import { trackChangelogView } from "@/lib/analytics";
import { ChangelogEntry } from "./ChangelogEntry";
import { useDarkMode } from "@/hooks/useDarkMode";

export function ChangelogPage() {
  const [dark] = useDarkMode();

  useEffect(() => {
    markChangelogSeen();
    trackChangelogView();
  }, []);

  // Trigger reveal animations after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal-up").forEach((el) => el.classList.add("revealed"));
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-outfit min-h-screen bg-[var(--lp-warm-white)]">
      <Helmet>
        <title>Ιστορικό Αλλαγών — Forologisi.app</title>
        <meta
          name="description"
          content="Δείτε τις τελευταίες ενημερώσεις και βελτιώσεις στον φορολογικό υπολογιστή Forologisi."
        />
        <link rel="canonical" href={`${SITE_URL}/changelog`} />
      </Helmet>

      <div className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
        {/* Header */}
        <div className="reveal-up mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--lp-text)]">
            Ιστορικό Αλλαγών
          </h1>
          <p className="mt-2 text-[var(--lp-text-muted)]">
            Τι νέο υπάρχει στο Forologisi
          </p>
        </div>

        {/* Timeline */}
        <div className="relative space-y-10">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-0 w-0.5 bg-[var(--lp-text-light)]/20" />

          {CHANGELOG.map((entry, i) => (
            <ChangelogEntry key={entry.version} entry={entry} isLatest={entry.version === LATEST_VERSION} index={i + 1} />
          ))}
        </div>

        {/* Back link */}
        <div className="reveal-up mt-12" style={{ transitionDelay: `${(CHANGELOG.length + 1) * 120}ms` }}>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--lp-teal)] transition-colors hover:text-[var(--lp-teal-dark)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Πίσω στον Υπολογιστή
          </Link>
        </div>
      </div>
    </div>
  );
}
