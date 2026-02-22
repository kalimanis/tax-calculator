import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Logo } from "@/components/Logo";
import { YearSelector } from "./YearSelector";
import { RegimeSelector } from "./RegimeSelector";
import { IncomeForm } from "./IncomeForm";
import { SalaryForm } from "./SalaryForm";
import { ResultsSummary } from "./ResultsSummary";
import { SalaryResults } from "./SalaryResults";
import { BracketBreakdown } from "./BracketBreakdown";
import { IncomeWaterfall } from "./IncomeWaterfall";
import { ComparisonView } from "./ComparisonView";
import { SalaryComparisonView } from "./SalaryComparisonView";
import { Disclaimer } from "./Disclaimer";
import { LABELS, SITE_URL } from "@/lib/constants";
import { calculateTax } from "@/lib/tax-engine";
import { calculateSalary } from "@/lib/salary-engine";
import { getEfkaRates } from "@/lib/salary-constants";
import { getEfkaTable, getEfkaNewProfessional, getMaxCategory } from "@/lib/efka-tables";
import {
  trackCalculation,
  trackModeSwitch,
  trackYearSwitch,
} from "@/lib/analytics";
import type {
  AgeGroup,
  ClientLocation,
  FiscalYear,
  PayFrequency,
  ProfessionType,
  Regime,
  SalaryDirection,
  SalaryInput,
  Seniority,
  TaxInput,
} from "@/lib/types";

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
  // Clear all existing params first
  const existingKeys = Array.from(url.searchParams.keys());
  existingKeys.forEach((key) => url.searchParams.delete(key));
  // Set new params
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "0" && value !== "standard" && value !== "false") {
      url.searchParams.set(key, value);
    }
  });
  const newUrl = url.toString();
  if (newUrl !== window.location.href) {
    window.history.replaceState({}, "", newUrl);
  }
}

function initRegime(urlParams: Partial<Record<string, string>>): Regime {
  const r = urlParams.r;
  if (r === "misthotos" || r === "atomiki") return r;
  return "mplokaki";
}

