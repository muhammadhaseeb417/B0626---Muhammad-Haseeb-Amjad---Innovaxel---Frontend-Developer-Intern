import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useExpenseStore } from '../store/useExpenseStore';
import { getMonthlySpending } from '../services/expenseService';
import { formatCurrency } from '../utils';

/**
 * Monthly spending bar chart with custom gradient bars and tooltip.
 */
export function MonthlyChart() {
  const expenses = useExpenseStore((s) => s.expenses);
  const data = getMonthlySpending(expenses);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '13px',
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: '4px',
              color: 'var(--color-text-secondary)',
            }}
          >
            {label}
          </div>
          <div style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            {formatCurrency(payload[0].value)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="chart-card-title">Monthly Spending</div>
      <div className="chart-card-subtitle">Last 6 months overview</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} maxBarSize={40} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity={1} />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-border-light)"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: 'var(--color-text-tertiary)',
              fontSize: 12,
              fontWeight: 500,
            }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: 'var(--color-text-tertiary)',
              fontSize: 12,
            }}
            tickFormatter={(value) => `$${value}`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.04)' }} />
          <Bar
            dataKey="amount"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
            animationBegin={300}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
