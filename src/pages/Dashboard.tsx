import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useExpenseStore } from '../store/useExpenseStore';
import { SummaryCards } from '../components/SummaryCards';
import { FilterBar } from '../components/FilterBar';
import { ExpenseTable } from '../components/ExpenseTable';
import { CategoryChart } from '../components/CategoryChart';
import { MonthlyChart } from '../components/MonthlyChart';
import { TrendChart } from '../components/TrendChart';

/**
 * Main dashboard page that assembles all sections:
 * Summary cards, charts, filters, and expense table.
 */
export function Dashboard() {
  const initializeStore = useExpenseStore((s) => s.initializeStore);
  const isLoading = useExpenseStore((s) => s.isLoading);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (isLoading) {
    return (
      <div className="page">
        <div className="content-container">
          {/* Loading skeleton */}
          <div style={{ marginBottom: '32px' }}>
            <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '300px', height: '16px' }} />
          </div>
          <div className="summary-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
          <div className="charts-grid">
            <div className="skeleton" style={{ height: '380px', borderRadius: 'var(--radius-xl)' }} />
            <div className="skeleton" style={{ height: '380px', borderRadius: 'var(--radius-xl)' }} />
          </div>
          <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-xl)' }} />
        </div>
      </div>
    );
  }

  return (
    <main className="page" role="main">
      <div className="content-container">
        {/* Page Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">
            Track your spending, analyze trends, and take control of your finances.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts Section */}
        <div className="section">
          <motion.div
            className="section-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h2 className="section-title">Analytics</h2>
              <p className="section-subtitle">Visual insights into your spending patterns</p>
            </div>
          </motion.div>
          <div className="charts-grid">
            <CategoryChart />
            <MonthlyChart />
            <TrendChart />
          </div>
        </div>

        {/* Expense List Section */}
        <div className="section">
          <motion.div
            className="section-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <h2 className="section-title">Expenses</h2>
              <p className="section-subtitle">View, search, and manage all your expenses</p>
            </div>
          </motion.div>

          <FilterBar />
          <ExpenseTable />
        </div>
      </div>
    </main>
  );
}
