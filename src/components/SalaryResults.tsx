import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calculator,
  TrendingDown,
  Receipt,
  Percent,
  Wallet,
  Building2,
  ShieldCheck,
  Info,
} from "lucide-react";
import { SALARY_LABELS, SALARY_TOOLTIPS } from "@/lib/salary-constants";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { PayFrequency, SalaryResult } from "@/lib/types";

interface SalaryResultsProps {
  result: SalaryResult;
  payFrequency: PayFrequency;
}

interface ResultCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  tooltip?: string;
  highlight?: boolean;
}

function ResultCard({ label, value, icon, colorClass, tooltip, highlight }: ResultCardProps) {
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
          </div>
          <div className={`rounded-lg p-2 ${colorClass} bg-opacity-10`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SalaryResults({ result, payFrequency }: SalaryResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        <ResultCard
          label={SALARY_LABELS.results.grossAnnual}
          value={formatCurrency(result.grossAnnual)}
          icon={<Calculator className="h-5 w-5 text-blue-600" />}
          colorClass="text-blue-600 dark:text-blue-400"
        />
        <ResultCard
          label={SALARY_LABELS.results.efkaEmployee}
          value={formatCurrency(result.efkaEmployee)}
          icon={<ShieldCheck className="h-5 w-5 text-orange-500" />}
          colorClass="text-orange-600 dark:text-orange-400"
          tooltip={SALARY_TOOLTIPS.efkaCeiling}
        />
        <ResultCard
          label={SALARY_LABELS.results.taxable}
          value={formatCurrency(result.taxableIncome)}
          icon={<Receipt className="h-5 w-5 text-indigo-600" />}
          colorClass="text-indigo-600 dark:text-indigo-400"
        />
        <ResultCard
          label={SALARY_LABELS.results.netTax}
          value={formatCurrency(result.netTax)}
          icon={<Receipt className="h-5 w-5 text-rose-600" />}
          colorClass="text-rose-600 dark:text-rose-400"
        />
        <ResultCard
          label={SALARY_LABELS.results.netMonthly}
          value={formatCurrency(result.netMonthly)}
          icon={<Wallet className="h-5 w-5 text-emerald-600" />}
          colorClass="text-emerald-600 dark:text-emerald-400"
          highlight
        />
        <ResultCard
          label={SALARY_LABELS.results.effectiveRate}
          value={formatPercent(result.effectiveRate)}
          icon={<Percent className="h-5 w-5 text-purple-600" />}
          colorClass="text-purple-600 dark:text-purple-400"
        />
        <ResultCard
          label={SALARY_LABELS.results.employerCost}
          value={formatCurrency(result.employerCost)}
          icon={<Building2 className="h-5 w-5 text-slate-600" />}
          colorClass="text-slate-600 dark:text-slate-400"
        />
        <ResultCard
          label={SALARY_LABELS.results.taxReduction}
          value={formatCurrency(result.taxReduction)}
          icon={<TrendingDown className="h-5 w-5 text-emerald-600" />}
          colorClass="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Breakdown Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Λεπτομερής Ανάλυση</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="breakdown">
            <AccordionItem value="breakdown">
              <AccordionTrigger className="text-base font-semibold">
                {SALARY_LABELS.breakdown}
              </AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 font-medium" />
                        <th className="pb-2 text-right font-medium">{SALARY_LABELS.monthly}</th>
                        <th className="pb-2 text-right font-medium">{SALARY_LABELS.annual}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <BreakdownRow
                        label={SALARY_LABELS.results.grossMonthly}
                        monthly={result.grossMonthly}
                        annual={result.grossAnnual}
                        payFrequency={payFrequency}
                      />
                      <BreakdownRow
                        label={SALARY_LABELS.results.efkaEmployee}
                        monthly={result.efkaEmployee / payFrequency}
                        annual={result.efkaEmployee}
                        negative
                        payFrequency={payFrequency}
                      />
                      <BreakdownRow
                        label={SALARY_LABELS.results.netTax}
                        monthly={result.netTax / payFrequency}
                        annual={result.netTax}
                        negative
                        payFrequency={payFrequency}
                      />
                      <tr className="font-semibold">
                        <td className="py-2">{SALARY_LABELS.results.netMonthly}</td>
                        <td className="py-2 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(result.netMonthly)}
                        </td>
                        <td className="py-2 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(result.netAnnualPrecise)}
                        </td>
                      </tr>
                      <tr className="text-muted-foreground">
                        <td className="py-2">{SALARY_LABELS.results.efkaEmployer}</td>
                        <td className="py-2 text-right tabular-nums">
                          {formatCurrency(result.efkaEmployer / payFrequency)}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {formatCurrency(result.efkaEmployer)}
                        </td>
                      </tr>
                      <tr className="text-muted-foreground">
                        <td className="py-2">{SALARY_LABELS.results.employerCost}</td>
                        <td className="py-2 text-right tabular-nums">
                          {formatCurrency(result.employerCost / payFrequency)}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {formatCurrency(result.employerCost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {Math.abs(result.settlementDiff) >= 0.01 && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[min(20rem,calc(100vw-2rem))]">
                        <p>Στη μισθοδοσία ο φόρος στρογγυλοποιείται κάθε μήνα. Η μικρή διαφορά (συνήθως &lt; €1) συμψηφίζεται στην ετήσια φορολογική δήλωση.</p>
                      </TooltipContent>
                    </Tooltip>
                    <span>
                      Διαφορά εκκαθάρισης λόγω στρογγυλοποίησης: {formatCurrency(Math.abs(result.settlementDiff))}{" "}
                      ({result.settlementDiff < 0 ? "επιστροφή" : "πληρωμή"})
                    </span>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function BreakdownRow({
  label,
  monthly,
  annual,
  negative,
  payFrequency: _payFrequency,
}: {
  label: string;
  monthly: number;
  annual: number;
  negative?: boolean;
  payFrequency: PayFrequency;
}) {
  return (
    <tr>
      <td className="py-2">{label}</td>
      <td className={`py-2 text-right tabular-nums ${negative ? "text-rose-600 dark:text-rose-400" : ""}`}>
        {negative ? "−" : ""}{formatCurrency(negative ? Math.abs(monthly) : monthly)}
      </td>
      <td className={`py-2 text-right tabular-nums ${negative ? "text-rose-600 dark:text-rose-400" : ""}`}>
        {negative ? "−" : ""}{formatCurrency(negative ? Math.abs(annual) : annual)}
      </td>
    </tr>
  );
}
