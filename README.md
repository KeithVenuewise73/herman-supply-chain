# Lowe's KPI Dashboard

A Power BI-style delivery performance dashboard for Lowe's carrier and driver KPI data, built with React, Supabase, and Recharts.

## Features

- **Executive Summary** — KPI cards, LTR distribution chart, detractor breakdown, Top/Bottom 10 drivers & carriers
- **Driver Rankings** — Sortable table with composite scoring for all SPE/drivers
- **Carrier Rankings** — Sortable table with composite scoring for all contractors/carriers
- **Store Rankings** — LTR-based store performance with detractor analysis
- **Detractor Review** — Row-level LTR detail with multi-filter support
- **Supabase Integration** — Data persists between sessions; auto-loads on startup

## Scoring Logic

### Strict LTR Score
- LTR 9 or 10 = Promoter
- LTR 8 or below = Detractor
- Formula: `count(LTR >= 9) / total responses`

### Neutral 8 LTR Score
- LTR 9 or 10 = Promoter
- LTR 8 = Neutral (excluded from denominator)
- LTR 7 or below = Detractor
- Formula: `count(LTR >= 9) / count(LTR != 8)`

### Composite Score
`(Completion% × 0.25) + (OT Window% × 0.25) + (OT% × 0.20) + (LTR Score × 0.20) - (Redelivery% × 0.10)`

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your Supabase URL and anon key
```

### 3. Run locally
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## Data Sources

Upload two Excel files through the app:
1. **Lowe's Carrier KPI** — Sheets: `SP Weekly Summary`, `SPE Weekly Summary`
2. **LTR Detractor Sheet** — Sheet: `LTR Data`

## Supabase Tables

- `ltr_data` — LTR survey responses
- `kpi_sp_weekly` — Carrier/contractor weekly KPI
- `kpi_spe_weekly` — Driver/SPE weekly KPI

## Tech Stack

- React 18
- Vite
- Supabase (PostgreSQL + Auth)
- Recharts
- SheetJS (XLSX parsing)
