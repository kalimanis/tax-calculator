import { Helmet } from "@dr.pogodin/react-helmet";
import { SITE_URL } from "@/lib/constants";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { LiveDemo } from "@/components/landing/LiveDemo";
import { ComparisonTeaser } from "@/components/landing/ComparisonTeaser";
import { TrustSection } from "@/components/landing/TrustSection";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const FAQ_SCHEMA = [
  {
    "@type": "Question",
    name: "Πώς υπολογίζεται ο καθαρός μισθός;",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Μικτός − ΕΦΚΑ (13,37%) = Φορολογητέο → Κλίμακα Άρθ.15 − Μείωση Άρθ.16 = Φόρος → Καθαρός.",
    },
  },
  {
    "@type": "Question",
    name: "Τι αλλάζει το 2026;",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Νέα κλίμακα (Ν.5246/2025) με μειωμένους συντελεστές, νέο 6ο κλιμάκιο €40-60K στο 39%, μειώσεις για γονείς και νέους.",
    },
  },
  {
    "@type": "Question",
    name: "Αποθηκεύονται τα δεδομένα μου;",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Όχι. Όλοι οι υπολογισμοί γίνονται αποκλειστικά στη συσκευή σου.",
    },
  },
];

const WEB_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ΦοροΥπολογιστής",
  url: SITE_URL,
  description:
    "Δωρεάν υπολογιστής φόρου εισοδήματος και καθαρού μισθού για Ελλάδα. Μισθωτός, μπλοκάκι, ατομική — ενημερωμένος για 2025 & 2026.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  inLanguage: "el",
};

const FAQ_PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SCHEMA,
};

export function LandingPage() {
  return (
    <div className="font-outfit min-h-screen bg-[var(--lp-warm-white)]">
      <Helmet>
        <title>ΦοροΥπολογιστής — Υπολογιστής Φόρου & Μισθού 2025/2026</title>
        <meta
          name="description"
          content="Δωρεάν υπολογιστής φόρου εισοδήματος και καθαρού μισθού για Ελλάδα. Μισθωτός, μπλοκάκι, ατομική — ενημερωμένος για 2025 & 2026."
        />
        <meta
          name="keywords"
          content="υπολογιστής φόρου, καθαρός μισθός, φόρος εισοδήματος, μπλοκάκι, ατομική επιχείρηση, ΕΦΚΑ, Ελλάδα, 2025, 2026"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <link rel="alternate" hrefLang="el" href={`${SITE_URL}/`} />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="ΦοροΥπολογιστής — Υπολογιστής Φόρου & Μισθού"
        />
        <meta
          property="og:description"
          content="Δωρεάν υπολογιστής φόρου εισοδήματος και καθαρού μισθού για Ελλάδα."
        />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="el_GR" />
        <meta property="og:site_name" content="ΦοροΥπολογιστής" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="ΦοροΥπολογιστής — Υπολογιστής Φόρου & Μισθού"
        />
        <meta
          name="twitter:description"
          content="Δωρεάν υπολογιστής φόρου εισοδήματος και καθαρού μισθού για Ελλάδα."
        />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        <script type="application/ld+json">
          {JSON.stringify(WEB_APP_SCHEMA)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(FAQ_PAGE_SCHEMA)}
        </script>
      </Helmet>

      <header>
        <Navbar />
      </header>
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <LiveDemo />
        <ComparisonTeaser />
        <TrustSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
