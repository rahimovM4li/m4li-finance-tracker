import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { IncomeList } from '@/components/IncomeList';
import { InstallPrompt } from '@/components/InstallPrompt';
import { ExpenseList } from '@/components/ExpenseList';
import { StatisticsView } from '@/components/StatisticsView';
import { WelcomeModal } from '@/components/WelcomeModal';
import { GreetingBanner } from '@/components/GreetingBanner';
import { MonthSelector } from '@/components/MonthSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Income, Expense, RecurringTransaction } from '@/types/finance';
import { LayoutDashboard, TrendingUp, TrendingDown, BarChart3, Repeat, AlertCircle } from 'lucide-react';
import { format, isSameMonth } from 'date-fns';
import { getUpcomingRecurringTransactions } from '@/utils/recurringTransactions';
import { calculatePreviousBalance, calculateCurrentMonthBalance } from '@/utils/balanceCalculations';

const Index = ({ onOpenPINSetup }: { onOpenPINSetup?: () => void }) => {
  const { t } = useLanguage();
  const [incomes, setIncomes] = useLocalStorage<Income[]>('incomes', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage<RecurringTransaction[]>('recurringTransactions', []);
  const [userName, setUserName, isUserNameLoaded] = useLocalStorage<string>('userName', '');
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    // Only show welcome modal after data has loaded from localStorage
    if (isUserNameLoaded && !userName) {
      setShowWelcome(true);
    }
  }, [userName, isUserNameLoaded]);

  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
    setShowWelcome(false);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCurrentMonth = isSameMonth(selectedMonth, today);

  // Calculate previous balance from all months before selected month
  const previousBalance = useMemo(() => {
    return calculatePreviousBalance(incomes, expenses, recurringTransactions, selectedMonth);
  }, [incomes, expenses, recurringTransactions, selectedMonth]);

  // Calculate current month balance (inkl. recurring transactions)
  const currentMonthData = useMemo(() => {
    return calculateCurrentMonthBalance(
      incomes,
      expenses,
      recurringTransactions,
      selectedMonth
    );
  }, [incomes, expenses, recurringTransactions, selectedMonth]);

  // Total balance includes carry-over from previous months
  const totalBalance = previousBalance + currentMonthData.balance;

  // Get upcoming recurring transactions (nur für aktuellen Monat relevant)
  const upcomingRecurring = useMemo(() => {
    return getUpcomingRecurringTransactions(recurringTransactions, 7);
  }, [recurringTransactions]);

  const activeRecurringCount = recurringTransactions.filter(t => !t.isPaused).length;

  const handleAddIncome = (income: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...income,
      id: crypto.randomUUID(),
    };
    setIncomes([...incomes, newIncome]);
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleAddRecurring = (transaction: Omit<RecurringTransaction, 'id'>) => {
    const newTransaction: RecurringTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setRecurringTransactions([...recurringTransactions, newTransaction]);
  };

  const handleUpdateRecurring = (id: string, updates: Partial<RecurringTransaction>) => {
    setRecurringTransactions(
      recurringTransactions.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const handleDeleteRecurring = (id: string) => {
    setRecurringTransactions(recurringTransactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <WelcomeModal open={showWelcome} onComplete={handleWelcomeComplete} />
      <Header onOpenPINSetup={onOpenPINSetup} />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        {userName && <GreetingBanner userName={userName} balance={totalBalance} />}
        
        <div className="mb-6">
          <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        </div>

        {/* Recurring Summary - nur für aktuellen Monat */}
        {activeRecurringCount > 0 && isCurrentMonth && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Repeat className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activeRecurringCount} {t('recurringActive')}
                  </p>
                  {upcomingRecurring.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {upcomingRecurring.slice(0, 3).map((item) => (
                        <p key={item.id} className="text-xs text-muted-foreground flex items-center gap-2">
                          <AlertCircle className="h-3 w-3" />
                          {t('nextPayment')}: {item.type === 'income' ? (item.source || t('income')) : (item.name || t('expense'))} - {t('dueIn')} {item.daysUntil} {t('days')}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Empty State for filtered month */}
        {currentMonthData.incomes.length === 0 && currentMonthData.expenses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{t('noTransactionsThisMonth')}</p>
            </Card>
          </motion.div>
        )}
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 sm:mb-8 glass-effect h-auto shadow-soft">
            <TabsTrigger value="dashboard" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 min-h-[44px] data-[state=active]:shadow-glow transition-all">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{t('dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 min-h-[44px] data-[state=active]:shadow-glow transition-all">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{t('income')}</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 min-h-[44px] data-[state=active]:shadow-glow transition-all">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{t('expenses')}</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 min-h-[44px] data-[state=active]:shadow-glow transition-all">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{t('statistics')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard 
              incomes={currentMonthData.incomes} 
              expenses={currentMonthData.expenses}
              previousBalance={previousBalance}
              totalBalance={totalBalance}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <IncomeList
                incomes={currentMonthData.incomes}
                onAddIncome={handleAddIncome}
                onDeleteIncome={handleDeleteIncome}
                recurringTransactions={recurringTransactions}
                onAddRecurring={handleAddRecurring}
                onUpdateRecurring={handleUpdateRecurring}
                onDeleteRecurring={handleDeleteRecurring}
              />
              <ExpenseList
                expenses={currentMonthData.expenses}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
                recurringTransactions={recurringTransactions}
                onAddRecurring={handleAddRecurring}
                onUpdateRecurring={handleUpdateRecurring}
                onDeleteRecurring={handleDeleteRecurring}
              />
            </div>
          </TabsContent>

          <TabsContent value="income">
            <IncomeList
              incomes={currentMonthData.incomes}
              onAddIncome={handleAddIncome}
              onDeleteIncome={handleDeleteIncome}
              recurringTransactions={recurringTransactions}
              onAddRecurring={handleAddRecurring}
              onUpdateRecurring={handleUpdateRecurring}
              onDeleteRecurring={handleDeleteRecurring}
            />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseList
              expenses={currentMonthData.expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              recurringTransactions={recurringTransactions}
              onAddRecurring={handleAddRecurring}
              onUpdateRecurring={handleUpdateRecurring}
              onDeleteRecurring={handleDeleteRecurring}
            />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsView 
              incomes={incomes} 
              expenses={expenses}  
              selectedMonth={selectedMonth}
            />
          </TabsContent>
        </Tabs>
      </motion.main>
      
      <InstallPrompt />
    </div>
  );
};

export default Index;