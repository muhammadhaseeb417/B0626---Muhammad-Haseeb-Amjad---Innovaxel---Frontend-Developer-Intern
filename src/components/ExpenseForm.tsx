import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Check, AlertCircle } from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';
import { expenseSchema, type ExpenseSchemaType } from '../utils/validation';
import { CATEGORY_LIST, getCurrentDate } from '../utils';
import type { ExpenseFormData } from '../types';

/**
 * Expense form modal with real-time validation, floating labels, and smooth animations.
 * Handles both create and edit flows.
 */
export function ExpenseForm() {
  const isFormOpen = useExpenseStore((s) => s.isFormOpen);
  const editingExpense = useExpenseStore((s) => s.editingExpense);
  const closeForm = useExpenseStore((s) => s.closeForm);
  const addExpense = useExpenseStore((s) => s.addExpense);
  const updateExpense = useExpenseStore((s) => s.updateExpense);

  const isEditing = !!editingExpense;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseSchemaType>({
    resolver: zodResolver(expenseSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      amount: undefined as unknown as number,
      category: '' as ExpenseSchemaType['category'],
      date: getCurrentDate(),
      notes: '',
    },
  });

  // Reset form when opening/editing
  useEffect(() => {
    if (isFormOpen) {
      if (editingExpense) {
        reset({
          title: editingExpense.title,
          amount: editingExpense.amount,
          category: editingExpense.category as ExpenseSchemaType['category'],
          date: editingExpense.date,
          notes: editingExpense.notes,
        });
      } else {
        reset({
          title: '',
          amount: undefined as unknown as number,
          category: '' as ExpenseSchemaType['category'],
          date: getCurrentDate(),
          notes: '',
        });
      }
    }
  }, [isFormOpen, editingExpense, reset]);

  const onSubmit = (data: ExpenseSchemaType) => {
    const formData: ExpenseFormData = {
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: data.date,
      notes: data.notes,
    };

    if (isEditing && editingExpense) {
      updateExpense(editingExpense.id, formData);
    } else {
      addExpense(formData);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFormOpen) closeForm();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFormOpen, closeForm]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isFormOpen && (
        <motion.div
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={isEditing ? 'Edit expense' : 'Add new expense'}
        >
          <motion.div className="modal" variants={modalVariants}>
            {/* Header */}
            <div className="modal-header">
              <h2 className="modal-title">
                {isEditing ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <motion.button
                className="btn btn-ghost btn-icon"
                onClick={closeForm}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close form"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit as any)}>
              <div className="modal-body">
                {/* Title */}
                <div className="form-group">
                  <label className="form-label" htmlFor="expense-title">
                    Title <span className="form-required">*</span>
                  </label>
                  <input
                    id="expense-title"
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="e.g., Grocery Shopping"
                    {...register('title')}
                    autoFocus
                  />
                  {errors.title && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={12} />
                      {errors.title.message}
                    </motion.div>
                  )}
                </div>

                {/* Amount & Category Row */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="expense-amount">
                      Amount ($) <span className="form-required">*</span>
                    </label>
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="expense-amount"
                          type="number"
                          step="0.01"
                          min="0"
                          className={`form-input ${errors.amount ? 'error' : ''}`}
                          placeholder="0.00"
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? undefined : parseFloat(val));
                          }}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.amount && (
                      <motion.div
                        className="form-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle size={12} />
                        {errors.amount.message}
                      </motion.div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="expense-category">
                      Category <span className="form-required">*</span>
                    </label>
                    <select
                      id="expense-category"
                      className={`form-input form-select ${errors.category ? 'error' : ''}`}
                      {...register('category')}
                    >
                      <option value="">Select category</option>
                      {CATEGORY_LIST.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <motion.div
                        className="form-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle size={12} />
                        {errors.category.message}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="form-group">
                  <label className="form-label" htmlFor="expense-date">
                    Date <span className="form-required">*</span>
                  </label>
                  <input
                    id="expense-date"
                    type="date"
                    className={`form-input ${errors.date ? 'error' : ''}`}
                    {...register('date')}
                  />
                  {errors.date && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={12} />
                      {errors.date.message}
                    </motion.div>
                  )}
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label className="form-label" htmlFor="expense-notes">
                    Notes
                  </label>
                  <textarea
                    id="expense-notes"
                    className={`form-input form-textarea ${errors.notes ? 'error' : ''}`}
                    placeholder="Add any additional notes..."
                    rows={3}
                    {...register('notes')}
                  />
                  {errors.notes && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={12} />
                      {errors.notes.message}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check size={16} />
                  {isEditing ? 'Update Expense' : 'Add Expense'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
