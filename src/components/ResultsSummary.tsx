import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Calculator,
  TrendingDown,
  Receipt,
  Percent,
  Wallet,
  CalendarCheck,
  Landmark,
  ArrowDownUp,
  BadgeMinus,
  Info,
} from "lucide-react";
import { LABELS, TOOLTIPS } from "@/lib/constants";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { ClientLocation, Regime, TaxResult } from "@/lib/types";

interface ResultsSummaryProps {
  result: TaxResult;
  regime: Regime;
  clientLocation: ClientLocation;
}

interface ResultCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  tooltip?: string;
  subtitle?: string;
  highlight?: boolean;
}

function ResultCard({ label, value, icon, colorClass, tooltip, subtitle, highlight }: ResultCardProps) {
  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${highlight ? "ring-2 ring-emerald-500/50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[min(20rem,calc(100vw-2rem))]">
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className={`mt-1 text-xl font-bold tabular-nums ${colorClass}`}>
              {value}
            </p>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`rounded-lg p-2 ${colorClass} bg-opacity-10`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
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
    <div className="grid gap-3 sm:grid-cols-2">
      <ResultCard
        label={LABELS.results.grossTax}
        value={formatCurrency(result.grossTax)}
        icon={<Calculator className="h-5 w-5 text-blue-600" />}
        colorClass="text-blue-600 dark:text-blue-400"
      />

      <ResultCard
        label={LABELS.results.taxReduction}
        value={
          regime === "mplokaki"
            ? formatCurrency(result.taxReduction)
            : LABELS.notApplicable
        }
        icon={<TrendingDown className="h-5 w-5 text-emerald-600" />}
        colorClass="text-emerald-600 dark:text-emerald-400"
        tooltip={TOOLTIPS.taxReduction}
      />

      <ResultCard
        label={LABELS.results.netTax}
        value={formatCurrency(result.netTax)}
        icon={<Receipt className="h-5 w-5 text-rose-600" />}
        colorClass="text-rose-600 dark:text-rose-400"
      />

      <ResultCard
        label={LABELS.results.prepayment}
        value={
          regime === "atomiki"
            ? formatCurrency(result.prepayment)
            : LABELS.notApplicable
        }
        icon={<BadgeMinus className="h-5 w-5 text-amber-500" />}
        colorClass="text-amber-600 dark:text-amber-400"
        tooltip={TOOLTIPS.prepayment}
      />

      <ResultCard
        label={LABELS.results.totalObligation}
        value={formatCurrency(result.totalObligation)}
        icon={<Receipt className="h-5 w-5 text-red-700" />}
        colorClass="text-red-700 dark:text-red-400"
      />

      <ResultCard
        label={LABELS.results.effectiveRate}
        value={formatPercent(result.effectiveRate)}
        icon={<Percent className="h-5 w-5 text-purple-600" />}
        colorClass="text-purple-600 dark:text-purple-400"
      />

      <ResultCard
        label={LABELS.results.netIncome}
        value={formatCurrency(result.netIncome)}
        icon={<Wallet className="h-5 w-5 text-emerald-600" />}
        colorClass="text-emerald-600 dark:text-emerald-400"
      />

      <ResultCard
        label={LABELS.results.netMonthly}
        value={formatCurrency(result.netIncome / 12)}
        icon={<CalendarCheck className="h-5 w-5 text-emerald-600" />}
        colorClass="text-emerald-600 dark:text-emerald-400"
        highlight
      />

      <ResultCard
        label={LABELS.results.monthlySavings}
        value={formatCurrency((result.totalObligation + result.efkaAnnual) / 12)}
        icon={<Landmark className="h-5 w-5 text-amber-600" />}
        colorClass="text-amber-600 dark:text-amber-400"
        tooltip={TOOLTIPS.monthlySavings}
      />

      {regime === "mplokaki" && (
        <>
          <ResultCard
            label={LABELS.results.withholding}
            value={formatCurrency(result.withholding20)}
            icon={<ArrowDownUp className="h-5 w-5 text-sky-500" />}
            colorClass="text-sky-600 dark:text-sky-400"
            tooltip={TOOLTIPS.withholding}
            subtitle={getWithholdingSubtitle(clientLocation)}
          />
          <ResultCard
            label={getBalanceDueLabel(result.balanceDue)}
            value={formatCurrency(result.balanceDue)}
            icon={<ArrowDownUp className="h-5 w-5" />}
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
  );
}
