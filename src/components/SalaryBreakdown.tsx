import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";
import type { PayFrequency, SalaryResult } from "@/lib/types";

interface SalaryBreakdownProps {
  result: SalaryResult;
  payFrequency: PayFrequency;
}

export function SalaryBreakdown({ result, payFrequency }: SalaryBreakdownProps) {
  const { t } = useTranslation();
  return (
    <Accordion type="single" collapsible defaultValue="breakdown">
      <AccordionItem value="breakdown">
        <AccordionTrigger className="text-base font-semibold">
          {t("salary.breakdown")}
        </AccordionTrigger>
        <AccordionContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium" />
                  <th className="pb-2 text-right font-medium">{t("salary.monthly")}</th>
                  <th className="pb-2 text-right font-medium">{t("salary.annual")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <BreakdownRow
                  label={t("salary.results.grossMonthly")}
                  monthly={result.grossMonthly}
                  annual={result.grossAnnual}
                />
                <BreakdownRow
                  label={t("salary.results.efkaEmployee")}
                  monthly={result.efkaEmployee / payFrequency}
                  annual={result.efkaEmployee}
                  negative
                />
                <BreakdownRow
                  label={t("salary.results.netTax")}
                  monthly={result.netTax / payFrequency}
                  annual={result.netTax}
                  negative
                />
                <tr className="font-semibold">
                  <td className="py-2">{t("salary.results.netMonthly")}</td>
                  <td className="py-2 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(result.netMonthly)}
                  </td>
                  <td className="py-2 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(result.netAnnualPrecise)}
                  </td>
                </tr>
                <tr className="text-muted-foreground">
                  <td className="py-2">{t("salary.results.efkaEmployer")}</td>
                  <td className="py-2 text-right tabular-nums">
                    {formatCurrency(result.efkaEmployer / payFrequency)}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {formatCurrency(result.efkaEmployer)}
                  </td>
                </tr>
                <tr className="text-muted-foreground">
                  <td className="py-2">{t("salary.results.employerCost")}</td>
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
                  <p>{t("salaryBreakdown.settlementTooltip")}</p>
                </TooltipContent>
              </Tooltip>
              <span>
                {t("salaryBreakdown.settlementDiff")} {formatCurrency(Math.abs(result.settlementDiff))}{" "}
                ({result.settlementDiff < 0 ? t("salaryBreakdown.refund") : t("salaryBreakdown.payment")})
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
