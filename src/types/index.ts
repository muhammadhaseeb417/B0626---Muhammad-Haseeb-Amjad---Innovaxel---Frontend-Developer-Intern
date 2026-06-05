/** Core expense category type */
export type ExpenseCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Health & Fitness'
  | 'Travel'
  | 'Education'
  | 'Personal Care'
  | 'Other';

/** Single expense record */
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date string
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** Form data for creating/editing an expense */
export interface ExpenseFormData {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes: string;
}

/** Sort configuration */
export interface SortConfig {
  key: keyof Expense;
  direction: 'asc' | 'desc';
}

/** Filter state */
export interface FilterState {
  search: string;
  category: ExpenseCategory | 'all';
  dateFrom: string;
  dateTo: string;
}

/** Dashboard summary card data */
export interface SummaryCard {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  trend: number;
  trendLabel: string;
  color: string;
}

/** Chart data point for monthly spending */
export interface MonthlySpending {
  month: string;
  amount: number;
}

/** Chart data point for category breakdown */
export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
}

/** Pagination state */
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