export function TaxCalculator() {
  const urlParams = getUrlParams();
  const [dark, toggleDark] = useDarkMode();

  const [year, setYear] = useState<FiscalYear>(
    urlParams.y === "2026" ? 2026 : 2025
  );
  const [regime, setRegime] = useState<Regime>(initRegime(urlParams));
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
  const [clientLocation, setClientLocation] = useState<ClientLocation>(
    (urlParams.cl as ClientLocation) || "domestic"
  );
  const [domesticIncomeShare, setDomesticIncomeShare] = useState(
    Number(urlParams.ds) || 50
  );

  // EFKA state (freelancer)
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

  // Salary state
  const defaultEfkaRates = getEfkaRates(2025);
  const [salaryDirection, setSalaryDirection] = useState<SalaryDirection>(
    urlParams.sd === "net-to-gross" ? "net-to-gross" : "gross-to-net"
  );
  const [monthlySalary, setMonthlySalary] = useState(
    Number(urlParams.ms) || 0
  );
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(
    urlParams.pf === "12" ? 12 : 14
  );
  const [efkaEmployeeRate, setEfkaEmployeeRate] = useState(
    Number(urlParams.eer) || defaultEfkaRates.employee
  );
  const [efkaEmployerRate, setEfkaEmployerRate] = useState(
    Number(urlParams.err) || defaultEfkaRates.employer
  );
  const [hasArticle5G, setHasArticle5G] = useState(urlParams.a5g === "1");
  const [seniority, setSeniority] = useState<Seniority>(
    (Number(urlParams.sn) as Seniority) || 0
  );

  // Compute EFKA annual based on mode (freelancer)
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

  const handleReset = useCallback(() => {
    setYear(2025);
    setRegime("mplokaki");
    setGrossIncome(0);
    setOtherExpenses(0);
    setChildren(0);
    setAgeGroup("standard");
    setIsFirstYearFiling(false);
    setYearsInBusiness(4);
    setClientLocation("domestic");
    setDomesticIncomeShare(50);
    setEfkaAutoMode(true);
    setProfession("standard");
    setEfkaCategory(1);
    setIsNewProfessional(false);
    setManualEfka(0);
    // Salary reset
    setSalaryDirection("gross-to-net");
    setMonthlySalary(0);
    setPayFrequency(14);
    const rates = getEfkaRates(2025);
    setEfkaEmployeeRate(rates.employee);
    setEfkaEmployerRate(rates.employer);
    setHasArticle5G(false);
    setSeniority(0);
  }, []);

  const isSalary = regime === "misthotos";

  // Analytics: map regime to analytics mode
  const regimeToMode = (r: Regime) =>
    r === "misthotos" ? "employee" as const : r;

  const prevRegime = useRef(regime);
  const handleRegimeChange = useCallback((r: Regime) => {
    trackModeSwitch(regimeToMode(prevRegime.current), regimeToMode(r));
    prevRegime.current = r;
    setRegime(r);
  }, []);

  const handleYearChange = useCallback((y: FiscalYear) => {
    trackYearSwitch(y);
    setYear(y);
  }, []);

  // Tax input (freelancer)
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
      clientLocation: regime === "mplokaki" ? clientLocation : "domestic",
      domesticIncomeShare,
    }),
    [year, regime, grossIncome, efkaAnnual, otherExpenses, children, ageGroup, isFirstYearFiling, yearsInBusiness, clientLocation, domesticIncomeShare]
  );

  const taxResult = useMemo(() => calculateTax(taxInput), [taxInput]);

  // Salary input & result
  const salaryInput: SalaryInput = useMemo(
    () => ({
      fiscalYear: year,
      direction: salaryDirection,
      monthlySalary,
      payFrequency,
      children,
      ageGroup: year === 2025 ? "standard" : ageGroup,
      efkaEmployeeRate,
      efkaEmployerRate,
      seniority,
      hasArticle5G,
    }),
    [year, salaryDirection, monthlySalary, payFrequency, children, ageGroup, efkaEmployeeRate, efkaEmployerRate, seniority, hasArticle5G]
  );

  const salaryResult = useMemo(
    () => (isSalary && monthlySalary > 0 ? calculateSalary(salaryInput) : null),
    [isSalary, monthlySalary, salaryInput]
  );

  // Salary waterfall chart data
  const salaryWaterfallData = useMemo(() => {
    if (!salaryResult) return undefined;
    return [
      { name: "Μικτός", value: salaryResult.grossAnnual, color: "#059669" },
      { name: "ΕΦΚΑ", value: salaryResult.efkaEmployee, color: "#dc2626" },
      { name: "Φόρος", value: salaryResult.netTax, color: "#dc2626" },
      { name: "Καθαρός", value: salaryResult.netAnnual, color: "#059669" },
    ];
  }, [salaryResult]);

  // Sync to URL
  useEffect(() => {
    if (isSalary) {
      setUrlParams({
        y: String(year),
        r: regime,
        ch: String(children),
        ag: ageGroup,
        sd: salaryDirection,
        ms: String(monthlySalary),
        pf: String(payFrequency),
        eer: String(efkaEmployeeRate),
        err: String(efkaEmployerRate),
        a5g: hasArticle5G ? "1" : "0",
        sn: String(seniority),
      });
    } else {
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
        cl: clientLocation,
        ds: String(domesticIncomeShare),
      });
    }
  }, [isSalary, year, regime, grossIncome, otherExpenses, children, ageGroup, isFirstYearFiling, yearsInBusiness, profession, efkaCategory, isNewProfessional, manualEfka, clientLocation, domesticIncomeShare, salaryDirection, monthlySalary, payFrequency, efkaEmployeeRate, efkaEmployerRate, hasArticle5G, seniority]);

  // Analytics: debounced calculation tracking
  useEffect(() => {
    const amount = isSalary ? monthlySalary * 12 : grossIncome;
    if (amount <= 0) return;
    const timeout = setTimeout(() => {
      trackCalculation(regimeToMode(regime), {
        fiscalYear: year,
        grossAmount: amount,
        children,
      });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isSalary, grossIncome, monthlySalary, regime, year, children]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Αρχική",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Υπολογιστής Φόρου",
        item: `${SITE_URL}/calculator`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Helmet>
        <title>Υπολογιστής Φόρου Εισοδήματος — ΦοροΥπολογιστής</title>
        <meta
          name="description"
          content="Υπολογίστε τον φόρο εισοδήματος και τον καθαρό μισθό σας. Μισθωτός, μπλοκάκι, ατομική επιχείρηση — 2025 & 2026."
        />
        <link rel="canonical" href={`${SITE_URL}/calculator`} />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Υπολογιστής Φόρου Εισοδήματος — ΦοροΥπολογιστής"
        />
        <meta
          property="og:description"
          content="Υπολογίστε τον φόρο εισοδήματος και τον καθαρό μισθό σας."
        />
        <meta property="og:url" content={`${SITE_URL}/calculator`} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:locale" content="el_GR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Υπολογιστής Φόρου Εισοδήματος — ΦοροΥπολογιστής"
        />
        <meta
          name="twitter:description"
          content="Υπολογίστε τον φόρο εισοδήματος και τον καθαρό μισθό σας."
        />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white print:bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:py-6">
          <a href="/" className="flex items-center gap-3">
            <Logo />
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
                Υπολογιστής Φόρου Εισοδήματος
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Φορολογικά Έτη 2025 &amp; 2026
              </p>
            </div>
          </a>
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
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:gap-4">
          <YearSelector value={year} onChange={handleYearChange} />
          <RegimeSelector value={regime} onChange={handleRegimeChange} />
          <div className="flex gap-2 max-sm:ml-auto print:hidden sm:ml-auto">
            <button
              onClick={handleReset}
              className="rounded-md border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
            >
              {LABELS.reset}
            </button>
            <button
              onClick={() => window.print()}
              className="hidden rounded-md border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent sm:block"
            >
              Εκτύπωση
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Left: Form */}
          <div>
            {isSalary ? (
              <SalaryForm
                year={year}
                direction={salaryDirection}
                onDirectionChange={setSalaryDirection}
                monthlySalary={monthlySalary}
                onMonthlySalaryChange={setMonthlySalary}
                payFrequency={payFrequency}
                onPayFrequencyChange={setPayFrequency}
                children={children}
                onChildrenChange={setChildren}
                ageGroup={ageGroup}
                onAgeGroupChange={setAgeGroup}
                efkaEmployeeRate={efkaEmployeeRate}
                onEfkaEmployeeRateChange={setEfkaEmployeeRate}
                efkaEmployerRate={efkaEmployerRate}
                onEfkaEmployerRateChange={setEfkaEmployerRate}
                seniority={seniority}
                onSeniorityChange={setSeniority}
                hasArticle5G={hasArticle5G}
                onArticle5GChange={setHasArticle5G}
                taxableIncome={salaryResult?.taxableIncome ?? 0}
              />
            ) : (
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
                clientLocation={clientLocation}
                onClientLocationChange={setClientLocation}
                domesticIncomeShare={domesticIncomeShare}
                onDomesticIncomeShareChange={setDomesticIncomeShare}
                taxableIncome={taxResult.taxableIncome}
              />
            )}
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {isSalary ? (
              salaryResult ? (
                <>
                  <SalaryResults result={salaryResult} payFrequency={payFrequency} />

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Λεπτομερής Ανάλυση</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <BracketBreakdown
                        brackets={salaryResult.brackets}
                        grossTax={salaryResult.grossTax}
                      />
                      <IncomeWaterfall chartData={salaryWaterfallData} />
                    </CardContent>
                  </Card>

                  <SalaryComparisonView input={salaryInput} currentResult={salaryResult} />
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-lg font-medium text-muted-foreground">
                      Εισάγετε τον μηνιαίο μισθό σας για να δείτε τα αποτελέσματα
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Τα αποτελέσματα υπολογίζονται αυτόματα
                    </p>
                  </CardContent>
                </Card>
              )
            ) : grossIncome > 0 ? (
              <>
                <ResultsSummary result={taxResult} regime={regime} clientLocation={clientLocation} />

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Λεπτομερής Ανάλυση</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <BracketBreakdown
                      brackets={taxResult.brackets}
                      grossTax={taxResult.grossTax}
                    />
                    <IncomeWaterfall
                      result={taxResult}
                      grossIncome={grossIncome}
                      regime={regime}
                    />
                  </CardContent>
                </Card>

                <ComparisonView input={taxInput} currentResult={taxResult} />
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
