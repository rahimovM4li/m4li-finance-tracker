import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShoppingBag, Repeat } from 'lucide-react';
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
import { Expense, ExpenseCategory, RecurringTransaction } from '@/types/finance';

interface ExpenseListProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  recurringTransactions: RecurringTransaction[];
  onAddRecurring: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  onUpdateRecurring: (id: string, updates: Partial<RecurringTransaction>) => void;
  onDeleteRecurring: (id: string) => void;
}

const categories: ExpenseCategory[] = [
  'food',
  'transport',
  'housing',
  'entertainment',
  'healthcare',
  'shopping',
  'utilities',
  'education',
  'other',
];

export function ExpenseList({ 
  expenses, 
  onAddExpense, 
  onDeleteExpense,
  recurringTransactions,
  onAddRecurring,
  onUpdateRecurring,
  onDeleteRecurring,
}: ExpenseListProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  const [open, setOpen] = useState(false);
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | undefined>();
  const [formData, setFormData] = useState({
    name: '',
    category: 'food' as ExpenseCategory,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const expenseRecurring = recurringTransactions.filter(t => t.type === 'expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    onAddExpense({
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
    });

    setFormData({
      name: '',
      category: 'food',
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

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">{t('expenses')}</h2>
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
            <Button className="gradient-expense">
              <Plus className="h-4 w-4 mr-2" />
              {t('addExpense')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addExpense')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>{t('expenseName')}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t('expenseName')}
                />
              </div>
              <div>
                <Label>{t('category')}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as ExpenseCategory })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {t(cat)}
                      </SelectItem>
                    ))}
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
              <Button type="submit" className="w-full gradient-expense">
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
        type="expense"
      />

      {expenseRecurring.length > 0 && (
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            {t('recurring')} ({expenseRecurring.length})
          </h3>
          <div className="space-y-2">
            {expenseRecurring.map((recurring) => (
              <motion.div
                key={recurring.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/10 cursor-pointer hover:bg-destructive/10 transition-colors"
                onClick={() => handleEditRecurring(recurring)}
              >
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">{recurring.name}</span>
                  <Badge variant="secondary" className="text-xs">{t(recurring.frequency)}</Badge>
                  {recurring.isPaused && <Badge variant="outline" className="text-xs">Paused</Badge>}
                </div>
                <span className="text-sm font-bold text-expense">-{formatAmount(recurring.amount)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {expenses.length === 0 ? (
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
            {expenses.map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 bg-expense-light rounded-lg border border-expense/20 hover:shadow-medium transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-expense flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{expense.name}</p>
                      {expense.isRecurring && (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          {t('recurring')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t(expense.category)} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                    {expense.description && (
                      <p className="text-sm text-muted-foreground">
                        {expense.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-expense">
                    -{formatAmount(expense.amount)}
                  </span>
                  {!expense.isRecurring && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}