import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { LABELS } from "@/lib/constants";
import { calculateTax } from "@/lib/tax-engine";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { TaxInput, TaxResult } from "@/lib/types";

interface ComparisonViewProps {
  input: TaxInput;
  currentResult: TaxResult;
}

interface ComparisonRowProps {
  label: string;
  valueA: number;
  valueB: number;
  isCurrency?: boolean;
}

function ComparisonRow({ label, valueA, valueB, isCurrency = true }: ComparisonRowProps) {
  const diff = valueB - valueA;
  const format = isCurrency ? formatCurrency : (v: number) => formatPercent(v);

  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="tabular-nums font-medium">{format(valueA)}</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <span className="tabular-nums font-medium">{format(valueB)}</span>
        <Badge
          variant={diff < 0 ? "default" : diff > 0 ? "destructive" : "secondary"}
          className="min-w-[80px] justify-center tabular-nums text-xs"
        >
          {diff > 0 ? "+" : ""}
          {isCurrency ? formatCurrency(diff) : formatPercent(diff)}
        </Badge>
      </div>
    </div>
  );
}

export function ComparisonView({ input, currentResult }: ComparisonViewProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{LABELS.comparison.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="years">
          <TabsList className="w-full">
            <TabsTrigger value="years" className="flex-1">
              {LABELS.comparison.yearVsYear}
            </TabsTrigger>
            <TabsTrigger value="regimes" className="flex-1">
              {LABELS.comparison.regimeVsRegime}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="years" className="mt-4">
            <YearComparison input={input} currentResult={currentResult} />
          </TabsContent>

          <TabsContent value="regimes" className="mt-4">
            <RegimeComparison input={input} currentResult={currentResult} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function YearComparison({
  input,
  currentResult,
}: {
  input: TaxInput;
  currentResult: TaxResult;
}) {
  const otherYear = input.fiscalYear === 2025 ? 2026 : 2025;
  const otherResult = calculateTax({ ...input, fiscalYear: otherYear });

  const [resultA, resultB] =
    input.fiscalYear === 2025
      ? [currentResult, otherResult]
      : [otherResult, currentResult];

  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-4 text-sm font-semibold">
        <span>2025</span>
        <span className="text-muted-foreground">vs</span>
        <span>2026</span>
      </div>
      <div className="divide-y">
        <ComparisonRow label={LABELS.results.grossTax} valueA={resultA.grossTax} valueB={resultB.grossTax} />
        <ComparisonRow label={LABELS.results.netTax} valueA={resultA.netTax} valueB={resultB.netTax} />
        <ComparisonRow label={LABELS.results.totalObligation} valueA={resultA.totalObligation} valueB={resultB.totalObligation} />
        <ComparisonRow label={LABELS.results.effectiveRate} valueA={resultA.effectiveRate} valueB={resultB.effectiveRate} isCurrency={false} />
        <ComparisonRow label={LABELS.results.netIncome} valueA={resultA.netIncome} valueB={resultB.netIncome} />
      </div>
    </div>
  );
}

function RegimeComparison({
  input,
  currentResult,
}: {
  input: TaxInput;
  currentResult: TaxResult;
}) {
  const otherRegime = input.regime === "mplokaki" ? "atomiki" as const : "mplokaki" as const;
  const otherResult = calculateTax({ ...input, regime: otherRegime });

  const [resultA, resultB] =
    input.regime === "mplokaki"
      ? [currentResult, otherResult]
      : [otherResult, currentResult];

  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-4 text-sm font-semibold">
        <span>Μπλοκάκι</span>
        <span className="text-muted-foreground">vs</span>
        <span>Ατομική</span>
      </div>
      <div className="divide-y">
        <ComparisonRow label={LABELS.results.grossTax} valueA={resultA.grossTax} valueB={resultB.grossTax} />
        <ComparisonRow label={LABELS.results.netTax} valueA={resultA.netTax} valueB={resultB.netTax} />
        <ComparisonRow label={LABELS.results.totalObligation} valueA={resultA.totalObligation} valueB={resultB.totalObligation} />
        <ComparisonRow label={LABELS.results.effectiveRate} valueA={resultA.effectiveRate} valueB={resultB.effectiveRate} isCurrency={false} />
        <ComparisonRow label={LABELS.results.netIncome} valueA={resultA.netIncome} valueB={resultB.netIncome} />
      </div>
    </div>
  );
}
