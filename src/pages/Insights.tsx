import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Income, Expense } from '@/types/finance';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const EXPENSE_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];

export default function Insights() {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  const [incomes] = useLocalStorage<Income[]>('incomes', []);
  const [expenses] = useLocalStorage<Expense[]>('expenses', []);
  const [showComparison, setShowComparison] = useState(false);

  const currentDate = new Date();
  const currentMonthStart = startOfMonth(currentDate);
  const currentMonthEnd = endOfMonth(currentDate);
  const lastMonthStart = startOfMonth(subMonths(currentDate, 1));
  const lastMonthEnd = endOfMonth(subMonths(currentDate, 1));

  // Filter data for current and last month
  const currentMonthIncomes = incomes.filter(
    (i) => new Date(i.date) >= currentMonthStart && new Date(i.date) <= currentMonthEnd
  );
  const currentMonthExpenses = expenses.filter(
    (e) => new Date(e.date) >= currentMonthStart && new Date(e.date) <= currentMonthEnd
  );
  const lastMonthIncomes = incomes.filter(
    (i) => new Date(i.date) >= lastMonthStart && new Date(i.date) <= lastMonthEnd
  );
  const lastMonthExpenses = expenses.filter(
    (e) => new Date(e.date) >= lastMonthStart && new Date(e.date) <= lastMonthEnd
  );

  // Calculate totals
  const currentIncome = currentMonthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const currentExpense = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const currentSavings = currentIncome - currentExpense;
  const lastIncome = lastMonthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const lastExpense = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastSavings = lastIncome - lastExpense;

  // Calculate changes
  const incomeChange = lastIncome ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;
  const expenseChange = lastExpense ? ((currentExpense - lastExpense) / lastExpense) * 100 : 0;
  const savingsChange = lastSavings ? ((currentSavings - lastSavings) / Math.abs(lastSavings)) * 100 : 0;

  // Sparkline data (daily totals for current month)
  const daysInMonth = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });
  const incomeSparkline = daysInMonth.map((day) => ({
    date: format(day, 'MMM d'),
    value: currentMonthIncomes
      .filter((i) => isSameDay(new Date(i.date), day))
      .reduce((sum, i) => sum + i.amount, 0),
  }));
  const expenseSparkline = daysInMonth.map((day) => ({
    date: format(day, 'MMM d'),
    value: currentMonthExpenses
      .filter((e) => isSameDay(new Date(e.date), day))
      .reduce((sum, e) => sum + e.amount, 0),
  }));
  const savingsSparkline = daysInMonth.map((day) => {
    const dayIncome = currentMonthIncomes
      .filter((i) => isSameDay(new Date(i.date), day))
      .reduce((sum, i) => sum + i.amount, 0);
    const dayExpense = currentMonthExpenses
      .filter((e) => isSameDay(new Date(e.date), day))
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      date: format(day, 'MMM d'),
      value: dayIncome - dayExpense,
    };
  });

  // Category breakdown
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    currentMonthExpenses.forEach((expense) => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({
      name: t(name),
      value,
    }));
  }, [currentMonthExpenses, t]);

  // Daily expense heatmap
  const dailyExpenses = useMemo(() => {
    return daysInMonth.map((day) => {
      const dayExpenses = currentMonthExpenses.filter((e) => isSameDay(new Date(e.date), day));
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        date: day,
        total,
        expenses: dayExpenses,
      };
    });
  }, [daysInMonth, currentMonthExpenses]);

  const maxDailyExpense = Math.max(...dailyExpenses.map((d) => d.total), 1);

  const getHeatmapColor = (amount: number) => {
    const intensity = amount / maxDailyExpense;
    if (intensity === 0) return 'bg-muted/20';
    if (intensity < 0.25) return 'bg-expense/20';
    if (intensity < 0.5) return 'bg-expense/40';
    if (intensity < 0.75) return 'bg-expense/60';
    return 'bg-expense/80';
  };

  // Daily Expense Heatmap (berechnet aktuelle Wochentage korrekt)
