# Greek Tax Calculator

Client-side tax calculator for Greek professionals covering fiscal years 2025 & 2026. Supports three tax regimes, EFKA contributions, and the 2026 reform (Ν.5246/2025). All calculations happen in the browser — no data is sent to any server.

## Tax Regimes

### Μισθωτός — Employee (Άρθ. 12 §1)
- Progressive income tax with tax-free allowance (Άρθ. 15) and Article 16 reduction
- EFKA contributions: 13.37% employee / 21.79% employer
- Seniority increments (0–30%) and Article 5G 50% tax reduction for returnees
- Reverse calculation: solves for gross given a target net (binary search)
- Payroll rounding simulation with monthly settlement tracking

### Μπλοκάκι — Freelance Invoice (Άρθ. 12 §2στ)
- Progressive tax with tax-free allowance and Article 16 reduction
- 20% withholding on domestic client fees (ΠΟΛ.1029/2018); foreign clients exempt
- Domestic/foreign/mixed client split with configurable percentage
- EFKA: 6 categories × 3 profession types (standard, engineer/lawyer, doctor); reduced rates for first 5 years

### Ατομική Επιχείρηση — Sole Proprietorship (Άρθ. 29)
- Business profit tax (no tax-free allowance), deductible expenses
- 55% tax prepayment (27.5% in first filing year)
- New business reduction: 50% on first bracket for first 3 years with income ≤ €10,000

## Tax Scales

**2025**: 5 brackets — 9% / 22% / 28% / 36% / 44%

**2026** (Ν.5246/2025): 6 brackets with reduced rates + child & youth reductions
- Children: rate reductions on the first 3 brackets, scaling with dependent count
- Youth: ≤25 → 0% on first €20K; 26–30 → 9% on first €20K

## Features

- **Year & regime comparison** — side-by-side 2025 vs 2026, or Invoice vs Sole Prop, with delta badges
- **E-receipt compliance** (Άρθ. 15 §6) — required collection amount (30% of income, capped at €20K), monthly target, and max penalty
- **Bracket breakdown** — per-bracket tax amounts and effective rates
- **Income waterfall chart** — gross → deductions → net visualisation
- **URL sharing** — all inputs encoded in URL params; updates in real-time as you type
- **Changelog page** — version history at `/changelog`
- **Dark mode** and **print-friendly** layout
- **i18n** — Greek and English, auto-detected from device locale

## Tech Stack

React, TypeScript, Vite, Tailwind CSS, Radix UI, Recharts, react-i18next

## Development

```bash
npm install
npm run dev      # dev server
npm run build    # production build
npm run test     # run tests
npm run lint     # lint
```

## Legal

Calculations are based on Ν.4172/2013 and Ν.5246/2025 and are indicative only. Consult a tax professional for formal advice.
