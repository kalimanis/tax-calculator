import type { EfkaCategory, FiscalYear, ProfessionType } from "./types";

const EFKA_STANDARD: Record<FiscalYear, Record<number, EfkaCategory>> = {
  2025: {
    1: { monthly: 254.65, annual: 3055.80, label: "1η Κατηγορία" },
    2: { monthly: 303.59, annual: 3643.08, label: "2η Κατηγορία" },
    3: { monthly: 361.84, annual: 4342.08, label: "3η Κατηγορία" },
    4: { monthly: 432.90, annual: 5194.80, label: "4η Κατηγορία" },
    5: { monthly: 516.78, annual: 6201.36, label: "5η Κατηγορία" },
    6: { monthly: 669.39, annual: 8032.68, label: "6η Κατηγορία" },
  },
  2026: {
    1: { monthly: 260.77, annual: 3129.24, label: "1η Κατηγορία" },
    2: { monthly: 310.93, annual: 3731.16, label: "2η Κατηγορία" },
    3: { monthly: 370.63, annual: 4447.56, label: "3η Κατηγορία" },
    4: { monthly: 443.47, annual: 5321.64, label: "4η Κατηγορία" },
    5: { monthly: 529.45, annual: 6353.40, label: "5η Κατηγορία" },
    6: { monthly: 685.87, annual: 8230.44, label: "6η Κατηγορία" },
  },
};

const EFKA_NEW_PROFESSIONAL: Record<FiscalYear, EfkaCategory> = {
  2025: { monthly: 156.79, annual: 1881.48 },
  2026: { monthly: 160.46, annual: 1925.52 },
};

const EFKA_ENGINEER_LAWYER: Record<FiscalYear, Record<number, EfkaCategory>> = {
  2025: {
    1: { monthly: 330.37, annual: 3964.44, label: "1η Κατηγορία" },
    2: { monthly: 394.47, annual: 4733.64, label: "2η Κατηγορία" },
    3: { monthly: 470.19, annual: 5642.28, label: "3η Κατηγορία" },
  },
  2026: {
    1: { monthly: 338.39, annual: 4060.68, label: "1η Κατηγορία" },
    2: { monthly: 404.08, annual: 4848.96, label: "2η Κατηγορία" },
    3: { monthly: 481.69, annual: 5780.28, label: "3η Κατηγορία" },
  },
};

const EFKA_DOCTOR: Record<FiscalYear, Record<number, EfkaCategory>> = {
  2025: {
    1: { monthly: 286.94, annual: 3443.28, label: "1η Κατηγορία" },
    2: { monthly: 341.71, annual: 4100.52, label: "2η Κατηγορία" },
    3: { monthly: 406.94, annual: 4883.28, label: "3η Κατηγορία" },
  },
  2026: {
    1: { monthly: 293.82, annual: 3525.84, label: "1η Κατηγορία" },
    2: { monthly: 349.95, annual: 4199.40, label: "2η Κατηγορία" },
    3: { monthly: 416.95, annual: 5003.40, label: "3η Κατηγορία" },
  },
};

export function getEfkaTable(
  year: FiscalYear,
  profession: ProfessionType
): Record<number, EfkaCategory> {
  switch (profession) {
    case "standard":
      return EFKA_STANDARD[year];
    case "engineer":
      return EFKA_ENGINEER_LAWYER[year];
    case "doctor":
      return EFKA_DOCTOR[year];
  }
}

export function getEfkaNewProfessional(year: FiscalYear): EfkaCategory {
  return EFKA_NEW_PROFESSIONAL[year];
}

export function getMaxCategory(profession: ProfessionType): number {
  return profession === "standard" ? 6 : 3;
}