const firstDayOfMonth = currentMonthStart.getDay(); // 0 = Sunday, 1 = Monday...
const paddedDailyExpenses = [
  ...Array(firstDayOfMonth).fill(null), // leere Tage für die Verschiebung
  ...dailyExpenses,
];

  return (
 <div className="min-h-screen bg-background">
  <Header />
  <main className="container mx-auto px-4 py-6 sm:py-8">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-8">

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t('insights')}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t('insightsDescription')}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowComparison(!showComparison)}
          className="gap-2 w-full sm:w-auto"
        >
          <TrendingUp className="h-4 w-4" />
          {showComparison ? t('hideComparison') : t('compareWithLastMonth')}
        </Button>
      </div>

      {/* Monthly Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Income Card */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">{t('totalIncome')}</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-income">
              <AnimatedCounter value={currentIncome} />
            </CardTitle>
            {showComparison && (
              <div className={`flex items-center gap-1 text-xs sm:text-sm ${incomeChange >= 0 ? 'text-income' : 'text-expense'}`}>
                {incomeChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{Math.abs(incomeChange).toFixed(1)}% {t('vsLastMonth')}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="pb-2">
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={incomeSparkline}>
                <Line type="monotone" dataKey="value" stroke="hsl(var(--income))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">{t('totalExpenses')}</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-expense">
              <AnimatedCounter value={currentExpense} />
            </CardTitle>
            {showComparison && (
              <div className={`flex items-center gap-1 text-xs sm:text-sm ${expenseChange >= 0 ? 'text-expense' : 'text-income'}`}>
                {expenseChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{Math.abs(expenseChange).toFixed(1)}% {t('vsLastMonth')}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="pb-2">
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={expenseSparkline}>
                <Line type="monotone" dataKey="value" stroke="hsl(var(--expense))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Net Savings Card */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">{t('netSavings')}</CardDescription>
            <CardTitle className={`text-2xl sm:text-3xl font-bold ${currentSavings >= 0 ? 'text-income' : 'text-expense'}`}>
              <AnimatedCounter value={currentSavings} showSign />
            </CardTitle>
            {showComparison && (
              <div className={`flex items-center gap-1 text-xs sm:text-sm ${savingsChange >= 0 ? 'text-income' : 'text-expense'}`}>
                {savingsChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{Math.abs(savingsChange).toFixed(1)}% {t('vsLastMonth')}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="pb-2">
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={savingsSparkline}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={currentSavings >= 0 ? 'hsl(var(--income))' : 'hsl(var(--expense))'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Expense Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('dailyExpenseCalendar')}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t('dailyExpenseDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
  <div className="grid grid-cols-7 gap-1 sm:gap-2">
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
      <div key={day} className="text-[8px] sm:text-xs text-center font-medium text-muted-foreground py-1 sm:py-2">
        {day}
      </div>
    ))}

    {paddedDailyExpenses.map((day, index) => {
      if (!day) return <div key={index} />; // leeres Feld für Verschiebung

      return (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`aspect-square rounded-md ${getHeatmapColor(day.total)} border border-border flex items-center justify-center cursor-pointer transition-all`}
              >
                <div className="text-center">
                  <div className="text-[8px] sm:text-xs font-semibold">{format(day.date, 'd')}</div>
                  {day.total > 0 && (
                    <div className="text-[8px] sm:text-[10px] font-medium">{formatAmount(day.total)}</div>
                  )}
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent className="bg-card border z-50 text-xs sm:text-sm">
              <div className="space-y-1">
                <p className="font-semibold">{format(day.date, 'MMM d, yyyy')}</p>
                <p>{t('totalExpenses')}: {formatAmount(day.total)}</p>
                {day.expenses.length > 0 && (
                  <div className="text-[8px] sm:text-xs space-y-0.5 mt-1 sm:mt-2 border-t pt-1">
                    {day.expenses.map((exp) => (
                      <div key={exp.id} className="flex justify-between gap-2 sm:gap-4">
                        <span>{exp.name}</span>
                        <span className="font-medium">{formatAmount(exp.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    })}
  </div>
</CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">{t('spendingByCategory')}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">{t('categoryBreakdown')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => formatAmount(value)}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData} layout="vertical">
                  <RechartsTooltip
                    formatter={(value: number) => formatAmount(value)}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </main>
</div>
  );
}