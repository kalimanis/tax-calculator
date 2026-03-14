import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { SalaryResult } from "@/lib/types";

interface SalaryResultsProps {
  result: SalaryResult;
}

interface MetricRowProps {
  label: string;
  value: string;
  colorClass?: string;
  tooltip?: string;
}

function MetricRow({ label, value, colorClass, tooltip }: MetricRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5">
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-sm">{label}</span>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 shrink-0 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[min(20rem,calc(100vw-2rem))]">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <span className={`font-semibold tabular-nums whitespace-nowrap ${colorClass ?? ""}`}>
        {value}
      </span>
    </div>
  );
}

export function SalaryResults({ result }: SalaryResultsProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {t("salary.results.netMonthly")}
          </span>
          <span className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrency(result.netMonthly)}
          </span>
        </div>

        <div className="grid gap-x-6 sm:grid-cols-2">
          <div className="divide-y">
            <MetricRow
              label={t("salary.results.grossAnnual")}
              value={formatCurrency(result.grossAnnual)}
              colorClass="text-blue-600 dark:text-blue-400"
            />
            <MetricRow
              label={t("salary.results.efkaEmployee")}
              value={formatCurrency(result.efkaEmployee)}
              colorClass="text-orange-600 dark:text-orange-400"
              tooltip={t("salary.tooltips.efkaCeiling")}
            />
            <MetricRow
              label={t("salary.results.taxable")}
              value={formatCurrency(result.taxableIncome)}
              colorClass="text-indigo-600 dark:text-indigo-400"
            />
            <MetricRow
              label={t("salary.results.netTax")}
              value={formatCurrency(result.netTax)}
              colorClass="text-rose-600 dark:text-rose-400"
            />
          </div>

          <div className="divide-y">
            <MetricRow
              label={t("salary.results.effectiveRate")}
              value={formatPercent(result.effectiveRate)}
              colorClass="text-purple-600 dark:text-purple-400"
            />
            <MetricRow
              label={t("salary.results.employerCost")}
              value={formatCurrency(result.employerCost)}
              colorClass="text-slate-600 dark:text-slate-400"
            />
            <MetricRow
              label={t("salary.results.taxReduction")}
              value={formatCurrency(result.taxReduction)}
              colorClass="text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
