import { useEffect, useRef } from "react";
import { Receipt } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { calculateEReceipt } from "@/lib/e-receipt-calc";
import { formatCurrency } from "@/lib/utils";
import { trackEReceiptInfoView, trackEReceiptInfoToggle } from "@/lib/analytics";

interface EReceiptInfoProps {
  realIncome: number;
  mode: "employee" | "mplokaki" | "atomiki";
}

export function EReceiptInfo({ realIncome, mode }: EReceiptInfoProps) {
  const { t } = useTranslation();
  const trackedMode = useRef(mode);

  useEffect(() => {
    trackedMode.current = mode;
    if (realIncome > 0) {
      trackEReceiptInfoView(mode);
    }
  }, [mode, realIncome]);

  if (realIncome <= 0) return null;

  const { requiredAmount, maxPenalty, monthlyTarget, cappedAt20k } =
    calculateEReceipt(realIncome);

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30">
      <Accordion
        type="single"
        collapsible
        defaultValue="e-receipt"
        onValueChange={(val) => trackEReceiptInfoToggle(val === "e-receipt")}
      >
        <AccordionItem value="e-receipt" className="border-none">
          <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              {t("eReceipt.title")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-teal-700 dark:text-teal-400">
                  {formatCurrency(requiredAmount)}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {t("eReceipt.required")}
                </span>
                {cappedAt20k && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t("eReceipt.cappedNote", { amount: formatCurrency(realIncome * 0.3) })}
                  </p>
                )}
              </div>

              <div>
                <span className="font-semibold text-teal-700 dark:text-teal-400">
                  {formatCurrency(monthlyTarget)}
                </span>
                <span className="ml-1 text-muted-foreground">{t("eReceipt.perMonth")}</span>
              </div>

              <div>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {formatCurrency(maxPenalty)}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {t("eReceipt.maxPenalty")}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {t("eReceipt.footnote")}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
