import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { LABELS, TOOLTIPS } from "@/lib/constants";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { ClientLocation, Regime, TaxResult } from "@/lib/types";

interface ResultsSummaryProps {
  result: TaxResult;
  regime: Regime;
  clientLocation: ClientLocation;
}

interface MetricRowProps {
  label: string;
  value: string;
  colorClass?: string;
  tooltip?: string;
  subtitle?: string;
  muted?: boolean;
}

function MetricRow({ label, value, colorClass, tooltip, subtitle, muted }: MetricRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5">
      <div className="flex items-center gap-1 min-w-0">
        <span className={`text-sm ${muted ? "text-muted-foreground" : ""}`}>{label}</span>
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
        {subtitle && (
          <span className="text-xs text-muted-foreground">({subtitle})</span>
        )}
      </div>
      <span className={`font-semibold tabular-nums whitespace-nowrap ${colorClass ?? ""}`}>
        {value}
      </span>
    </div>
  );
}

function getBalanceDueLabel(balanceDue: number): string {
  if (balanceDue > 0) return LABELS.balanceDue.owed;
  if (balanceDue < 0) return LABELS.balanceDue.refund;
  return LABELS.balanceDue.zero;
}

function getWithholdingSubtitle(clientLocation: ClientLocation): string | undefined {
  if (clientLocation === "foreign") return LABELS.clientLocation.noWithholding;
  if (clientLocation === "mixed") return LABELS.clientLocation.partialWithholding;
  return undefined;
}

export function ResultsSummary({ result, regime, clientLocation }: ResultsSummaryProps) {
  const isRefund = regime === "mplokaki" && result.balanceDue < 0;

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        {/* Hero: Net Monthly */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {LABELS.results.netMonthly}
          </span>
          <span className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrency(result.netIncome / 12)}
          </span>
        </div>

        {/* Metrics grid */}
        <div className="grid gap-x-6 sm:grid-cols-2">
          <div className="divide-y">
            <MetricRow
              label={LABELS.results.grossTax}
              value={formatCurrency(result.grossTax)}
              colorClass="text-blue-600 dark:text-blue-400"
            />
            <MetricRow
              label="Μείωση Φόρου"
              value={regime === "mplokaki" ? formatCurrency(result.taxReduction) : LABELS.notApplicable}
              colorClass="text-emerald-600 dark:text-emerald-400"
              tooltip={TOOLTIPS.taxReduction}
              muted={regime !== "mplokaki"}
            />
            <MetricRow
              label="Καθαρός Φόρος"
              value={formatCurrency(result.netTax)}
              colorClass="text-rose-600 dark:text-rose-400"
            />
            <MetricRow
              label="Προκαταβολή"
              value={regime === "atomiki" ? formatCurrency(result.prepayment) : LABELS.notApplicable}
              colorClass="text-amber-600 dark:text-amber-400"
              tooltip={TOOLTIPS.prepayment}
              muted={regime !== "atomiki"}
            />
            <MetricRow
              label="Συνολική Υποχρέωση"
              value={formatCurrency(result.totalObligation)}
              colorClass="text-red-700 dark:text-red-400"
            />
          </div>

          <div className="divide-y">
            <MetricRow
              label={LABELS.results.effectiveRate}
              value={formatPercent(result.effectiveRate)}
              colorClass="text-purple-600 dark:text-purple-400"
            />
            <MetricRow
              label="Καθαρό Εισόδημα"
              value={formatCurrency(result.netIncome)}
              colorClass="text-emerald-600 dark:text-emerald-400"
            />
            <MetricRow
              label={LABELS.results.monthlySavings}
              value={formatCurrency((result.totalObligation + result.efkaAnnual) / 12)}
              colorClass="text-amber-600 dark:text-amber-400"
              tooltip={TOOLTIPS.monthlySavings}
            />
            {regime === "mplokaki" && (
              <>
                <MetricRow
                  label="Παρακράτηση (20%)"
                  value={formatCurrency(result.withholding20)}
                  colorClass="text-sky-600 dark:text-sky-400"
                  tooltip={TOOLTIPS.withholding}
                  subtitle={getWithholdingSubtitle(clientLocation)}
                />
                <MetricRow
                  label={getBalanceDueLabel(result.balanceDue)}
                  value={formatCurrency(result.balanceDue)}
                  colorClass={
                    result.balanceDue === 0
                      ? "text-muted-foreground"
                      : isRefund
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                  }
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
