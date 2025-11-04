import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';
import { MonthSelector } from '@/components/MonthSelector';
import { SavingsGoal } from '@/components/SavingGoal';
import { ExportDialog } from '@/components/ExportDialog';
import { NotificationSettings } from '@/components/NotificationSettings';
import { NotificationAlert } from '@/components/NotificationAlert';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { checkBudgetAlerts, NotificationMessage } from '@/utils/notifications';
import { NotificationConfig } from '@/components/NotificationSettings';

const EXPENSE_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];

export default function Insights() {
  const { t, language } = useLanguage();
  const { formatAmount } = useCurrency();
  const [incomes, setIncomes] = useLocalStorage<Income[]>('incomes', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedMonth, setSelectedMonth] = useLocalStorage('insightsSelectedMonth', startOfMonth(new Date()).toISOString());
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [notificationConfig] = useLocalStorage<NotificationConfig>('notificationConfig', {
    enabled: false,
    dailyBudget: true,
    budgetExceeded: true,
    recurringReminders: true,
    savingsNudges: true,
    notificationTime: '09:00'
  });

  const selectedDate = new Date(selectedMonth);
  const currentMonthStart = startOfMonth(selectedDate);
  const currentMonthEnd = endOfMonth(selectedDate);
  const lastMonthStart = startOfMonth(subMonths(selectedDate, 1));
  const lastMonthEnd = endOfMonth(subMonths(selectedDate, 1));

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

  // Daily expense heatmap with proper calendar alignment
  const dailyExpenses = useMemo(() => {
    const firstDayOfMonth = currentMonthStart.getDay(); // 0 = Sunday, 6 = Saturday
    const emptyCells = Array(firstDayOfMonth).fill(null);
    
    const filledCells = daysInMonth.map((day) => {
      const dayExpenses = currentMonthExpenses.filter((e) => isSameDay(new Date(e.date), day));
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        date: day,
        total,
        expenses: dayExpenses,
      };
    });
    
    return [...emptyCells, ...filledCells];
  }, [daysInMonth, currentMonthExpenses, currentMonthStart]);

  const maxDailyExpense = Math.max(...dailyExpenses.filter(d => d !== null).map((d) => d.total), 1);

  const getHeatmapColor = (amount: number) => {
    const intensity = amount / maxDailyExpense;
    if (intensity === 0) return 'bg-muted/20';
    if (intensity < 0.25) return 'bg-expense/20';
    if (intensity < 0.5) return 'bg-expense/40';
    if (intensity < 0.75) return 'bg-expense/60';
    return 'bg-expense/80';
  };

  // Check for budget alerts
  useEffect(() => {
    if (notificationConfig.enabled && notificationConfig.budgetExceeded) {
      const alert = checkBudgetAlerts(currentExpense, currentIncome, language as 'en' | 'ru' | 'tg');
      if (alert) {
        setNotification(alert);
      }
    }
  }, [currentExpense, currentIncome, notificationConfig, language]);

  const handleImport = (data: { incomes: Income[]; expenses: Expense[] }) => {
    setIncomes([...incomes, ...data.incomes]);
    setExpenses([...expenses, ...data.expenses]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NotificationAlert notification={notification} onDismiss={() => setNotification(null)} />
      <main className="container mx-auto px-4 py-4 md:py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Page Title, Month Selector & Actions */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{t('insights')}</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  {t('showingInsightsFor')} {format(selectedDate, 'MMMM yyyy')} 📅
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ExportDialog
                  month={selectedDate}
                  incomes={currentMonthIncomes}
                  expenses={currentMonthExpenses}
                  onImport={handleImport}
                />
                <NotificationSettings />
                <Button
                  variant="outline"
                  onClick={() => setShowComparison(!showComparison)}
                  className="gap-2"
                  size="sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden md:inline text-xs md:text-sm">
                    {showComparison ? t('hideComparison') : t('compareWithLastMonth')}
                  </span>
                </Button>
              </div>
            </div>
            
            <MonthSelector
              selectedMonth={selectedDate}
              onMonthChange={(date) => setSelectedMonth(date.toISOString())}
            />
          </div>

          {/* Savings Goal Card */}
          <SavingsGoal currentSavings={currentSavings} />

          {/* Monthly Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Total Income */}
            <Card className="overflow-hidden hover:shadow-medium transition-shadow">
              <CardHeader className="pb-3 p-4 md:p-6">
                <CardDescription className="text-xs md:text-sm">{t('totalIncome')}</CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-bold text-income">
                  <AnimatedCounter value={currentIncome} />
                </CardTitle>
                {showComparison && (
                  <div className={`flex items-center gap-1 text-sm ${incomeChange >= 0 ? 'text-income' : 'text-expense'}`}>
                    {incomeChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>{Math.abs(incomeChange).toFixed(1)}% {t('vsLastMonth')}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pb-2 p-4 md:p-6 pt-0">
                <ResponsiveContainer width="100%" height={50}>
                  <LineChart data={incomeSparkline}>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--income))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Total Expenses */}
            <Card className="overflow-hidden hover:shadow-medium transition-shadow">
              <CardHeader className="pb-3 p-4 md:p-6">
                <CardDescription className="text-xs md:text-sm">{t('totalExpenses')}</CardDescription>
                <CardTitle className="text-2xl md:text-3xl font-bold text-expense">
                  <AnimatedCounter value={currentExpense} />
                </CardTitle>
                {showComparison && (
                  <div className={`flex items-center gap-1 text-sm ${expenseChange >= 0 ? 'text-expense' : 'text-income'}`}>
                    {expenseChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>{Math.abs(expenseChange).toFixed(1)}% {t('vsLastMonth')}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pb-2 p-4 md:p-6 pt-0">
                <ResponsiveContainer width="100%" height={50}>
                  <LineChart data={expenseSparkline}>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--expense))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Net Savings */}
            <Card className="overflow-hidden hover:shadow-medium transition-shadow">
              <CardHeader className="pb-3 p-4 md:p-6">
                <CardDescription className="text-xs md:text-sm">{t('netSavings')}</CardDescription>
                <CardTitle className={`text-2xl md:text-3xl font-bold ${currentSavings >= 0 ? 'text-income' : 'text-expense'}`}>
                  <AnimatedCounter value={currentSavings} showSign />
                </CardTitle>
                {showComparison && (
                  <div className={`flex items-center gap-1 text-sm ${savingsChange >= 0 ? 'text-income' : 'text-expense'}`}>
                    {savingsChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>{Math.abs(savingsChange).toFixed(1)}% {t('vsLastMonth')}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pb-2 p-4 md:p-6 pt-0">
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
          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                {t('dailyExpenseCalendar')}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">{t('dailyExpenseDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-[10px] md:text-xs text-center font-medium text-muted-foreground py-1 md:py-2">
                    <span className="hidden md:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
                    <span className="md:hidden">{day}</span>
                  </div>
                ))}
                {dailyExpenses.map((day, index) => {
                  // Empty cells for alignment
                  if (day === null) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }
                  
                  return (
                    <Popover key={index}>
                      <PopoverTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`aspect-square rounded ${getHeatmapColor(day.total)} border border-border flex items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 active:ring-2 active:ring-primary`}
                        >
                          <div className="text-center">
                            <div className="text-[10px] md:text-xs font-semibold">{format(day.date, 'd')}</div>
                            {day.total > 0 && (
                              <div className="hidden md:block text-[8px] md:text-[10px] font-medium truncate px-0.5">
                                {formatAmount(day.total)}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </PopoverTrigger>
                      <PopoverContent className="bg-card border z-50 w-64 p-3" side="top" align="center">
                        <div className="space-y-2">
                          <p className="font-semibold text-sm">{format(day.date, 'MMM d, yyyy')}</p>
                          <p className="text-sm">{t('totalExpenses')}: <span className="font-bold text-expense">{formatAmount(day.total)}</span></p>
                          {day.expenses.length > 0 && (
                            <div className="text-xs space-y-1 mt-2 border-t pt-2">
                              <p className="font-medium text-muted-foreground mb-1">Transactions:</p>
                              {day.expenses.map((exp) => (
                                <div key={exp.id} className="flex justify-between gap-3 py-0.5">
                                  <span className="truncate">{exp.name}</span>
                                  <span className="font-medium text-expense whitespace-nowrap">{formatAmount(exp.amount)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {day.expenses.length === 0 && (
                            <p className="text-xs text-muted-foreground italic">No expenses on this day</p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">{t('spendingByCategory')}</CardTitle>
              <CardDescription className="text-xs md:text-sm">{t('categoryBreakdown')}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Pie Chart */}
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
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

                {/* Bar Chart */}
                <div>
                  <ResponsiveContainer width="100%" height={250}>
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
