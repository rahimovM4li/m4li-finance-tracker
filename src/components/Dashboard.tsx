import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Income, Expense } from '@/types/finance';
import { Card } from './ui/card';
import { AnimatedCounter } from './AnimatedCounter';

interface DashboardProps {
  incomes: Income[];
  expenses: Expense[];
}

export function Dashboard({ incomes, expenses }: DashboardProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpenses;

  const stats = [
    {
      label: t('totalIncome'),
      value: totalIncome,
      icon: TrendingUp,
      gradient: 'gradient-income',
      color: 'text-income',
    },
    {
      label: t('totalExpenses'),
      value: totalExpenses,
      icon: TrendingDown,
      gradient: 'gradient-expense',
      color: 'text-expense',
    },
    {
      label: t('remainingBalance'),
      value: balance,
      icon: balance >= 0 ? PiggyBank : Wallet,
      gradient: balance >= 0 ? 'gradient-income' : 'gradient-expense',
      color: balance >= 0 ? 'text-income' : 'text-expense',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="p-6 relative overflow-hidden group hover:shadow-medium transition-all duration-300">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    <AnimatedCounter 
                      value={stat.value} 
                      formatValue={(val) => formatAmount(val)} 
                    />
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-xl ${stat.gradient} flex items-center justify-center shadow-glow`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </motion.div>
              </div>
              <motion.div
                className={`absolute inset-0 ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
