import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info } from "lucide-react";
import { SALARY_LABELS } from "@/lib/salary-constants";
import { formatCurrency } from "@/lib/utils";
import type { PayFrequency, SalaryResult } from "@/lib/types";

interface SalaryBreakdownProps {
  result: SalaryResult;
  payFrequency: PayFrequency;
}

export function SalaryBreakdown({ result, payFrequency }: SalaryBreakdownProps) {
  return (
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
                />
                <BreakdownRow
                  label={SALARY_LABELS.results.efkaEmployee}
                  monthly={result.efkaEmployee / payFrequency}
                  annual={result.efkaEmployee}
                  negative
                />
                <BreakdownRow
                  label={SALARY_LABELS.results.netTax}
                  monthly={result.netTax / payFrequency}
                  annual={result.netTax}
                  negative
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
  );
}

function BreakdownRow({
  label,
  monthly,
  annual,
  negative,
}: {
  label: string;
  monthly: number;
  annual: number;
  negative?: boolean;
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
