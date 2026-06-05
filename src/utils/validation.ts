import { z } from 'zod';
import type { ExpenseCategory } from '../types';
import { CATEGORY_LIST } from '../utils';

/**
 * Zod validation schema for the expense form.
 * Provides real-time validation with descriptive error messages.
 */
export const expenseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  amount: z
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be greater than zero')
    .max(1000000, 'Amount cannot exceed $1,000,000'),
  category: z
    .string()
    .min(1, 'Please select a category')
    .refine((val): val is ExpenseCategory => CATEGORY_LIST.includes(val as ExpenseCategory), {
      message: 'Please select a valid category',
    }),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Please enter a valid date',
    }),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .default(''),
});

export type ExpenseSchemaType = z.infer<typeof expenseSchema>;
