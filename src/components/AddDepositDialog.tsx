import { useState } from 'react';
import { PiggyBank } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddDepositDialogProps {
  goalTitle: string;
  onAddDeposit: (amount: number, note?: string) => void;
}

export function AddDepositDialog({ goalTitle, onAddDeposit }: AddDepositDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      onAddDeposit(depositAmount, note || undefined);
      setAmount('');
      setNote('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <PiggyBank className="h-4 w-4" />
          {t('addDeposit')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addDepositTo')} {goalTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="depositAmount">{t('amount')}</Label>
            <Input
              id="depositAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">{t('note')} ({t('optional')})</Label>
            <Textarea
              id="note"
              placeholder={t('depositNotePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!amount}>
            {t('addDeposit')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}