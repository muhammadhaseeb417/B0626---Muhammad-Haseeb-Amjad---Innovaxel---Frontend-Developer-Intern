import type { ExpenseCategory } from '../types';

/**
 * Category configuration with associated colors and icons.
 * Colors are carefully chosen to create a cohesive, premium visual palette.
 */
export const CATEGORIES: Record<ExpenseCategory, { color: string; bgColor: string; icon: string }> = {
  'Food & Dining': { color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.1)', icon: 'UtensilsCrossed' },
  'Transportation': { color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: 'Car' },
  'Shopping': { color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)', icon: 'ShoppingBag' },
  'Entertainment': { color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.1)', icon: 'Film' },
  'Bills & Utilities': { color: '#6366F1', bgColor: 'rgba(99, 102, 241, 0.1)', icon: 'Receipt' },
  'Health & Fitness': { color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: 'Heart' },
  'Travel': { color: '#14B8A6', bgColor: 'rgba(20, 184, 166, 0.1)', icon: 'Plane' },
  'Education': { color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)', icon: 'GraduationCap' },
  'Personal Care': { color: '#E11D48', bgColor: 'rgba(225, 29, 72, 0.1)', icon: 'Sparkles' },
  'Other': { color: '#64748B', bgColor: 'rgba(100, 116, 139, 0.1)', icon: 'MoreHorizontal' },
};

/** All category names */
export const CATEGORY_LIST: ExpenseCategory[] = Object.keys(CATEGORIES) as ExpenseCategory[];

/** Chart color palette - harmonious and premium */
export const CHART_COLORS = [
  '#4F46E5', '#7C3AED', '#EC4899', '#F97316', '#10B981',
  '#3B82F6', '#14B8A6', '#F59E0B', '#E11D48', '#64748B',
];

/** Items per page options for pagination */
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

/** Default page size */
export const DEFAULT_PAGE_SIZE = 10;

/** Currency formatter */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/** Date formatter */
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

/** Short date formatter for charts */
export const formatShortMonth = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(new Date(dateString));
};

/** Generate a unique ID */
export const generateId = (): string => {
  return `exp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/** Get current ISO date string */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/** Calculate percentage change between two values */
export const calculateTrend = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

/** Clamp a number between min and max */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
