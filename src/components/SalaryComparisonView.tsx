import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { LABELS } from "@/lib/constants";
import { SALARY_LABELS } from "@/lib/salary-constants";
import { calculateSalary } from "@/lib/salary-engine";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { SalaryInput, SalaryResult } from "@/lib/types";

interface SalaryComparisonViewProps {
  input: SalaryInput;
  currentResult: SalaryResult;
}

function ComparisonRow({
  label,
  valueA,
  valueB,
  isCurrency = true,
  inverse = false,
}: {
  label: string;
  valueA: number;
  valueB: number;
  isCurrency?: boolean;
  inverse?: boolean;
}) {
  const diff = valueB - valueA;
  const format = isCurrency ? formatCurrency : (v: number) => formatPercent(v);
  const isPositive = inverse ? diff > 0 : diff < 0;
  const isNegative = inverse ? diff < 0 : diff > 0;

  return (
    <div className="flex flex-col gap-1 py-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="tabular-nums font-medium">{format(valueA)}</span>
        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        <span className="tabular-nums font-medium">{format(valueB)}</span>
        <Badge
          variant={isPositive ? "default" : isNegative ? "destructive" : "secondary"}
          className="min-w-[72px] justify-center tabular-nums text-xs sm:min-w-[80px]"
        >
          {diff > 0 ? "+" : ""}
          {isCurrency ? formatCurrency(diff) : formatPercent(diff)}
        </Badge>
      </div>
    </div>
  );
}

export function SalaryComparisonView({ input, currentResult }: SalaryComparisonViewProps) {
  const otherYear = input.fiscalYear === 2025 ? 2026 : 2025;
  const otherResult = calculateSalary({ ...input, fiscalYear: otherYear });

  const [resultA, resultB] =
    input.fiscalYear === 2025
      ? [currentResult, otherResult]
      : [otherResult, currentResult];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{LABELS.comparison.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center justify-center gap-4 text-sm font-semibold">
          <span>2025</span>
          <span className="text-muted-foreground">vs</span>
          <span>2026</span>
        </div>
        <div className="divide-y">
          <ComparisonRow label={SALARY_LABELS.results.grossTax} valueA={resultA.grossTax} valueB={resultB.grossTax} />
          <ComparisonRow label={SALARY_LABELS.results.netTax} valueA={resultA.netTax} valueB={resultB.netTax} />
          <ComparisonRow label={SALARY_LABELS.results.efkaEmployee} valueA={resultA.efkaEmployee} valueB={resultB.efkaEmployee} />
          <ComparisonRow label={SALARY_LABELS.results.effectiveRate} valueA={resultA.effectiveRate} valueB={resultB.effectiveRate} isCurrency={false} />
          <ComparisonRow label={SALARY_LABELS.results.netMonthly} valueA={resultA.netMonthly} valueB={resultB.netMonthly} inverse />
          <ComparisonRow label={SALARY_LABELS.results.employerCost} valueA={resultA.employerCost} valueB={resultB.employerCost} />
        </div>
      </CardContent>
    </Card>
  );
}
