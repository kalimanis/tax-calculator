import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Disclaimer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-8 border-t pt-6 pb-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">{t("disclaimer")}</p>
            <p className="mt-2 text-xs opacity-75">
              Ν.4172/2013 (ΚΦΕ) · Ν.5246/2025 (ΦΕΚ Α' 198) · Ν.5162/2024 ·
              Ν.4670/2020 · Εγκ. e-ΕΦΚΑ 2/2025 · Εγκ. e-ΕΦΚΑ 6/2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
