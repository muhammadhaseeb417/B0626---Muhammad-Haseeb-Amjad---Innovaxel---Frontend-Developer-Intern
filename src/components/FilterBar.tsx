import { Search, X, RotateCcw } from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';
import { CATEGORY_LIST } from '../utils';
import type { ExpenseCategory } from '../types';

/**
 * Filter bar with search, category, and date range filters.
 * Provides instant filtering with accessible inputs.
 */
export function FilterBar() {
  const filters = useExpenseStore((s) => s.filters);
  const setFilters = useExpenseStore((s) => s.setFilters);
  const resetFilters = useExpenseStore((s) => s.resetFilters);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  return (
    <div className="filters-bar" role="search" aria-label="Filter expenses">
      {/* Search Input */}
      <div className="filter-search">
        <Search size={16} className="filter-search-icon" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          aria-label="Search expenses"
          id="expense-search"
        />
        {filters.search && (
          <button
            className="btn btn-ghost btn-icon-sm"
            style={{
              position: 'absolute',
              right: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            onClick={() => setFilters({ search: '' })}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="filter-divider" />

      {/* Category Filter */}
      <select
        className="filter-select"
        value={filters.category}
        onChange={(e) =>
          setFilters({ category: e.target.value as ExpenseCategory | 'all' })
        }
        aria-label="Filter by category"
        id="category-filter"
      >
        <option value="all">All Categories</option>
        {CATEGORY_LIST.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="filter-divider" />

      {/* Date Range */}
      <input
        type="date"
        className="filter-date"
        value={filters.dateFrom}
        onChange={(e) => setFilters({ dateFrom: e.target.value })}
        aria-label="From date"
        id="date-from-filter"
        placeholder="From"
      />
      <span style={{ color: 'var(--color-text-tertiary)', fontSize: '13px' }}>to</span>
      <input
        type="date"
        className="filter-date"
        value={filters.dateTo}
        onChange={(e) => setFilters({ dateTo: e.target.value })}
        aria-label="To date"
        id="date-to-filter"
        placeholder="To"
      />

      {/* Reset Filters */}
      {hasActiveFilters && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={resetFilters}
          aria-label="Reset all filters"
          id="reset-filters"
          style={{ color: 'var(--color-primary)', fontWeight: 600 }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      )}
    </div>
  );
}
