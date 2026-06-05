import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plus, Menu, X } from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';

/**
 * Top navigation bar with frosted glass effect.
 * Contains brand identity and primary "Add Expense" CTA.
 */
export function Navbar() {
  const openForm = useExpenseStore((s) => s.openForm);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenForm = () => {
    setIsMobileMenuOpen(false);
    openForm();
  };

  return (
    <>
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
              onClick={handleOpenForm}
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
              className="btn btn-ghost btn-icon"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-drawer-header">
                <div className="nav-brand">
                  <div className="nav-logo">
                    <Wallet size={20} />
                  </div>
                  <div className="nav-title">SpendWise</div>
                </div>
                <motion.button
                  className="btn btn-ghost btn-icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <div className="mobile-drawer-content">
                <motion.button
                  className="btn btn-primary"
                  onClick={handleOpenForm}
                  style={{ width: '100%', justifyContent: 'center' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={18} />
                  <span>Add Expense</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
