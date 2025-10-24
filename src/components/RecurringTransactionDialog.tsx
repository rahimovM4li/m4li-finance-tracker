import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RecurringTransaction, ExpenseCategory } from '@/types/finance';
import { useLanguage } from '@/contexts/LanguageContext';
import { Repeat, Pause, Play, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface RecurringTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  onUpdate?: (id: string, transaction: Partial<RecurringTransaction>) => void;
  onDelete?: (id: string) => void;
  transaction?: RecurringTransaction;
  type: 'income' | 'expense';
}

export function RecurringTransactionDialog({
  open,
  onOpenChange,
  onSave,
  onUpdate,
  onDelete,
  transaction,
  type,
}: RecurringTransactionDialogProps) {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<Omit<RecurringTransaction, 'id'>>(() => ({
    type,
    amount: transaction?.amount || 0,
    frequency: transaction?.frequency || 'monthly',
    startDate: transaction?.startDate || format(new Date(), 'yyyy-MM-dd'),
    endDate: transaction?.endDate || '',
    isPaused: transaction?.isPaused || false,
    source: transaction?.source || 'mainJob',
    name: transaction?.name || '',
    category: transaction?.category || 'other',
    description: transaction?.description || '',
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transaction && onUpdate) {
      onUpdate(transaction.id, formData);
    } else {
      onSave(formData);
    }
    onOpenChange(false);
  };

  const handleTogglePause = () => {
    if (transaction && onUpdate) {
      onUpdate(transaction.id, { isPaused: !transaction.isPaused });
    }
  };

  const handleDelete = () => {
    if (transaction && onDelete) {
      onDelete(transaction.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            {transaction ? t('editRecurring') : t('addRecurring')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'income' ? (
            <div className="space-y-2">
              <Label htmlFor="source">{t('incomeSource')}</Label>
              <Select
                value={formData.source}
                onValueChange={(value: any) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mainJob">{t('mainJob')}</SelectItem>
                  <SelectItem value="sideJob">{t('sideJob')}</SelectItem>
                  <SelectItem value="other">{t('other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">{t('expenseName')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('category')}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ExpenseCategory) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">{t('food')}</SelectItem>
                    <SelectItem value="transport">{t('transport')}</SelectItem>
                    <SelectItem value="housing">{t('housing')}</SelectItem>
                    <SelectItem value="entertainment">{t('entertainment')}</SelectItem>
                    <SelectItem value="healthcare">{t('healthcare')}</SelectItem>
                    <SelectItem value="shopping">{t('shopping')}</SelectItem>
                    <SelectItem value="utilities">{t('utilities')}</SelectItem>
                    <SelectItem value="education">{t('education')}</SelectItem>
                    <SelectItem value="other">{t('other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">{t('amount')}</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">{t('frequency')}</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">{t('weekly')}</SelectItem>
                <SelectItem value="monthly">{t('monthly')}</SelectItem>
                <SelectItem value="yearly">{t('yearly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">{t('startDate')}</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">{t('endDate')} ({t('optional')})</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('description')} ({t('optional')})</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {t('save')}
            </Button>
            {transaction && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleTogglePause}
                >
                  {transaction.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}