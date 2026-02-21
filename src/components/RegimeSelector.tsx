import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { LABELS, TOOLTIPS } from "@/lib/constants";
import type { Regime } from "@/lib/types";

interface RegimeSelectorProps {
  value: Regime;
  onChange: (regime: Regime) => void;
}

export function RegimeSelector({ value, onChange }: RegimeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {LABELS.taxRegime}
      </span>
      <Tabs value={value} onValueChange={(v) => onChange(v as Regime)}>
        <TabsList>
          <TabsTrigger value="mplokaki" className="flex items-center gap-1.5">
            {LABELS.regime.mplokaki}
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{TOOLTIPS.mplokaki}</p>
              </TooltipContent>
            </Tooltip>
          </TabsTrigger>
          <TabsTrigger value="atomiki" className="flex items-center gap-1.5">
            {LABELS.regime.atomiki}
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{TOOLTIPS.atomiki}</p>
              </TooltipContent>
            </Tooltip>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
