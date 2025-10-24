import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AddSavingsGoalDialogProps {
  onAddGoal: (title: string, targetAmount: number, deadline?: string) => void;
}

export function AddSavingsGoalDialog({ onAddGoal }: AddSavingsGoalDialogProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (title.trim() && amount > 0) {
      onAddGoal(title, amount, deadline || undefined);
      setTitle('');
      setTargetAmount('');
      setDeadline('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-glow">
          <Plus className="h-5 w-5" />
          {t('newGoal')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('createSavingsGoal')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('goalTitle')}</Label>
            <Input
              id="title"
              placeholder={t('goalTitlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{t('targetAmount')}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">{t('deadline')} ({t('optional')})</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!title.trim() || !targetAmount}>
            {t('createGoal')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}