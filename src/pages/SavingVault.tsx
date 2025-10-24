import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vault, Target, Calendar, TrendingUp, Trash2, Edit, CheckCircle, PartyPopper } from 'lucide-react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AddSavingsGoalDialog } from '@/components/AddSavingsGoalDialog';
import { AddDepositDialog } from '@/components/AddDepositDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SavingsVaultGoal } from '@/types/finance';
import { format } from 'date-fns';

const funnyCompletionMessages = [
  "You did it! Retirement at 2078 doesn't sound that bad 😂",
  "Goal achieved! Your bank account finally respects you 💰",
  "Success! Warren Buffett is taking notes 📝",
  "You're officially good with money. Universe is confused 🌌",
  "Mission accomplished! Your future self says thanks 🙏",
];

export default function SavingsVault() {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  const [goals, setGoals] = useLocalStorage<SavingsVaultGoal[]>('savingsVaultGoals', []);
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);

  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const addGoal = (title: string, targetAmount: number, deadline?: string) => {
    const newGoal: SavingsVaultGoal = {
      id: Date.now().toString(),
      title,
      targetAmount,
      currentAmount: 0,
      deadline,
      createdAt: new Date().toISOString(),
      deposits: [],
      isCompleted: false,
    };
    setGoals([...goals, newGoal]);
  };

  const addDeposit = (goalId: string, amount: number, note?: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrentAmount = goal.currentAmount + amount;
        const wasCompleted = goal.isCompleted;
        const isNowCompleted = newCurrentAmount >= goal.targetAmount;
        
        if (!wasCompleted && isNowCompleted) {
          const message = funnyCompletionMessages[Math.floor(Math.random() * funnyCompletionMessages.length)];
          setShowCompletionMessage(message);
          setTimeout(() => setShowCompletionMessage(null), 5000);
        }

        return {
          ...goal,
          currentAmount: newCurrentAmount,
          isCompleted: isNowCompleted,
          deposits: [
            ...goal.deposits,
            {
              id: Date.now().toString(),
              amount,
              date: new Date().toISOString(),
              note,
            }
          ],
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Completion Message */}
        <AnimatePresence>
          {showCompletionMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-income text-income-foreground px-6 py-4 rounded-lg shadow-glow flex items-center gap-3 max-w-md"
            >
              <PartyPopper className="h-6 w-6" />
              <span className="font-bold">{showCompletionMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Vault className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t('savingsVault')}</h1>
              <p className="text-sm md:text-base text-muted-foreground">{t('trackYourSavingsGoals')}</p>
            </div>
          </div>
          <AddSavingsGoalDialog onAddGoal={addGoal} />
        </motion.div>

        {/* Total Savings Card */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-primary/20 shadow-glow bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('totalSavings')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-income">
                  {formatAmount(totalSavings)} 🎉
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {goals.filter(g => g.isCompleted).length} {t('of')} {goals.length} {t('goalsCompleted')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <Target className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('noGoalsYet')}</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t('createFirstSavingsGoal')}
            </p>
            <AddSavingsGoalDialog onAddGoal={addGoal} />
          </motion.div>
        ) : (
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal, index) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !goal.isCompleted;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative overflow-hidden ${
                    goal.isCompleted 
                      ? 'border-2 border-income shadow-glow-success' 
                      : isOverdue 
                      ? 'border-2 border-destructive/30'
                      : 'hover:shadow-glow transition-shadow'
                  }`}>
                    {goal.isCompleted && (
                      <div className="absolute top-3 right-3 bg-income text-income-foreground p-2 rounded-full">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 pr-10">
                        <Target className="h-5 w-5 text-primary" />
                        {goal.title}
                      </CardTitle>
                      {goal.deadline && (
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                          {isOverdue && <span className="text-destructive ml-2">({t('overdue')})</span>}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('progress')}</span>
                          <span className="font-bold">{Math.min(progress, 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={Math.min(progress, 100)} className="h-3" />
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs text-muted-foreground">{t('saved')}</p>
                            <p className="text-xl font-bold text-income">
                              {formatAmount(goal.currentAmount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{t('goal')}</p>
                            <p className="text-xl font-bold text-primary">
                              {formatAmount(goal.targetAmount)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {!goal.isCompleted && remaining > 0 && (
                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <p className="text-sm font-medium">
                            {formatAmount(remaining)} {t('remaining')}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <AddDepositDialog
                          goalTitle={goal.title}
                          onAddDeposit={(amount, note) => addDeposit(goal.id, amount, note)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {goal.deposits.length > 0 && (
                        <div className="pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">
                            {t('recentDeposits')} ({goal.deposits.length})
                          </p>
                          <div className="space-y-1">
                            {goal.deposits.slice(-3).reverse().map((deposit) => (
                              <div key={deposit.id} className="flex justify-between text-xs">
                                <span>{format(new Date(deposit.date), 'MMM dd')}</span>
                                <span className="font-bold text-income">+{formatAmount(deposit.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}