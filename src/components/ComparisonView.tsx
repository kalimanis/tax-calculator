import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { trackComparison } from "@/lib/analytics";
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
  inverse?: boolean;
}

function ComparisonRow({ label, valueA, valueB, isCurrency = true, inverse = false }: ComparisonRowProps) {
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

export function ComparisonView({ input, currentResult }: ComparisonViewProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("comparison.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="years" onValueChange={(v) => trackComparison(v === "years" ? "year" : "mode")}>
          <TabsList className="w-full">
            <TabsTrigger value="years" className="flex-1">
              {t("comparison.yearVsYear")}
            </TabsTrigger>
            <TabsTrigger value="regimes" className="flex-1">
              {t("comparison.regimeVsRegime")}
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

function YearComparison({ input, currentResult }: { input: TaxInput; currentResult: TaxResult }) {
  const { t } = useTranslation();
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
        <ComparisonRow label={t("results.grossTax")} valueA={resultA.grossTax} valueB={resultB.grossTax} />
        <ComparisonRow label={t("results.netTax")} valueA={resultA.netTax} valueB={resultB.netTax} />
        <ComparisonRow label={t("results.totalObligation")} valueA={resultA.totalObligation} valueB={resultB.totalObligation} />
        <ComparisonRow label={t("results.effectiveRate")} valueA={resultA.effectiveRate} valueB={resultB.effectiveRate} isCurrency={false} />
        <ComparisonRow label={t("results.netIncome")} valueA={resultA.netIncome} valueB={resultB.netIncome} inverse />
      </div>
    </div>
  );
}

function RegimeComparison({ input, currentResult }: { input: TaxInput; currentResult: TaxResult }) {
  const { t } = useTranslation();
  const otherRegime = input.regime === "mplokaki" ? "atomiki" as const : "mplokaki" as const;
  const otherResult = calculateTax({ ...input, regime: otherRegime });

  const [resultA, resultB] =
    input.regime === "mplokaki"
      ? [currentResult, otherResult]
      : [otherResult, currentResult];

  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-4 text-sm font-semibold">
        <span>{t("regimeLabels.mplokaki")}</span>
        <span className="text-muted-foreground">vs</span>
        <span>{t("regimeLabels.atomiki")}</span>
      </div>
      <div className="divide-y">
        <ComparisonRow label={t("results.grossTax")} valueA={resultA.grossTax} valueB={resultB.grossTax} />
        <ComparisonRow label={t("results.netTax")} valueA={resultA.netTax} valueB={resultB.netTax} />
        <ComparisonRow label={t("results.totalObligation")} valueA={resultA.totalObligation} valueB={resultB.totalObligation} />
        <ComparisonRow label={t("results.effectiveRate")} valueA={resultA.effectiveRate} valueB={resultB.effectiveRate} isCurrency={false} />
        <ComparisonRow label={t("results.netIncome")} valueA={resultA.netIncome} valueB={resultB.netIncome} inverse />
      </div>
    </div>
  );
}
