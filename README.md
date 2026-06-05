# SpendWise — Personal Expense Tracker

A premium fintech-inspired personal expense tracking web application built with modern technologies. Track spending, analyze trends, and take control of your finances with beautiful analytics and charts.

**Live Demo:** [https://spendwise-expense-track.netlify.app/](https://spendwise-expense-track.netlify.app/)

## Features

- **Dashboard Analytics** — Summary cards with trend indicators for Total Expenses, Monthly Spending, Top Category, and Transaction Count
- **Add/Edit Expenses** — Professional modal form with real-time Zod validation, floating labels, and error/success states
- **Expense Table** — Sortable, paginated data table with search, category filters, and date range filters
- **Charts & Analytics** — Category breakdown (donut chart), monthly spending (bar chart), and spending trend (area chart) powered by Recharts
- **Delete Confirmation** — Modal confirmation before deleting expenses
- **Toast Notifications** — Success/error feedback on all CRUD operations
- **Local Storage Persistence** — Data persists across browser sessions
- **Sample Data** — Pre-populated sample expenses for first-time users
- **Fully Responsive** — Optimized for desktop, tablet, and mobile viewports
- **Accessible** — WCAG-compliant with keyboard navigation, focus states, and semantic HTML

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS 4 | Utility CSS framework |
| Framer Motion | Animations & transitions |
| Recharts | Charts & data visualization |
| React Hook Form | Form state management |
| Zod | Schema validation |
| Zustand | Global state management |
| Lucide React | Icon system |

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── CategoryChart.tsx
│   ├── DeleteModal.tsx
│   ├── ExpenseForm.tsx
│   ├── ExpenseTable.tsx
│   ├── FilterBar.tsx
│   ├── MonthlyChart.tsx
│   ├── Navbar.tsx
│   ├── SummaryCards.tsx
│   ├── Toast.tsx
│   └── TrendChart.tsx
├── hooks/              # Custom React hooks
│   ├── index.ts
│   ├── useKeyboard.ts
│   └── useMediaQuery.ts
├── layouts/            # Layout components
│   └── MainLayout.tsx
├── pages/              # Page-level components
│   └── Dashboard.tsx
├── services/           # Business logic & data services
│   └── expenseService.ts
├── store/              # Zustand state management
│   └── useExpenseStore.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utilities & constants
│   ├── index.ts
│   └── validation.ts
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Design system & global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Design System

### Color Palette

- **Primary**: `#4F46E5` (Indigo)
- **Success**: `#10B981` (Emerald)
- **Danger**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)
- **Background**: `#F8FAFC`
- **Surface**: `#FFFFFF`
- **Text**: `#0F172A` / `#64748B`

### Typography

- **Font**: Inter (primary), Manrope (fallback)
- **Scale**: 12px – 32px with consistent weight progression

### Spacing

- 8-point grid system for consistent visual rhythm

## License

MIT
