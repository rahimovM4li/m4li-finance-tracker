import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { IncomeList } from '@/components/IncomeList';
import { ExpenseList } from '@/components/ExpenseList';
import { StatisticsView } from '@/components/StatisticsView';
import { WelcomeModal } from '@/components/WelcomeModal';
import { GreetingBanner } from '@/components/GreetingBanner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Income, Expense } from '@/types/finance';
import { LayoutDashboard, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();
  const [incomes, setIncomes] = useLocalStorage<Income[]>('incomes', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [userName, setUserName] = useLocalStorage<string>('userName', '');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!userName) {
      setShowWelcome(true);
    }
  }, [userName]);

  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
    setShowWelcome(false);
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpenses;

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

  return (
    <div className="min-h-screen bg-background">
      <WelcomeModal open={showWelcome} onComplete={handleWelcomeComplete} />
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        {userName && <GreetingBanner userName={userName} balance={balance} />}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 glass-effect">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('income')}</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">{t('expenses')}</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('statistics')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard incomes={incomes} expenses={expenses} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeList
                incomes={incomes}
                onAddIncome={handleAddIncome}
                onDeleteIncome={handleDeleteIncome}
              />
              <ExpenseList
                expenses={expenses}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          </TabsContent>

          <TabsContent value="income">
            <IncomeList
              incomes={incomes}
              onAddIncome={handleAddIncome}
              onDeleteIncome={handleDeleteIncome}
            />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseList
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsView incomes={incomes} expenses={expenses} />
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
};

export default Index;
