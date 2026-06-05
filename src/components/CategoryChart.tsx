import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useExpenseStore } from '../store/useExpenseStore';
import { getCategoryBreakdown } from '../services/expenseService';
import { formatCurrency } from '../utils';

/**
 * Category breakdown pie/donut chart with custom tooltip and legend.
 */
export function CategoryChart() {
  const expenses = useExpenseStore((s) => s.expenses);
  const data = getCategoryBreakdown(expenses);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-title">Category Breakdown</div>
        <div className="chart-card-subtitle">Spending distribution by category</div>
        <div className="empty-state" style={{ padding: '40px 24px' }}>
          <div className="empty-state-title" style={{ fontSize: '14px' }}>
            No data available
          </div>
          <div className="empty-state-description" style={{ fontSize: '13px' }}>
            Add expenses to see your spending breakdown.
          </div>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
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
          <div style={{ fontWeight: 600, marginBottom: '4px', color: item.payload.color }}>
            {item.name}
          </div>
          <div style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
            {formatCurrency(item.value)}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
            {percentage}% of total
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 16px',
          justifyContent: 'center',
          marginTop: '8px',
        }}
      >
        {payload?.map((entry: any, index: number) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: entry.color,
              }}
            />
            {entry.value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="chart-card-title">Category Breakdown</div>
      <div className="chart-card-subtitle">Spending distribution by category</div>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            animationBegin={200}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} wrapperStyle={{ bottom: 0 }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
