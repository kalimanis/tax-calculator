import { Sparkles, TrendingUp, Wrench, Clock } from "lucide-react";
import type { ChangelogEntry as ChangelogEntryType, ChangeType } from "@/data/changelog";
import { formatGreekDate } from "@/lib/changelog-utils";

const CHANGE_TYPE_CONFIG: Record<ChangeType, { label: string; color: string; icon: typeof Sparkles }> = {
  feature: { label: "Νέο", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300", icon: Sparkles },
  improvement: { label: "Βελτίωση", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", icon: TrendingUp },
  fix: { label: "Διόρθωση", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300", icon: Wrench },
  coming_soon: { label: "Σύντομα", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300", icon: Clock },
};

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
  isLatest: boolean;
  index: number;
}

export function ChangelogEntry({ entry, isLatest, index }: ChangelogEntryProps) {
  return (
    <div
      className="reveal-up relative pl-8"
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 ${
          isLatest
            ? "border-[var(--lp-teal)] bg-[var(--lp-teal)] shadow-md shadow-[var(--lp-teal)]/30"
            : "border-[var(--lp-text-light)] bg-[var(--lp-warm-white)]"
        }`}
      />

      {/* Header */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-outfit text-lg font-bold text-[var(--lp-text)]">
          v{entry.version}
        </span>
        <span className="text-sm text-[var(--lp-text-light)]">
          — {formatGreekDate(entry.date)}
        </span>
        {isLatest && (
          <span className="rounded-full bg-[var(--lp-teal)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--lp-teal)]">
            Τελευταία
          </span>
        )}
      </div>

      <h3 className="font-outfit mb-1 text-base font-semibold text-[var(--lp-text)]">
        {entry.title}
      </h3>
      {entry.description && (
        <p className="mb-3 text-sm text-[var(--lp-text-muted)]">{entry.description}</p>
      )}

      {/* Items */}
      <ul className="space-y-1.5">
        {entry.items.map((item) => {
          const config = CHANGE_TYPE_CONFIG[item.type];
          const Icon = config.icon;
          return (
            <li key={item.text} className="flex items-start gap-2 text-sm">
              <span className={`mt-0.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${config.color}`}>
                <Icon className="h-3 w-3" />
                {config.label}
              </span>
              <span className="text-[var(--lp-text-muted)]">{item.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
