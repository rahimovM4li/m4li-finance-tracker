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
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { generateRecurringTransactionsForMonth, getUpcomingRecurringTransactions } from '@/utils/recurringTransactions';

const Index = ({ onOpenPINSetup }: { onOpenPINSetup?: () => void }) => {
  const { t } = useLanguage();
  const [incomes, setIncomes] = useLocalStorage<Income[]>('incomes', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage<RecurringTransaction[]>('recurringTransactions', []);
  const [userName, setUserName] = useLocalStorage<string>('userName', '');
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()));

  useEffect(() => {
    if (!userName) {
      setShowWelcome(true);
    }
  }, [userName]);

  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
    setShowWelcome(false);
  };

  // Generate recurring transactions for the selected month
  const generatedRecurringTransactions = useMemo(() => {
    return generateRecurringTransactionsForMonth(recurringTransactions, selectedMonth);
  }, [recurringTransactions, selectedMonth]);

  // Filter transactions by selected month and merge with recurring
  const filteredIncomes = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    const regularIncomes = incomes.filter(income => {
      const incomeDate = parseISO(income.date);
      return isWithinInterval(incomeDate, { start: monthStart, end: monthEnd });
    });
    
    return [...regularIncomes, ...generatedRecurringTransactions.incomes];
  }, [incomes, selectedMonth, generatedRecurringTransactions]);

  const filteredExpenses = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    const regularExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
    
    return [...regularExpenses, ...generatedRecurringTransactions.expenses];
  }, [expenses, selectedMonth, generatedRecurringTransactions]);

  // Get upcoming recurring transactions
  const upcomingRecurring = useMemo(() => {
    return getUpcomingRecurringTransactions(recurringTransactions, 7);
  }, [recurringTransactions]);


  // Current month totals
  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Cumulative balance: all transactions up to and including selected month
  const cumulativeBalance = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    
    const allIncomeUpToMonth = incomes.filter(income => {
      const incomeDate = parseISO(income.date);
      return incomeDate <= monthStart || isWithinInterval(incomeDate, { 
        start: monthStart, 
        end: endOfMonth(selectedMonth) 
      });
    });
    
    const allExpensesUpToMonth = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return expenseDate <= monthStart || isWithinInterval(expenseDate, { 
        start: monthStart, 
        end: endOfMonth(selectedMonth) 
      });
    });
    
    const totalIncomeUpToMonth = allIncomeUpToMonth.reduce((sum, income) => sum + income.amount, 0);
    const totalExpensesUpToMonth = allExpensesUpToMonth.reduce((sum, expense) => sum + expense.amount, 0);
    
    return totalIncomeUpToMonth - totalExpensesUpToMonth;
  }, [incomes, expenses, selectedMonth]);
  
  const balance = cumulativeBalance;

  console.log('Cumulative Balance up to selected month:', cumulativeBalance);

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

  const isCurrentMonth = format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

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
        {userName && <GreetingBanner userName={userName} balance={balance} />}
        
        <div className="mb-6">
          <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        </div>

        {/* Recurring Summary */}
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
        {filteredIncomes.length === 0 && filteredExpenses.length === 0 && (
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
          <TabsList className="grid w-full grid-cols-4 mb-8 glass-effect h-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3 min-h-[44px]">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2 py-3 min-h-[44px]">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('income')}</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2 py-3 min-h-[44px]">
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">{t('expenses')}</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2 py-3 min-h-[44px]">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('statistics')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard incomes={filteredIncomes} expenses={filteredExpenses} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeList
                incomes={filteredIncomes}
                onAddIncome={handleAddIncome}
                onDeleteIncome={handleDeleteIncome}
                recurringTransactions={recurringTransactions}
                onAddRecurring={handleAddRecurring}
                onUpdateRecurring={handleUpdateRecurring}
                onDeleteRecurring={handleDeleteRecurring}
              />
              <ExpenseList
                expenses={filteredExpenses}
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
              incomes={filteredIncomes}
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
              expenses={filteredExpenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              recurringTransactions={recurringTransactions}
              onAddRecurring={handleAddRecurring}
              onUpdateRecurring={handleUpdateRecurring}
              onDeleteRecurring={handleDeleteRecurring}
            />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsView incomes={incomes} expenses={expenses}  selectedMonth={selectedMonth || new Date()}/>
          </TabsContent>
        </Tabs>
      </motion.main>
      
      <InstallPrompt />
    </div>
  );
};

export default Index;