import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';

/**
 * Confirmation modal for deleting an expense.
 * Shows a warning with the expense title and requires explicit confirmation.
 */
export function DeleteModal() {
  const isOpen = useExpenseStore((s) => s.isDeleteModalOpen);
  const deletingId = useExpenseStore((s) => s.deletingExpenseId);
  const expenses = useExpenseStore((s) => s.expenses);
  const closeDeleteModal = useExpenseStore((s) => s.closeDeleteModal);
  const confirmDelete = useExpenseStore((s) => s.confirmDelete);

  const deletingExpense = expenses.find((e) => e.id === deletingId);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeDeleteModal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeDeleteModal]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.15 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm deletion"
        >
          <motion.div
            className="modal"
            variants={modalVariants}
            style={{ maxWidth: '420px' }}
          >
            <div className="modal-header">
              <div />
              <motion.button
                className="btn btn-ghost btn-icon"
                onClick={closeDeleteModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <X size={20} />
              </motion.button>
            </div>
            <div className="modal-body" style={{ paddingTop: '8px' }}>
              <div className="delete-modal-icon">
                <AlertTriangle size={28} />
              </div>
              <div className="delete-modal-text">
                <h3>Delete Expense</h3>
                <p>
                  Are you sure you want to delete{' '}
                  <strong>"{deletingExpense?.title}"</strong>? This action
                  cannot be undone.
                </p>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center', gap: '12px' }}>
              <button
                className="btn btn-secondary"
                onClick={closeDeleteModal}
                style={{ minWidth: '100px' }}
              >
                Cancel
              </button>
              <motion.button
                className="btn btn-danger"
                onClick={confirmDelete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ minWidth: '100px' }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
