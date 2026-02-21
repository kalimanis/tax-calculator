import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Regime, TaxResult } from "@/lib/types";

interface WaterfallBar {
  name: string;
  value: number;
  color: string;
}

interface IncomeWaterfallProps {
  result?: TaxResult;
  grossIncome?: number;
  regime?: Regime;
  chartData?: WaterfallBar[];
}

export function IncomeWaterfall({ result, grossIncome, regime, chartData: externalData }: IncomeWaterfallProps) {
  const chartData = externalData ?? buildFreelancerData(result!, grossIncome!, regime!);

  if (chartData.length === 0) return null;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="waterfall">
        <AccordionTrigger className="text-base font-semibold">
          {LABELS.waterfall.title}
        </AccordionTrigger>
        <AccordionContent>
          <div className="h-48 w-full sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`}
                />
                <RechartsTooltip
                  formatter={(value) => [formatCurrency(Number(value)), ""]}
                  contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function buildFreelancerData(result: TaxResult, grossIncome: number, regime: Regime): WaterfallBar[] {
  if (grossIncome <= 0) return [];
  const expenses = grossIncome - result.efkaAnnual - result.taxableIncome;
  return [
    { name: "Ακαθάριστα", value: grossIncome, color: "#059669" },
    ...(result.efkaAnnual > 0 ? [{ name: "ΕΦΚΑ", value: result.efkaAnnual, color: "#dc2626" }] : []),
    ...(expenses > 0 ? [{ name: "Έξοδα", value: expenses, color: "#dc2626" }] : []),
    { name: "Φόρος", value: result.netTax, color: "#dc2626" },
    ...(regime === "atomiki" && result.prepayment > 0
      ? [{ name: "Προκαταβολή", value: result.prepayment, color: "#f59e0b" }]
      : []),
    { name: "Καθαρό", value: Math.max(0, result.netIncome), color: "#059669" },
  ];
}
