import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { BracketResult } from "@/lib/types";

interface BracketBreakdownProps {
  brackets: BracketResult[];
  grossTax: number;
}

const BRACKET_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
];

export function BracketBreakdown({ brackets, grossTax }: BracketBreakdownProps) {
  const { t } = useTranslation();
  if (brackets.length === 0) return null;

  const maxTax = Math.max(...brackets.map((b) => b.tax), 1);

  return (
    <Accordion type="single" collapsible defaultValue="brackets">
      <AccordionItem value="brackets">
        <AccordionTrigger className="text-base font-semibold">
          {t("brackets.title")}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {brackets.map((bracket, i) => {
              const barWidth = (bracket.tax / maxTax) * 100;
              const isModified = bracket.rate !== bracket.baseRate;
              const maxLabel =
                bracket.max === Infinity
                  ? "+"
                  : `– €${bracket.max.toLocaleString("el-GR")}`;

              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {t("brackets.bracket")} {i + 1}:
                      </span>
                      <span className="text-muted-foreground">
                        €{bracket.min.toLocaleString("el-GR")} {maxLabel}
                      </span>
                      <span className="font-medium">
                        @{" "}
                        {isModified ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help text-emerald-600 underline decoration-dotted dark:text-emerald-400">
                                {formatPercent(bracket.rate * 100)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {t("brackets.baseRate", { rate: formatPercent(bracket.baseRate * 100) })}
                                {" → "}
                                {t("brackets.reducedRate", { rate: formatPercent(bracket.rate * 100) })}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          formatPercent(bracket.rate * 100)
                        )}
                      </span>
                    </div>
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(bracket.tax)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${BRACKET_COLORS[i % BRACKET_COLORS.length]}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="font-semibold">{t("brackets.total")} {t("brackets.tax")}:</span>
              <span className="text-lg font-bold tabular-nums text-rose-600 dark:text-rose-400">
                {formatCurrency(grossTax)}
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
