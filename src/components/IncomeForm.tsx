import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EfkaSelector } from "./EfkaSelector";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState } from "react";
import { LABELS, TOOLTIPS } from "@/lib/constants";
import { formatCurrency, sanitizeNumericInput } from "@/lib/utils";
import { trackForeignClient } from "@/lib/analytics";
import type { AgeGroup, ClientLocation, FiscalYear, ProfessionType, Regime } from "@/lib/types";

type IncomeFrequency = "yearly" | "monthly";

interface IncomeFormProps {
  year: FiscalYear;
  regime: Regime;
  grossIncome: number;
  onGrossIncomeChange: (v: number) => void;
  efkaAnnual: number;
  onEfkaChange: (v: number) => void;
  efkaAutoMode: boolean;
  onEfkaAutoModeChange: (v: boolean) => void;
  profession: ProfessionType;
  onProfessionChange: (v: ProfessionType) => void;
  efkaCategory: number;
  onEfkaCategoryChange: (v: number) => void;
  isNewProfessional: boolean;
  onNewProfessionalChange: (v: boolean) => void;
  otherExpenses: number;
  onOtherExpensesChange: (v: number) => void;
  children: number;
  onChildrenChange: (v: number) => void;
  ageGroup: AgeGroup;
  onAgeGroupChange: (v: AgeGroup) => void;
  isFirstYearFiling: boolean;
  onFirstYearFilingChange: (v: boolean) => void;
  yearsInBusiness: number;
  onYearsInBusinessChange: (v: number) => void;
  clientLocation: ClientLocation;
  onClientLocationChange: (v: ClientLocation) => void;
  domesticIncomeShare: number;
  onDomesticIncomeShareChange: (v: number) => void;
  taxableIncome: number;
}

export function IncomeForm({
  year,
  regime,
  grossIncome,
  onGrossIncomeChange,
  efkaAnnual,
  onEfkaChange,
  efkaAutoMode,
  onEfkaAutoModeChange,
  profession,
  onProfessionChange,
  efkaCategory,
  onEfkaCategoryChange,
  isNewProfessional,
  onNewProfessionalChange,
  otherExpenses,
  onOtherExpensesChange,
  children,
  onChildrenChange,
  ageGroup,
  onAgeGroupChange,
  isFirstYearFiling,
  onFirstYearFilingChange,
  yearsInBusiness,
  onYearsInBusinessChange,
  clientLocation,
  onClientLocationChange,
  domesticIncomeShare,
  onDomesticIncomeShareChange,
  taxableIncome,
}: IncomeFormProps) {
  const [frequency, setFrequency] = useState<IncomeFrequency>("yearly");

  const displayValue = frequency === "monthly" ? Math.round(grossIncome / 12) : grossIncome;

  const handleIncomeChange = (value: number) => {
    onGrossIncomeChange(frequency === "monthly" ? value * 12 : value);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Στοιχεία Εισοδήματος</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Income Frequency */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">
            {LABELS.income.frequency.label}
          </Label>
          <div className="flex gap-2">
            {(["yearly", "monthly"] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => setFrequency(freq)}
                className={`flex-1 rounded-md border px-2 py-2.5 text-sm transition-colors ${
                  frequency === freq
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent"
                }`}
              >
                {LABELS.income.frequency[freq]}
              </button>
            ))}
          </div>
        </div>

        {/* Gross Income */}
        <div>
          <Label htmlFor="gross-income" className="mb-1.5 block text-sm font-medium">
            {LABELS.income.gross}
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
            <Input
              id="gross-income"
              type="number"
              min={0}
              step={frequency === "monthly" ? 50 : 100}
              value={displayValue || ""}
              onChange={(e) => handleIncomeChange(sanitizeNumericInput(e.target.value, { min: 0 }))}
              className="pl-7 tabular-nums"
              placeholder="0,00"
            />
          </div>
          {frequency === "monthly" && grossIncome > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              = {formatCurrency(grossIncome)}/έτος
            </p>
          )}
        </div>

        {/* EFKA */}
        <EfkaSelector
          year={year}
          efkaAnnual={efkaAnnual}
          onEfkaChange={onEfkaChange}
          autoMode={efkaAutoMode}
          onAutoModeChange={onEfkaAutoModeChange}
          profession={profession}
          onProfessionChange={onProfessionChange}
          category={efkaCategory}
          onCategoryChange={onEfkaCategoryChange}
          isNewProfessional={isNewProfessional}
          onNewProfessionalChange={onNewProfessionalChange}
        />

        {/* Other Expenses */}
        <div>
          <Label htmlFor="expenses" className="mb-1.5 block text-sm font-medium">
            {LABELS.income.expenses}
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              €
            </span>
            <Input
              id="expenses"
              type="number"
              min={0}
              step={100}
              value={otherExpenses || ""}
              onChange={(e) => onOtherExpensesChange(sanitizeNumericInput(e.target.value, { min: 0 }))}
              className="pl-7 tabular-nums"
              placeholder="0,00"
            />
          </div>
        </div>

        {/* Client Location - μπλοκάκι only */}
        {regime === "mplokaki" && (
          <>
            <Separator />
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <Label className="block text-sm font-medium">
                  {LABELS.clientLocation.title}
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[min(20rem,calc(100vw-2rem))]">
                    <p>{TOOLTIPS.foreignClient}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                {(["domestic", "foreign", "mixed"] as const).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      if (loc !== "domestic") trackForeignClient(loc);
                      onClientLocationChange(loc);
                    }}
                    className={`flex-1 rounded-md border px-2 py-2.5 text-sm transition-colors ${
                      clientLocation === loc
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-accent"
                    }`}
                  >
                    {LABELS.clientLocation[loc]}
                  </button>
                ))}
              </div>
              {clientLocation === "mixed" && (
                <div className="mt-3">
                  <Label htmlFor="domestic-share" className="mb-1.5 block text-sm font-medium">
                    {LABELS.clientLocation.domesticShare}
                  </Label>
                  <Input
                    id="domestic-share"
                    type="number"
                    min={0}
                    max={100}
                    step={5}
                    value={domesticIncomeShare}
                    onChange={(e) =>
                      onDomesticIncomeShareChange(
                        sanitizeNumericInput(e.target.value, { min: 0, max: 100 })
                      )
                    }
                    className="tabular-nums"
                  />
                </div>
              )}
            </div>
          </>
        )}

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

        {/* Atomiki-specific fields */}
        {regime === "atomiki" && (
          <>
            <Separator />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="first-year"
                checked={isFirstYearFiling}
                onChange={(e) => onFirstYearFilingChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="first-year" className="text-sm">
                {LABELS.newBusiness.firstYear}
              </Label>
            </div>

            <div>
              <Label className="mb-1.5 block text-sm font-medium">
                {LABELS.newBusiness.yearsActive}
              </Label>
              <Select
                value={String(yearsInBusiness)}
                onValueChange={(v) => onYearsInBusinessChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {i + 1 === 13 ? "13+" : String(i + 1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <Separator />

        {/* Taxable Income Display */}
        <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 p-4 dark:from-indigo-950/30 dark:to-blue-950/30">
          <div className="text-sm text-muted-foreground">
            {LABELS.income.taxable}
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
            {formatCurrency(taxableIncome)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
