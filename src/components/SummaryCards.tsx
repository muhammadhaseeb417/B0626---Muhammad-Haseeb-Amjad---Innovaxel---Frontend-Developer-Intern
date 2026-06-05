import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Tag,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';
import {
  calculateTotal,
  getCurrentMonthExpenses,
  getPreviousMonthExpenses,
  getHighestCategory,
} from '../services/expenseService';
import { formatCurrency, calculateTrend } from '../utils';

/**
 * Dashboard summary cards with animated counters and trend indicators.
 * Displays: Total Expenses, Monthly Spending, Highest Category, Transaction Count.
 */
export function SummaryCards() {
  const expenses = useExpenseStore((s) => s.expenses);

  const totalExpenses = calculateTotal(expenses);
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const previousMonthExpenses = getPreviousMonthExpenses(expenses);
  const currentMonthTotal = calculateTotal(currentMonthExpenses);
  const previousMonthTotal = calculateTotal(previousMonthExpenses);
  const monthlyTrend = calculateTrend(currentMonthTotal, previousMonthTotal);
  const highestCategory = getHighestCategory(currentMonthExpenses);

  const cards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      trend: 0,
      trendLabel: 'all time',
      icon: DollarSign,
      color: '#4F46E5',
      bgColor: 'rgba(79, 70, 229, 0.1)',
      accentGradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    },
    {
      title: 'Monthly Spending',
      value: formatCurrency(currentMonthTotal),
      trend: monthlyTrend,
      trendLabel: 'vs last month',
      icon: TrendingUp,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      accentGradient: 'linear-gradient(135deg, #10B981, #14B8A6)',
    },
    {
      title: 'Top Category',
      value: highestCategory ? highestCategory.category : 'N/A',
      trend: 0,
      trendLabel: highestCategory
        ? formatCurrency(highestCategory.amount)
        : 'No data',
      icon: Tag,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      accentGradient: 'linear-gradient(135deg, #F59E0B, #F97316)',
    },
    {
      title: 'Transactions',
      value: expenses.length.toString(),
      trend: currentMonthExpenses.length,
      trendLabel: 'this month',
      icon: Receipt,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      accentGradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  const getTrendIcon = (trend: number, index: number) => {
    if (index === 0 || index === 3) return null; // No trend for total & count
    if (trend > 0) return <ArrowUpRight size={14} />;
    if (trend < 0) return <ArrowDownRight size={14} />;
    return <Minus size={14} />;
  };

  const getTrendClass = (trend: number, index: number) => {
    if (index === 0) return 'trend-neutral';
    if (index === 3) return 'trend-neutral';
    // For spending, "up" is actually more spending (could be seen as negative)
    if (trend > 0) return 'trend-up';
    if (trend < 0) return 'trend-down';
    return 'trend-neutral';
  };

  return (
    <motion.div
      className="summary-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            className="summary-card"
            variants={cardVariants}
            whileHover={{ y: -4, boxShadow: '0 12px 24px -4px rgba(0,0,0,0.1)' }}
            style={{
              // @ts-expect-error CSS custom property
              '--card-accent': card.accentGradient,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: card.accentGradient,
                borderRadius: '16px 16px 0 0',
              }}
            />
            <div className="summary-card-header">
              <div
                className="summary-card-icon"
                style={{
                  background: card.bgColor,
                  color: card.color,
                }}
              >
                <Icon size={22} />
              </div>
              {(index === 1 || index === 2) && (
                <div className={`summary-card-trend ${getTrendClass(card.trend, index)}`}>
                  {getTrendIcon(card.trend, index)}
                  <span>
                    {index === 1 ? `${Math.abs(card.trend)}%` : card.trendLabel}
                  </span>
                </div>
              )}
            </div>
            <div className="summary-card-value">{card.value}</div>
            <div className="summary-card-label">
              {index === 3
                ? `${card.trend} this month`
                : card.title}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
