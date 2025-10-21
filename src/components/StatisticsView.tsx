import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Income, Expense } from '@/types/finance';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { useEffect, useState } from 'react';

interface StatisticsViewProps {
  incomes: Income[];
  expenses: Expense[];
}

const COLORS = {
  income: 'hsl(142 76% 36%)',
  expense: 'hsl(38 92% 50%)',
  categories: [
    'hsl(250 60% 60%)',
    'hsl(142 76% 36%)',
    'hsl(38 92% 50%)',
    'hsl(200 80% 50%)',
    'hsl(0 84% 60%)',
    'hsl(45 100% 50%)',
    'hsl(280 70% 60%)',
    'hsl(160 60% 40%)',
  ],
};

// Hilfs-Hook, um zu prüfen, ob es sich um ein mobiles Gerät handelt
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

export function StatisticsView({ incomes, expenses }: StatisticsViewProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const comparisonData = [
    { name: t('income'), value: totalIncome, fill: COLORS.income },
    { name: t('expenses'), value: totalExpenses, fill: COLORS.expense },
  ];

  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === t(expense.category));
    if (existing) existing.value += expense.amount;
    else acc.push({ name: t(expense.category), value: expense.amount });
    return acc;
  }, [] as { name: string; value: number }[]);

  const monthlyData = [...incomes, ...expenses].reduce((acc, item) => {
    const month = new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    const existing = acc.find(d => d.month === month);
    const amount = 'source' in item ? item.amount : -item.amount;

    if (existing) {
      if (amount > 0) existing.income += amount;
      else existing.expenses += Math.abs(amount);
    } else {
      acc.push({
        month,
        income: amount > 0 ? amount : 0,
        expenses: amount < 0 ? Math.abs(amount) : 0,
      });
    }
    return acc;
  }, [] as { month: string; income: number; expenses: number }[]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const chartHeight = isMobile ? 220 : 300;
  const axisFontSize = isMobile ? 10 : 12;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Income vs Expenses */}
      <motion.div variants={itemVariants}>
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
            {t('incomeVsExpenses')}
          </h3>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={comparisonData}>
              <XAxis dataKey="name" tick={{ fontSize: axisFontSize }} />
              <YAxis tick={{ fontSize: axisFontSize }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Spending by Category */}
      {categoryData.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
              {t('spendingByCategory')}
            </h3>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={!isMobile}
                  label={
                    !isMobile
                      ? ({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                      : undefined
                  }
                  outerRadius={isMobile ? 80 : 100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS.categories[index % COLORS.categories.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {/* Monthly Trends */}
      {monthlyData.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
              {t('monthlyTrends')}
            </h3>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: axisFontSize }} />
                <YAxis tick={{ fontSize: axisFontSize }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                {!isMobile && <Legend />}
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke={COLORS.income}
                  strokeWidth={2}
                  name={t('income')}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke={COLORS.expense}
                  strokeWidth={2}
                  name={t('expenses')}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
