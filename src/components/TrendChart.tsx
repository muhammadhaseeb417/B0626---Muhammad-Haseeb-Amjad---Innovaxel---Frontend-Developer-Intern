import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useExpenseStore } from '../store/useExpenseStore';
import { getMonthlySpending } from '../services/expenseService';
import { formatCurrency } from '../utils';

/**
 * Spending trend area chart with smooth curves and gradient fill.
 * Shows the spending trajectory over the last 6 months.
 */
export function TrendChart() {
  const expenses = useExpenseStore((s) => s.expenses);
  const data = getMonthlySpending(expenses);

  // Calculate cumulative spending for trend
  let cumulative = 0;
  const trendData = data.map((item) => {
    cumulative += item.amount;
    return { ...item, cumulative };
  });

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
              marginBottom: '6px',
              color: 'var(--color-text-secondary)',
            }}
          >
            {label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10B981',
                }}
              />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                Monthly:
              </span>
              <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {formatCurrency(payload[0]?.value || 0)}
              </span>
            </div>
            {payload[1] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4F46E5',
                  }}
                />
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                  Cumulative:
                </span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {formatCurrency(payload[1]?.value || 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="chart-card chart-card-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <div className="chart-card-title">Spending Trend</div>
      <div className="chart-card-subtitle">
        Monthly and cumulative spending over the last 6 months
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={trendData}
          margin={{ top: 10, right: 10, bottom: 5, left: 5 }}
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
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
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#10B981"
            strokeWidth={2.5}
            fill="url(#trendGradient)"
            dot={{
              r: 4,
              fill: '#10B981',
              stroke: 'white',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: '#10B981',
              stroke: 'white',
              strokeWidth: 2,
            }}
            animationDuration={1000}
            animationBegin={400}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#4F46E5"
            strokeWidth={2}
            strokeDasharray="6 3"
            fill="url(#cumulativeGradient)"
            dot={false}
            animationDuration={1000}
            animationBegin={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
