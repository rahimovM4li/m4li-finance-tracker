import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase, DollarSign, Repeat } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { RecurringTransactionDialog } from './RecurringTransactionDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Income, RecurringTransaction } from '@/types/finance';

interface IncomeListProps {
  incomes: Income[];
  onAddIncome: (income: Omit<Income, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
  recurringTransactions: RecurringTransaction[];
  onAddRecurring: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  onUpdateRecurring: (id: string, updates: Partial<RecurringTransaction>) => void;
  onDeleteRecurring: (id: string) => void;
}

export function IncomeList({ 
  incomes, 
  onAddIncome, 
  onDeleteIncome,
  recurringTransactions,
  onAddRecurring,
  onUpdateRecurring,
  onDeleteRecurring,
}: IncomeListProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  const [open, setOpen] = useState(false);
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | undefined>();
  const [formData, setFormData] = useState({
    source: 'mainJob' as Income['source'],
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    onAddIncome({
      source: formData.source,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
    });

    setFormData({
      source: 'mainJob',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setOpen(false);
  };

  const handleEditRecurring = (recurring: RecurringTransaction) => {
    setEditingRecurring(recurring);
    setRecurringDialogOpen(true);
  };

  const incomeRecurring = recurringTransactions.filter(t => t.type === 'income');

  const sourceIcons = {
    mainJob: Briefcase,
    sideJob: DollarSign,
    other: DollarSign,
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">{t('income')}</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setEditingRecurring(undefined);
              setRecurringDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Repeat className="h-4 w-4" />
            <span className="sm:inline">{t('recurring')}</span>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-income">
                <Plus className="h-4 w-4 mr-2" />
                {t('addIncome')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('addIncome')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>{t('incomeSource')}</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) =>
                      setFormData({ ...formData, source: value as Income['source'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="mainJob">{t('mainJob')}</SelectItem>
                      <SelectItem value="sideJob">{t('sideJob')}</SelectItem>
                      <SelectItem value="other">{t('other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('amount')}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>{t('date')}</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>{t('description')}</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder={t('description')}
                  />
                </div>
                <Button type="submit" className="w-full gradient-income">
                  {t('save')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <RecurringTransactionDialog
        open={recurringDialogOpen}
        onOpenChange={(open) => {
          setRecurringDialogOpen(open);
          if (!open) setEditingRecurring(undefined);
        }}
        onSave={onAddRecurring}
        onUpdate={onUpdateRecurring}
        onDelete={onDeleteRecurring}
        transaction={editingRecurring}
        type="income"
      />

      {incomeRecurring.length > 0 && (
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            {t('recurring')} ({incomeRecurring.length})
          </h3>
          <div className="space-y-2">
            {incomeRecurring.map((recurring) => (
              <motion.div
                key={recurring.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => handleEditRecurring(recurring)}
              >
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{t(recurring.source || 'other')}</span>
                  <Badge variant="secondary" className="text-xs">
                    {t(recurring.frequency)}
                  </Badge>
                  {recurring.isPaused && (
                    <Badge variant="outline" className="text-xs">
                      Paused
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-bold text-income">
                  {formatAmount(recurring.amount, true)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {incomes.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground py-8"
          >
            {t('noData')}
          </motion.p>
        ) : (
          <div className="space-y-3">
            {incomes.map((income) => {
              const Icon = sourceIcons[income.source];
              return (
                <motion.div
                  key={income.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-income-light rounded-lg border border-income/20 hover:shadow-medium transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-income flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{t(income.source)}</p>
                        {income.isRecurring && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Repeat className="h-3 w-3" />
                            {t('recurring')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(income.date).toLocaleDateString()}
                      </p>
                      {income.description && (
                        <p className="text-sm text-muted-foreground">
                          {income.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-income">
                      {formatAmount(income.amount, true)}
                    </span>
                    {!income.isRecurring && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteIncome(income.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}