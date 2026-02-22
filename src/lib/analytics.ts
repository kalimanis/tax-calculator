type CalculatorMode = "employee" | "mplokaki" | "atomiki" | "company";

interface TrackEventData {
  [key: string]: string | number | boolean;
}

interface UmamiTracker {
  track: (eventName: string, data?: TrackEventData) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

/** Track a custom event in Umami. Safe to call if Umami is not loaded. */
function trackEvent(eventName: string, data?: TrackEventData): void {
  try {
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track(eventName, data);
    }
  } catch {
    // Silently fail — analytics should never break the app
  }
}

// ─── Landing Page Events ───

export function trackLandingCTA(location: "hero" | "final" | "demo" | "comparison") {
  trackEvent("cta_click", { location });
}

export function trackLandingSection(section: string) {
  trackEvent("section_view", { section });
}

// ─── Calculator Events ───

export function trackCalculation(mode: CalculatorMode, data: {
  fiscalYear: number;
  grossAmount: number;
  children: number;
}) {
  trackEvent("calculation", {
    mode,
    fiscal_year: data.fiscalYear,
    gross_range: getAmountRange(data.grossAmount),
    children: data.children,
  });
}

export function trackModeSwitch(from: CalculatorMode, to: CalculatorMode) {
  trackEvent("mode_switch", { from, to });
}

export function trackYearSwitch(year: number) {
  trackEvent("year_switch", { year });
}

export function trackComparison(type: "year" | "mode") {
  trackEvent("comparison_view", { type });
}

export function trackDirection(direction: "gross-to-net" | "net-to-gross") {
  trackEvent("direction_switch", { direction });
}

export function trackArticle5G(enabled: boolean) {
  trackEvent("article_5g_toggle", { enabled });
}

export function trackForeignClient(clientLocation: string) {
  trackEvent("foreign_client", { client_location: clientLocation });
}

export function trackShare() {
  trackEvent("share_url");
}

export function trackFAQOpen(question: string) {
  trackEvent("faq_open", { question });
}

// ─── Changelog Events ───

export function trackChangelogView() {
  trackEvent("changelog_viewed");
}

export function trackWhatsNewShown() {
  trackEvent("whats_new_shown");
}

export function trackWhatsNewDismissed() {
  trackEvent("whats_new_dismissed");
}

// ─── Helpers ───

/** Bucket gross amounts into ranges for privacy (don't track exact amounts) */
function getAmountRange(amount: number): string {
  if (amount <= 10000) return "0-10k";
  if (amount <= 20000) return "10-20k";
  if (amount <= 30000) return "20-30k";
  if (amount <= 50000) return "30-50k";
  if (amount <= 80000) return "50-80k";
  return "80k+";
}
