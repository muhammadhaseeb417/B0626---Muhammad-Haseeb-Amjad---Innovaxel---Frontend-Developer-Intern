import { create } from 'zustand';
import type { Expense, ExpenseFormData, FilterState, SortConfig } from '../types';
import { loadExpenses, saveExpenses, generateSampleData } from '../services/expenseService';
import { generateId } from '../utils';
import { showToast } from '../components/Toast';

interface ExpenseStore {
  // State
  expenses: Expense[];
  filters: FilterState;
  sort: SortConfig;
  currentPage: number;
  itemsPerPage: number;
  isFormOpen: boolean;
  editingExpense: Expense | null;
  isDeleteModalOpen: boolean;
  deletingExpenseId: string | null;
  isLoading: boolean;

  // Actions
  initializeStore: () => void;
  addExpense: (data: ExpenseFormData) => void;
  updateExpense: (id: string, data: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setSort: (sort: SortConfig) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  openForm: (expense?: Expense) => void;
  closeForm: () => void;
  openDeleteModal: (id: string) => void;
  closeDeleteModal: () => void;
  confirmDelete: () => void;

  // Computed (selectors)
  getFilteredExpenses: () => Expense[];
  getSortedExpenses: () => Expense[];
  getPaginatedExpenses: () => Expense[];
  getTotalPages: () => number;
}

const defaultFilters: FilterState = {
  search: '',
  category: 'all',
  dateFrom: '',
  dateTo: '',
};

const defaultSort: SortConfig = {
  key: 'date',
  direction: 'desc',
};

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  // Initial state
  expenses: [],
  filters: { ...defaultFilters },
  sort: { ...defaultSort },
  currentPage: 1,
  itemsPerPage: 10,
  isFormOpen: false,
  editingExpense: null,
  isDeleteModalOpen: false,
  deletingExpenseId: null,
  isLoading: true,

  // Initialize store from localStorage
  initializeStore: () => {
    let expenses = loadExpenses();
    if (expenses.length === 0) {
      expenses = generateSampleData();
      saveExpenses(expenses);
    }
    set({ expenses, isLoading: false });
  },

  // Add a new expense
  addExpense: (data: ExpenseFormData) => {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const expenses = [newExpense, ...get().expenses];
    saveExpenses(expenses);
    set({ expenses, isFormOpen: false, editingExpense: null });
    showToast('Expense added successfully', 'success');
  },

  // Update an existing expense
  updateExpense: (id: string, data: ExpenseFormData) => {
    const expenses = get().expenses.map((exp) =>
      exp.id === id
        ? { ...exp, ...data, updatedAt: new Date().toISOString() }
        : exp
    );
    saveExpenses(expenses);
    set({ expenses, isFormOpen: false, editingExpense: null });
    showToast('Expense updated successfully', 'success');
  },

  // Delete an expense by ID
  deleteExpense: (id: string) => {
    const expenses = get().expenses.filter((exp) => exp.id !== id);
    saveExpenses(expenses);
    set({ expenses });
    showToast('Expense deleted', 'success');
  },

  // Update filter state
  setFilters: (newFilters: Partial<FilterState>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    }));
  },

  // Reset all filters
  resetFilters: () => {
    set({ filters: { ...defaultFilters }, currentPage: 1 });
  },

  // Set sort configuration
  setSort: (sort: SortConfig) => {
    set({ sort, currentPage: 1 });
  },

  // Pagination
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setItemsPerPage: (size: number) => set({ itemsPerPage: size, currentPage: 1 }),

  // Form modal
  openForm: (expense?: Expense) => {
    set({ isFormOpen: true, editingExpense: expense || null });
  },
  closeForm: () => {
    set({ isFormOpen: false, editingExpense: null });
  },

  // Delete confirmation modal
  openDeleteModal: (id: string) => {
    set({ isDeleteModalOpen: true, deletingExpenseId: id });
  },
  closeDeleteModal: () => {
    set({ isDeleteModalOpen: false, deletingExpenseId: null });
  },
  confirmDelete: () => {
    const id = get().deletingExpenseId;
    if (id) {
      get().deleteExpense(id);
    }
    set({ isDeleteModalOpen: false, deletingExpenseId: null });
  },

  // Get filtered expenses
  getFilteredExpenses: () => {
    const { expenses, filters } = get();
    return expenses.filter((exp) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          exp.title.toLowerCase().includes(searchLower) ||
          exp.category.toLowerCase().includes(searchLower) ||
          exp.notes.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'all' && exp.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && exp.date < filters.dateFrom) return false;
      if (filters.dateTo && exp.date > filters.dateTo) return false;

      return true;
    });
  },

  // Get sorted expenses (from filtered)
  getSortedExpenses: () => {
    const filtered = get().getFilteredExpenses();
    const { sort } = get();

    return [...filtered].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  },

  // Get paginated expenses (from sorted)
  getPaginatedExpenses: () => {
    const sorted = get().getSortedExpenses();
    const { currentPage, itemsPerPage } = get();
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  },

  // Total pages
  getTotalPages: () => {
    const filtered = get().getFilteredExpenses();
    const { itemsPerPage } = get();
    return Math.ceil(filtered.length / itemsPerPage);
  },
}));
