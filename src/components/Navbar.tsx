import { motion } from 'framer-motion';
import { Wallet, Plus } from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';

/**
 * Top navigation bar with frosted glass effect.
 * Contains brand identity and primary "Add Expense" CTA.
 */
export function Navbar() {
  const openForm = useExpenseStore((s) => s.openForm);

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <div className="nav-brand">
          <motion.div
            className="nav-logo"
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet size={20} />
          </motion.div>
          <div>
            <div className="nav-title">SpendWise</div>
            <div className="nav-subtitle">Personal Finance Tracker</div>
          </div>
        </div>

        <div className="nav-actions desktop-only">
          <motion.button
            className="btn btn-primary"
            onClick={() => openForm()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Add new expense"
          >
            <Plus size={18} />
            <span>Add Expense</span>
          </motion.button>
        </div>

        <div className="mobile-only">
          <motion.button
            className="btn btn-primary btn-icon"
            onClick={() => openForm()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Add new expense"
          >
            <Plus size={20} />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
