import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState } from "react";
import { LABELS } from "@/lib/constants";
import { SALARY_LABELS, SALARY_TOOLTIPS, getMinimumWage } from "@/lib/salary-constants";
import { formatCurrency, sanitizeNumericInput } from "@/lib/utils";
import { trackDirection, trackArticle5G } from "@/lib/analytics";
import type { AgeGroup, FiscalYear, PayFrequency, SalaryDirection, Seniority } from "@/lib/types";

type SalaryPeriod = "monthly" | "yearly";

interface SalaryFormProps {
  year: FiscalYear;
  direction: SalaryDirection;
  onDirectionChange: (v: SalaryDirection) => void;
  monthlySalary: number;
  onMonthlySalaryChange: (v: number) => void;
  payFrequency: PayFrequency;
  onPayFrequencyChange: (v: PayFrequency) => void;
  children: number;
  onChildrenChange: (v: number) => void;
  ageGroup: AgeGroup;
  onAgeGroupChange: (v: AgeGroup) => void;
  efkaEmployeeRate: number;
  onEfkaEmployeeRateChange: (v: number) => void;
  efkaEmployerRate: number;
  onEfkaEmployerRateChange: (v: number) => void;
  seniority: Seniority;
  onSeniorityChange: (v: Seniority) => void;
  hasArticle5G: boolean;
  onArticle5GChange: (v: boolean) => void;
  taxableIncome: number;
}

export function SalaryForm({
  year,
  direction,
  onDirectionChange,
  monthlySalary,
  onMonthlySalaryChange,
  payFrequency,
  onPayFrequencyChange,
  children,
  onChildrenChange,
  ageGroup,
  onAgeGroupChange,
  efkaEmployeeRate,
  onEfkaEmployeeRateChange,
  efkaEmployerRate,
  onEfkaEmployerRateChange,
  seniority,
  onSeniorityChange,
  hasArticle5G,
  onArticle5GChange,
  taxableIncome,
}: SalaryFormProps) {
  const minimumWage = getMinimumWage(year);
  const [period, setPeriod] = useState<SalaryPeriod>("monthly");

  const displayValue = period === "yearly"
    ? Math.round(monthlySalary * payFrequency)
    : monthlySalary;

  const handleSalaryChange = (value: number) => {
    onMonthlySalaryChange(period === "yearly" ? Math.round(value / payFrequency) : value);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{SALARY_LABELS.formTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Direction Toggle */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">
            {SALARY_LABELS.direction.label}
          </Label>
          <div className="flex gap-2">
            {(["gross-to-net", "net-to-gross"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => {
                  trackDirection(dir);
                  onDirectionChange(dir);
                }}
                className={`flex-1 rounded-md border px-2 py-2.5 text-sm transition-colors ${
                  direction === dir
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent"
                }`}
              >
                {dir === "gross-to-net"
                  ? SALARY_LABELS.direction.grossToNet
                  : SALARY_LABELS.direction.netToGross}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Period */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">
            {SALARY_LABELS.period.label}
          </Label>
          <div className="flex gap-2">
            {(["monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 rounded-md border px-2 py-2.5 text-sm transition-colors ${
                  period === p
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent"
                }`}
              >
                {SALARY_LABELS.period[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <Label htmlFor="monthly-salary" className="text-sm font-medium">
              {direction === "gross-to-net"
                ? SALARY_LABELS.grossSalary
                : SALARY_LABELS.targetNet}
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer text-xs hover:bg-accent"
                  onClick={() => onMonthlySalaryChange(minimumWage)}
                >
                  {SALARY_LABELS.minimumWage}: {formatCurrency(minimumWage)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{SALARY_TOOLTIPS.minimumWage}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
            <Input
              id="monthly-salary"
              type="number"
              min={0}
              step={period === "yearly" ? 100 : 50}
              value={displayValue || ""}
              onChange={(e) => handleSalaryChange(sanitizeNumericInput(e.target.value, { min: 0 }))}
              className="pl-7 tabular-nums"
              placeholder="0,00"
            />
          </div>
          {period === "yearly" && monthlySalary > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              = {formatCurrency(monthlySalary)}/μήνα
            </p>
          )}
        </div>

        {/* Pay Frequency */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">
            {SALARY_LABELS.payFrequency.label}
          </Label>
          <div className="flex gap-2">
            {([14, 12] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => onPayFrequencyChange(freq)}
                className={`flex-1 rounded-md border px-2 py-2.5 text-sm transition-colors ${
                  payFrequency === freq
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent"
                }`}
              >
                {SALARY_LABELS.payFrequency[String(freq) as "14" | "12"]}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Children */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">
            {LABELS.children}
          </Label>
          <Select
            value={String(children)}
            onValueChange={(v) => onChildrenChange(Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 8 }, (_, i) => (
                <SelectItem key={i} value={String(i)}>
                  {i === 7 ? "7+" : String(i)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Age group - only for 2026 */}
        {year === 2026 && (
          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              {LABELS.age}
            </Label>
            <div className="flex gap-2">
              {(["young", "middle", "standard"] as const).map((ag) => (
                <button
                  key={ag}
                  onClick={() => onAgeGroupChange(ag)}
                  className={`flex-1 rounded-md border px-2 py-2.5 text-sm transition-colors ${
                    ageGroup === ag
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                >
                  {LABELS.ageGroups[ag]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Options */}
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-sm font-medium">
              Ρυθμίσεις
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {/* Seniority */}
              <div>
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Label className="text-sm font-medium">
                    {SALARY_LABELS.seniority.label}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{SALARY_TOOLTIPS.seniority}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={String(seniority)}
                  onValueChange={(v) => onSeniorityChange(Number(v) as Seniority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {([0, 1, 2, 3] as const).map((s) => (
                      <SelectItem key={s} value={String(s)}>
                        {SALARY_LABELS.seniority[String(s) as "0" | "1" | "2" | "3"]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* EFKA Rates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="efka-employee" className="mb-1.5 block text-xs font-medium">
                    {SALARY_LABELS.efka.employee}
                  </Label>
                  <div className="relative">
                    <Input
                      id="efka-employee"
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      value={((efkaEmployeeRate * 100).toFixed(2))}
                      onChange={(e) => onEfkaEmployeeRateChange(sanitizeNumericInput(e.target.value, { min: 0, max: 100 }) / 100)}
                      className="pr-7 tabular-nums"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="efka-employer" className="mb-1.5 block text-xs font-medium">
                    {SALARY_LABELS.efka.employer}
                  </Label>
                  <div className="relative">
                    <Input
                      id="efka-employer"
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      value={((efkaEmployerRate * 100).toFixed(2))}
                      onChange={(e) => onEfkaEmployerRateChange(sanitizeNumericInput(e.target.value, { min: 0, max: 100 }) / 100)}
                      className="pr-7 tabular-nums"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Article 5G */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="article-5g"
                  checked={hasArticle5G}
                  onChange={(e) => {
                    trackArticle5G(e.target.checked);
                    onArticle5GChange(e.target.checked);
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="article-5g" className="text-sm">
                    {SALARY_LABELS.article5G}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[min(20rem,calc(100vw-2rem))]">
                      <p>{SALARY_TOOLTIPS.article5G}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        {/* Taxable Income Display */}
        <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 p-4 dark:from-indigo-950/30 dark:to-blue-950/30">
          <div className="text-sm text-muted-foreground">
            {SALARY_LABELS.results.taxable}
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
            {formatCurrency(taxableIncome)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
