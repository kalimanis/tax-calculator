import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";
import { YearSelector } from "./YearSelector";
import { RegimeSelector } from "./RegimeSelector";
import { IncomeForm } from "./IncomeForm";
import { ResultsSummary } from "./ResultsSummary";
import { BracketBreakdown } from "./BracketBreakdown";
import { IncomeWaterfall } from "./IncomeWaterfall";
import { ComparisonView } from "./ComparisonView";
import { Disclaimer } from "./Disclaimer";
import { calculateTax } from "@/lib/tax-engine";
import { getEfkaTable, getEfkaNewProfessional, getMaxCategory } from "@/lib/efka-tables";
import type { AgeGroup, FiscalYear, ProfessionType, Regime, TaxInput } from "@/lib/types";

function getUrlParams(): Partial<Record<string, string>> {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function setUrlParams(params: Record<string, string>) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "0" && value !== "standard" && value !== "false") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState({}, "", url.toString());
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, () => setDark((d) => !d)] as const;
}

export function TaxCalculator() {
  const urlParams = getUrlParams();
  const [dark, toggleDark] = useDarkMode();

  const [year, setYear] = useState<FiscalYear>(
    urlParams.y === "2026" ? 2026 : 2025
  );
  const [regime, setRegime] = useState<Regime>(
    urlParams.r === "atomiki" ? "atomiki" : "mplokaki"
  );
  const [grossIncome, setGrossIncome] = useState(
    Number(urlParams.gi) || 0
  );
  const [otherExpenses, setOtherExpenses] = useState(
    Number(urlParams.ex) || 0
  );
  const [children, setChildren] = useState(Number(urlParams.ch) || 0);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(
    (urlParams.ag as AgeGroup) || "standard"
  );
  const [isFirstYearFiling, setIsFirstYearFiling] = useState(
    urlParams.fy === "1"
  );
  const [yearsInBusiness, setYearsInBusiness] = useState(
    Number(urlParams.yb) || 4
  );

  // EFKA state
  const [efkaAutoMode, setEfkaAutoMode] = useState(true);
  const [profession, setProfession] = useState<ProfessionType>(
    (urlParams.pr as ProfessionType) || "standard"
  );
  const [efkaCategory, setEfkaCategory] = useState(
    Number(urlParams.ec) || 1
  );
  const [isNewProfessional, setIsNewProfessional] = useState(
    urlParams.np === "1"
  );
  const [manualEfka, setManualEfka] = useState(Number(urlParams.me) || 0);

  // Compute EFKA annual based on mode
  const efkaAnnual = useMemo(() => {
    if (!efkaAutoMode) return manualEfka;
    if (isNewProfessional) return getEfkaNewProfessional(year).annual;
    const table = getEfkaTable(year, profession);
    const maxCat = getMaxCategory(profession);
    const cat = Math.min(efkaCategory, maxCat);
    return table[cat]?.annual ?? 0;
  }, [efkaAutoMode, manualEfka, isNewProfessional, year, profession, efkaCategory]);

  // Ensure category stays valid when profession changes
  const handleProfessionChange = useCallback(
    (p: ProfessionType) => {
      setProfession(p);
      const maxCat = getMaxCategory(p);
      if (efkaCategory > maxCat) setEfkaCategory(maxCat);
    },
    [efkaCategory]
  );

  // Tax input
  const taxInput: TaxInput = useMemo(
    () => ({
      fiscalYear: year,
      regime,
      grossIncome,
      efkaAnnual,
      otherExpenses,
      children,
      ageGroup: year === 2025 ? "standard" : ageGroup,
      isFirstYearFiling: regime === "atomiki" ? isFirstYearFiling : false,
      yearsInBusiness: regime === "atomiki" ? yearsInBusiness : 4,
    }),
    [year, regime, grossIncome, efkaAnnual, otherExpenses, children, ageGroup, isFirstYearFiling, yearsInBusiness]
  );

  const result = useMemo(() => calculateTax(taxInput), [taxInput]);

  // Sync to URL
  useEffect(() => {
    setUrlParams({
      y: String(year),
      r: regime,
      gi: String(grossIncome),
      ex: String(otherExpenses),
      ch: String(children),
      ag: ageGroup,
      fy: isFirstYearFiling ? "1" : "0",
      yb: String(yearsInBusiness),
      pr: profession,
      ec: String(efkaCategory),
      np: isNewProfessional ? "1" : "0",
      me: String(manualEfka),
    });
  }, [year, regime, grossIncome, otherExpenses, children, ageGroup, isFirstYearFiling, yearsInBusiness, profession, efkaCategory, isNewProfessional, manualEfka]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white print:bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Υπολογιστής Φόρου Ελεύθερων Επαγγελματιών
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Φορολογικά Έτη 2025 &amp; 2026
            </p>
          </div>
          <button
            onClick={toggleDark}
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white print:hidden"
            aria-label={dark ? "Φωτεινό θέμα" : "Σκοτεινό θέμα"}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Controls */}
      <div className="border-b bg-white dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
          <YearSelector value={year} onChange={setYear} />
          <RegimeSelector value={regime} onChange={setRegime} />
          <div className="ml-auto print:hidden">
            <button
              onClick={() => window.print()}
              className="rounded-md border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
            >
              Εκτύπωση
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          {/* Left: Form */}
          <div>
            <IncomeForm
              year={year}
              regime={regime}
              grossIncome={grossIncome}
              onGrossIncomeChange={setGrossIncome}
              efkaAnnual={efkaAnnual}
              onEfkaChange={setManualEfka}
              efkaAutoMode={efkaAutoMode}
              onEfkaAutoModeChange={setEfkaAutoMode}
              profession={profession}
              onProfessionChange={handleProfessionChange}
              efkaCategory={efkaCategory}
              onEfkaCategoryChange={setEfkaCategory}
              isNewProfessional={isNewProfessional}
              onNewProfessionalChange={setIsNewProfessional}
              otherExpenses={otherExpenses}
              onOtherExpensesChange={setOtherExpenses}
              children={children}
              onChildrenChange={setChildren}
              ageGroup={ageGroup}
              onAgeGroupChange={setAgeGroup}
              isFirstYearFiling={isFirstYearFiling}
              onFirstYearFilingChange={setIsFirstYearFiling}
              yearsInBusiness={yearsInBusiness}
              onYearsInBusinessChange={setYearsInBusiness}
              taxableIncome={result.taxableIncome}
            />
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {grossIncome > 0 ? (
              <>
                <ResultsSummary result={result} regime={regime} />

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Λεπτομερής Ανάλυση</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <BracketBreakdown
                      brackets={result.brackets}
                      grossTax={result.grossTax}
                    />
                    <IncomeWaterfall
                      result={result}
                      grossIncome={grossIncome}
                      regime={regime}
                    />
                  </CardContent>
                </Card>

                <ComparisonView input={taxInput} currentResult={result} />
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-lg font-medium text-muted-foreground">
                    Εισάγετε τα ακαθάριστα έσοδά σας για να δείτε τα αποτελέσματα
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Τα αποτελέσματα υπολογίζονται αυτόματα
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Disclaimer />
    </div>
  );
}
