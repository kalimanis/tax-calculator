import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { LandingPage } from "@/pages/LandingPage";

const TaxCalculator = lazy(() =>
  import("@/components/TaxCalculator").then((m) => ({
    default: m.TaxCalculator,
  }))
);

const ChangelogPage = lazy(() =>
  import("@/components/ChangelogPage").then((m) => ({
    default: m.ChangelogPage,
  }))
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/calculator"
          element={
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
                </div>
              }
            >
              <TaxCalculator />
            </Suspense>
          }
        />
        <Route
          path="/changelog"
          element={
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
                </div>
              }
            >
              <ChangelogPage />
            </Suspense>
          }
        />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
