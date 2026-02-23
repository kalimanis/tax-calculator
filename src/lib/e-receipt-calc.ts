import { round2 } from "@/lib/utils";

export interface EReceiptResult {
  requiredAmount: number;
  maxPenalty: number;
  monthlyTarget: number;
  cappedAt20k: boolean;
}

export function calculateEReceipt(realIncome: number): EReceiptResult {
  const raw = realIncome * 0.3;
  const cappedAt20k = raw > 20000;
  const requiredAmount = Math.min(round2(raw), 20000);
  const maxPenalty = round2(requiredAmount * 0.22);
  const monthlyTarget = round2(requiredAmount / 12);

  return { requiredAmount, maxPenalty, monthlyTarget, cappedAt20k };
}
