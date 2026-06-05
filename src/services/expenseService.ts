import type { Expense, ExpenseCategory, MonthlySpending, CategoryBreakdown } from '../types';
import { CATEGORIES, CHART_COLORS } from '../utils';

const STORAGE_KEY = 'expense-tracker-data';

/**
 * Load expenses from localStorage.
 * Returns empty array if no data exists or if data is corrupted.
 */
export const loadExpenses = (): Expense[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    console.warn('Failed to load expenses from localStorage');
    return [];
  }
};

/**
 * Save expenses to localStorage.
 */
export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    console.error('Failed to save expenses to localStorage');
  }
};

/**
 * Calculate total expenses for a given list.
 */
export const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

/**
 * Get expenses for the current month.
 */
export const getCurrentMonthExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return expenses.filter((exp) => {
    const d = new Date(exp.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

/**
 * Get expenses for the previous month (for trend calculation).
 */
export const getPreviousMonthExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = prevMonth.getFullYear();
  const month = prevMonth.getMonth();
  return expenses.filter((exp) => {
    const d = new Date(exp.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

/**
 * Get the category with the highest spending.
 */
export const getHighestCategory = (expenses: Expense[]): { category: ExpenseCategory; amount: number } | null => {
  if (expenses.length === 0) return null;

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  let highest = { category: '' as ExpenseCategory, amount: 0 };
  Object.entries(categoryTotals).forEach(([cat, amount]) => {
    if (amount > highest.amount) {
      highest = { category: cat as ExpenseCategory, amount };
    }
  });

  return highest;
};

/**
 * Generate monthly spending data for the last 6 months.
 */
export const getMonthlySpending = (expenses: Expense[]): MonthlySpending[] => {
  const months: MonthlySpending[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthName = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    const total = expenses
      .filter((exp) => {
        const ed = new Date(exp.date);
        return ed.getFullYear() === year && ed.getMonth() === month;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    months.push({ month: monthName, amount: total });
  }

  return months;
};

/**
 * Generate category breakdown data for charts.
 */
export const getCategoryBreakdown = (expenses: Expense[]): CategoryBreakdown[] => {
  const categoryTotals: Record<string, number> = {};

  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  return Object.entries(categoryTotals)
    .map(([name, value], index) => ({
      name,
      value: Math.round(value * 100) / 100,
      color: CATEGORIES[name as ExpenseCategory]?.color || CHART_COLORS[index % CHART_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Generate sample data for first-time users.
 */
export const generateSampleData = (): Expense[] => {
  const now = new Date();
  const samples: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { title: 'Grocery Shopping', amount: 87.43, category: 'Food & Dining', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString().split('T')[0], notes: 'Weekly groceries from Whole Foods' },
    { title: 'Uber Ride', amount: 24.50, category: 'Transportation', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString().split('T')[0], notes: 'Airport pickup' },
    { title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0], notes: 'Monthly subscription' },
    { title: 'Electric Bill', amount: 142.30, category: 'Bills & Utilities', date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString().split('T')[0], notes: 'June electric bill' },
    { title: 'New Running Shoes', amount: 129.99, category: 'Shopping', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3).toISOString().split('T')[0], notes: 'Nike Air Max from Amazon' },
    { title: 'Gym Membership', amount: 49.99, category: 'Health & Fitness', date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0], notes: 'Monthly membership fee' },
    { title: 'Coffee & Lunch', amount: 18.75, category: 'Food & Dining', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0], notes: 'Meeting with client at Starbucks' },
    { title: 'Online Course', amount: 79.99, category: 'Education', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().split('T')[0], notes: 'React Advanced Patterns on Udemy' },
    { title: 'Haircut', amount: 35.00, category: 'Personal Care', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5).toISOString().split('T')[0], notes: 'Monthly haircut at the salon' },
    { title: 'Gas Station', amount: 52.40, category: 'Transportation', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4).toISOString().split('T')[0], notes: 'Full tank for the road trip' },
    { title: 'Restaurant Dinner', amount: 67.80, category: 'Food & Dining', date: new Date(now.getFullYear(), now.getMonth() - 1, 20).toISOString().split('T')[0], notes: 'Date night at Italian restaurant' },
    { title: 'Spotify Premium', amount: 9.99, category: 'Entertainment', date: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0], notes: 'Monthly music subscription' },
    { title: 'Internet Bill', amount: 79.99, category: 'Bills & Utilities', date: new Date(now.getFullYear(), now.getMonth() - 1, 5).toISOString().split('T')[0], notes: 'Fiber internet monthly bill' },
    { title: 'Flight Tickets', amount: 324.00, category: 'Travel', date: new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString().split('T')[0], notes: 'Round trip to San Francisco' },
    { title: 'Protein Powder', amount: 44.99, category: 'Health & Fitness', date: new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString().split('T')[0], notes: 'Monthly protein supply' },
    { title: 'Book Purchase', amount: 22.99, category: 'Education', date: new Date(now.getFullYear(), now.getMonth() - 2, 12).toISOString().split('T')[0], notes: 'Clean Architecture by Robert Martin' },
    { title: 'Movie Tickets', amount: 28.00, category: 'Entertainment', date: new Date(now.getFullYear(), now.getMonth() - 2, 18).toISOString().split('T')[0], notes: 'IMAX experience with friends' },
    { title: 'Parking Fee', amount: 15.00, category: 'Transportation', date: new Date(now.getFullYear(), now.getMonth() - 2, 22).toISOString().split('T')[0], notes: 'Downtown parking garage' },
  ];

  return samples.map((sample, index) => ({
    ...sample,
    id: `exp_sample_${index}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};
