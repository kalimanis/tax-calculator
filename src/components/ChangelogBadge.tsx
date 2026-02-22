import { hasUnseenChangelog } from "@/lib/changelog-utils";

export function ChangelogBadge() {
  if (!hasUnseenChangelog()) return null;

  return (
    <span className="relative flex items-center">
      <span className="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-[var(--lp-teal)]" />
      <span className="ml-1 text-xs font-medium text-[var(--lp-teal)]">Νέο</span>
    </span>
  );
}
