import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  FileX,
  Plus,
} from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';
import { formatCurrency, formatDate, CATEGORIES } from '../utils';
import type { Expense, SortConfig } from '../types';

/**
 * Premium data table with sorting, pagination, and action buttons.
 * Features smooth row animations and responsive design.
 */
export function ExpenseTable() {
  const getPaginatedExpenses = useExpenseStore((s) => s.getPaginatedExpenses);
  const getFilteredExpenses = useExpenseStore((s) => s.getFilteredExpenses);
  const sort = useExpenseStore((s) => s.sort);
  const setSort = useExpenseStore((s) => s.setSort);
  const currentPage = useExpenseStore((s) => s.currentPage);
  const setCurrentPage = useExpenseStore((s) => s.setCurrentPage);
  const itemsPerPage = useExpenseStore((s) => s.itemsPerPage);
  const setItemsPerPage = useExpenseStore((s) => s.setItemsPerPage);
  const getTotalPages = useExpenseStore((s) => s.getTotalPages);
  const openForm = useExpenseStore((s) => s.openForm);
  const openDeleteModal = useExpenseStore((s) => s.openDeleteModal);
  const expenses = useExpenseStore((s) => s.expenses);
  const filters = useExpenseStore((s) => s.filters);

  const paginatedExpenses = getPaginatedExpenses();
  const filteredExpenses = getFilteredExpenses();
  const totalPages = getTotalPages();

  const handleSort = (key: keyof Expense) => {
    const newSort: SortConfig = {
      key,
      direction: sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc',
    };
    setSort(newSort);
  };

  const getSortIcon = (key: keyof Expense) => {
    if (sort.key !== key) return <ArrowUpDown size={14} />;
    return sort.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  // Page numbers to display
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (expenses.length === 0) {
    return (
      <motion.div
        className="table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="empty-state">
          <div className="empty-state-icon">
            <FileX size={28} />
          </div>
          <div className="empty-state-title">No expenses yet</div>
          <div className="empty-state-description">
            Start tracking your spending by adding your first expense.
          </div>
          <motion.button
            className="btn btn-primary"
            onClick={() => openForm()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            Add Your First Expense
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <motion.div
        className="table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="empty-state">
          <div className="empty-state-icon">
            <FileX size={28} />
          </div>
          <div className="empty-state-title">No matching expenses</div>
          <div className="empty-state-description">
            Try adjusting your filters or search terms to find what you're looking for.
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="table-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="table-responsive">
        <table className="table" role="table" aria-label="Expense list">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('title')}
                className={sort.key === 'title' ? 'sorted' : ''}
                scope="col"
                aria-sort={
                  sort.key === 'title'
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Expense
                  <span className={`sort-icon ${sort.key === 'title' ? 'active' : ''}`}>
                    {getSortIcon('title')}
                  </span>
                </span>
              </th>
              <th
                onClick={() => handleSort('category')}
                className={sort.key === 'category' ? 'sorted' : ''}
                scope="col"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Category
                  <span className={`sort-icon ${sort.key === 'category' ? 'active' : ''}`}>
                    {getSortIcon('category')}
                  </span>
                </span>
              </th>
              <th
                onClick={() => handleSort('date')}
                className={sort.key === 'date' ? 'sorted' : ''}
                scope="col"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Date
                  <span className={`sort-icon ${sort.key === 'date' ? 'active' : ''}`}>
                    {getSortIcon('date')}
                  </span>
                </span>
              </th>
              <th
                onClick={() => handleSort('amount')}
                className={sort.key === 'amount' ? 'sorted' : ''}
                scope="col"
                style={{ textAlign: 'right' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                  Amount
                  <span className={`sort-icon ${sort.key === 'amount' ? 'active' : ''}`}>
                    {getSortIcon('amount')}
                  </span>
                </span>
              </th>
              <th scope="col" style={{ width: '100px', textAlign: 'center' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedExpenses.map((expense) => (
                <motion.tr
                  key={expense.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <td data-label="Expense">
                    <div className="table-title-cell">
                      <span className="table-title">{expense.title}</span>
                      {expense.notes && (
                        <span className="table-notes">{expense.notes}</span>
                      )}
                    </div>
                  </td>
                  <td data-label="Category">
                    <span
                      className="table-category"
                      style={{
                        background: CATEGORIES[expense.category]?.bgColor,
                        color: CATEGORIES[expense.category]?.color,
                      }}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="table-date" data-label="Date">{formatDate(expense.date)}</td>
                  <td className="table-amount" style={{ textAlign: 'right' }} data-label="Amount">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td data-label="Actions">
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <motion.button
                        className="btn btn-ghost btn-icon-sm"
                        onClick={() => openForm(expense)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={`Edit ${expense.title}`}
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </motion.button>
                      <motion.button
                        className="btn btn-ghost btn-icon-sm"
                        onClick={() => openDeleteModal(expense.id)}
                        whileHover={{ scale: 1.1, color: '#EF4444' }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={`Delete ${expense.title}`}
                        title="Delete"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of{' '}
            {filteredExpenses.length} expenses
            <select
              className="page-size-select"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              style={{ marginLeft: '12px' }}
              aria-label="Items per page"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ‹
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
