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
import { LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { AgeGroup, FiscalYear, ProfessionType, Regime } from "@/lib/types";

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
  taxableIncome,
}: IncomeFormProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Στοιχεία Εισοδήματος</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
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
              step={100}
              value={grossIncome || ""}
              onChange={(e) => onGrossIncomeChange(Number(e.target.value))}
              className="pl-7 tabular-nums"
              placeholder="0,00"
            />
          </div>
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
              onChange={(e) => onOtherExpensesChange(Number(e.target.value))}
              className="pl-7 tabular-nums"
              placeholder="0,00"
            />
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
                  className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
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
