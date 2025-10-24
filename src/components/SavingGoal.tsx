import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SavingsGoalProps {
  currentSavings: number;
}

const motivationalMessages = {
  overachieved: [
    "You actually saved money?! Unbelievable 😱",
    "Look at you go! Bill Gates is shaking 🤑",
    "If you keep this up, you'll buy that Tesla in 2089 🚗😂",
    "Warren Buffett just sent you a friend request 💰",
    "Plot twist: You're good with money! 🎭",
  ],
  onTrack: [
    "Another dollar in the vault 💰 Keep going!",
    "You're doing great, sweetie! 📈",
    "Slow and steady wins the race 🐢💨",
    "Rome wasn't built in a day, but your savings are! 🏛️",
    "Keep stacking those coins! 🪙",
  ],
  struggling: [
    "Bro… your wallet just cried 💸",
    "Stop buying coffee ☕, invest in yourself instead!",
    "Netflix: $15. Financial peace: Priceless 🎬",
    "Those impulse buys are adding up 🛒😅",
    "Your future self is judging you right now 👀",
  ],
  wayOff: [
    "Houston, we have a problem 🚀",
    "Maybe skip the avocado toast this month? 🥑",
    "Your bank account called, it's lonely in there 📞",
    "Time to activate beast mode! 💪",
    "Remember: budget is not a dirty word 📊",
  ],
};

export function SavingsGoal({ currentSavings }: SavingsGoalProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  const [goal, setGoal] = useLocalStorage('savingsGoal', 0);
  const [isEditing, setIsEditing] = useState(!goal);
  const [inputValue, setInputValue] = useState(goal.toString());

  const progress = goal > 0 ? Math.min((currentSavings / goal) * 100, 100) : 0;
  const remaining = goal - currentSavings;

  const getMessage = () => {
    if (goal === 0) return null;
    
    if (currentSavings >= goal) {
      return motivationalMessages.overachieved[
        Math.floor(Math.random() * motivationalMessages.overachieved.length)
      ];
    } else if (progress >= 60) {
      return motivationalMessages.onTrack[
        Math.floor(Math.random() * motivationalMessages.onTrack.length)
      ];
    } else if (progress >= 30) {
      return motivationalMessages.struggling[
        Math.floor(Math.random() * motivationalMessages.struggling.length)
      ];
    } else if (currentSavings < 0) {
      return motivationalMessages.wayOff[
        Math.floor(Math.random() * motivationalMessages.wayOff.length)
      ];
    } else {
      return motivationalMessages.struggling[
        Math.floor(Math.random() * motivationalMessages.struggling.length)
      ];
    }
  };

  const handleSaveGoal = () => {
    const newGoal = parseFloat(inputValue) || 0;
    setGoal(newGoal);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="overflow-hidden border-2 border-primary/20 shadow-glow">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>{t('savingsGoal')}</CardTitle>
            </div>
            {!isEditing && goal > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                {t('edit')}
              </Button>
            )}
          </div>
          <CardDescription>
            {goal > 0 ? t('trackYourProgress') : t('setSavingsGoal')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={t('enterGoalAmount')}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="text-lg"
                />
                <Button onClick={handleSaveGoal} className="whitespace-nowrap">
                  {t('setGoal')}
                </Button>
              </div>
            </div>
          ) : goal > 0 ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('progress')}</span>
                  <span className="font-bold">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('saved')}</p>
                    <p className={`text-2xl font-bold ${currentSavings >= 0 ? 'text-income' : 'text-expense'}`}>
                      {formatAmount(Math.abs(currentSavings))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{t('goal')}</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatAmount(goal)}
                    </p>
                  </div>
                </div>
              </div>

              {remaining > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <TrendingUp className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">{formatAmount(remaining)} {t('toGo')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('keepGoing')}
                    </p>
                  </div>
                </div>
              )}

              {getMessage() && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`flex items-start gap-2 p-3 rounded-lg border ${
                    currentSavings >= goal
                      ? 'bg-income-light border-income/30'
                      : progress >= 60
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-expense-light border-expense/30'
                  }`}
                >
                  <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                    currentSavings >= goal
                      ? 'text-income'
                      : progress >= 60
                      ? 'text-primary'
                      : 'text-expense'
                  }`} />
                  <p className="text-sm font-medium">{getMessage()}</p>
                </motion.div>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}