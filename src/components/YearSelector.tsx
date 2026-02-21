import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { LABELS, TOOLTIPS } from "@/lib/constants";
import type { FiscalYear } from "@/lib/types";

interface YearSelectorProps {
  value: FiscalYear;
  onChange: (year: FiscalYear) => void;
}

export function YearSelector({ value, onChange }: YearSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {LABELS.fiscalYear}
      </span>
      <Tabs
        value={String(value)}
        onValueChange={(v) => onChange(Number(v) as FiscalYear)}
      >
        <TabsList>
          <TabsTrigger value="2025">2025</TabsTrigger>
          <TabsTrigger value="2026" className="flex items-center gap-1.5">
            2026
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{TOOLTIPS.changes2026}</p>
              </TooltipContent>
            </Tooltip>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
