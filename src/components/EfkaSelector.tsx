import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { LABELS, TOOLTIPS } from "@/lib/constants";
import { getEfkaTable, getEfkaNewProfessional, getMaxCategory } from "@/lib/efka-tables";
import { formatCurrency } from "@/lib/utils";
import type { FiscalYear, ProfessionType } from "@/lib/types";

interface EfkaSelectorProps {
  year: FiscalYear;
  efkaAnnual: number;
  onEfkaChange: (value: number) => void;
  autoMode: boolean;
  onAutoModeChange: (auto: boolean) => void;
  profession: ProfessionType;
  onProfessionChange: (p: ProfessionType) => void;
  category: number;
  onCategoryChange: (c: number) => void;
  isNewProfessional: boolean;
  onNewProfessionalChange: (v: boolean) => void;
}

export function EfkaSelector({
  year,
  efkaAnnual,
  onEfkaChange,
  autoMode,
  onAutoModeChange,
  profession,
  onProfessionChange,
  category,
  onCategoryChange,
  isNewProfessional,
  onNewProfessionalChange,
}: EfkaSelectorProps) {
  const table = getEfkaTable(year, profession);
  const maxCat = getMaxCategory(profession);
  const newProf = getEfkaNewProfessional(year);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Label className="text-sm font-medium shrink-0">
            {LABELS.income.efka}
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[min(20rem,calc(100vw-2rem))]">
              <p>{TOOLTIPS.efka}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Label htmlFor="efka-mode" className="text-xs text-muted-foreground">
            {autoMode ? LABELS.efka.auto : LABELS.efka.manual}
          </Label>
          <Switch
            id="efka-mode"
            checked={autoMode}
            onCheckedChange={onAutoModeChange}
          />
        </div>
      </div>

      {autoMode ? (
        <div className="space-y-3 rounded-lg border bg-slate-50/50 p-3 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="new-professional"
              checked={isNewProfessional}
              onChange={(e) => onNewProfessionalChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="new-professional" className="text-sm">
              {LABELS.efka.newProfessional}
            </Label>
          </div>

          {!isNewProfessional && (
            <>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  {LABELS.efka.profession}
                </Label>
                <Select
                  value={profession}
                  onValueChange={(v) => onProfessionChange(v as ProfessionType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      {LABELS.efka.professions.standard}
                    </SelectItem>
                    <SelectItem value="engineer">
                      {LABELS.efka.professions.engineer}
                    </SelectItem>
                    <SelectItem value="doctor">
                      {LABELS.efka.professions.doctor}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  {LABELS.efka.category}
                </Label>
                <Select
                  value={String(category)}
                  onValueChange={(v) => onCategoryChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: maxCat }, (_, i) => i + 1).map((cat) => (
                      <SelectItem key={cat} value={String(cat)}>
                        {table[cat].label} — {formatCurrency(table[cat].monthly)}/μήνα
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{LABELS.efka.annual}:</span>
            <Badge variant="secondary" className="text-sm font-semibold tabular-nums">
              {formatCurrency(efkaAnnual)}
            </Badge>
          </div>
          {!isNewProfessional && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{LABELS.efka.monthly}:</span>
              <span className="tabular-nums text-muted-foreground">
                {formatCurrency(table[category]?.monthly ?? 0)}
              </span>
            </div>
          )}
          {isNewProfessional && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{LABELS.efka.monthly}:</span>
              <span className="tabular-nums text-muted-foreground">
                {formatCurrency(newProf.monthly)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            €
          </span>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={efkaAnnual || ""}
            onChange={(e) => onEfkaChange(Number(e.target.value))}
            className="pl-7 tabular-nums"
            placeholder="0,00"
          />
        </div>
      )}
    </div>
  );
}
