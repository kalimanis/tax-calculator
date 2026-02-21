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

export function LandingPage() {
  return (
    <div className="font-outfit min-h-screen bg-[var(--lp-warm-white)]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <LiveDemo />
      <ComparisonTeaser />
      <TrustSection />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
