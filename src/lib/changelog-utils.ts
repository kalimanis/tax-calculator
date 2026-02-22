import { LATEST_VERSION } from "@/data/changelog";

const STORAGE_KEYS = {
  lastSeen: "changelog_last_seen",
  whatsNewDismissed: "whats_new_dismissed",
  hasVisited: "has_visited",
} as const;

export function hasUnseenChangelog(): boolean {
  const lastSeen = localStorage.getItem(STORAGE_KEYS.lastSeen);
  return !lastSeen || lastSeen !== LATEST_VERSION;
}

export function markChangelogSeen(): void {
  localStorage.setItem(STORAGE_KEYS.lastSeen, LATEST_VERSION);
}

export function shouldShowWhatsNew(): boolean {
  const hasVisited = localStorage.getItem(STORAGE_KEYS.hasVisited);

  if (!hasVisited) {
    localStorage.setItem(STORAGE_KEYS.hasVisited, "true");
    return false;
  }

  const dismissed = localStorage.getItem(STORAGE_KEYS.whatsNewDismissed);
  return dismissed !== LATEST_VERSION;
}

export function dismissWhatsNew(): void {
  localStorage.setItem(STORAGE_KEYS.whatsNewDismissed, LATEST_VERSION);
}

export function formatGreekDate(isoDate: string): string {
  return new Intl.DateTimeFormat("el-GR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}
