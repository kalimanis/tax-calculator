import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Calculator,
  TrendingDown,
  Receipt,
  Percent,
  Wallet,
  ArrowDownUp,
  BadgeMinus,
  Info,
} from "lucide-react";
import { LABELS, TOOLTIPS } from "@/lib/constants";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { Regime, TaxResult } from "@/lib/types";

interface ResultsSummaryProps {
  result: TaxResult;
  regime: Regime;
}

interface ResultCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  tooltip?: string;
  subtitle?: string;
}

function ResultCard({ label, value, icon, colorClass, tooltip, subtitle }: ResultCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
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
                  <TooltipContent className="max-w-xs">
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

export function ResultsSummary({ result, regime }: ResultsSummaryProps) {
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

      {regime === "mplokaki" && (
        <>
          <ResultCard
            label={LABELS.results.withholding}
            value={formatCurrency(result.withholding20)}
            icon={<ArrowDownUp className="h-5 w-5 text-sky-500" />}
            colorClass="text-sky-600 dark:text-sky-400"
            tooltip={TOOLTIPS.withholding}
          />
          <ResultCard
            label={LABELS.results.balanceDue}
            value={formatCurrency(result.balanceDue)}
            icon={<ArrowDownUp className="h-5 w-5" />}
            colorClass={isRefund ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}
            subtitle={isRefund ? "Επιστροφή φόρου" : undefined}
          />
        </>
      )}
    </div>
  );
}
