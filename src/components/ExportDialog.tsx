import { useState } from 'react';
import { Download, Upload, FileText, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Income, Expense } from '@/types/finance';
import { exportToCSV, exportToPDF } from '@/utils/exportData';
import { toast } from 'sonner';

interface ExportDialogProps {
  month: Date;
  incomes: Income[];
  expenses: Expense[];
  onImport: (data: { incomes: Income[]; expenses: Expense[] }) => void;
}

export function ExportDialog({ month, incomes, expenses, onImport }: ExportDialogProps) {
  const { t, language } = useLanguage();
  const { formatAmount } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExportCSV = () => {
    try {
      exportToCSV({
        month,
        incomes,
        expenses,
        language,
        formatAmount,
        translations: {
          reportTitle: t('financialReport'),
          monthLabel: t('month'),
          income: t('income'),
          expenses: t('expenses'),
          netSavings: t('netSavings'),
          categoryBreakdown: t('categoryBreakdown'),
          dailySpending: t('dailySpending'),
          date: t('date'),
          description: t('description'),
          category: t('category'),
          amount: t('amount'),
          total: t('total')
        }
      });
      toast.success(t('exportSuccess'), {
        description: t('exportSuccessDesc'),
        icon: <CheckCircle2 className="h-5 w-5 text-income" />
      });
      setIsOpen(false);
    } catch (error) {
      toast.error(t('exportError'));
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF({
        month,
        incomes,
        expenses,
        language,
        formatAmount,
        translations: {
          reportTitle: t('financialReport'),
          monthLabel: t('month'),
          income: t('income'),
          expenses: t('expenses'),
          netSavings: t('netSavings'),
          categoryBreakdown: t('categoryBreakdown'),
          dailySpending: t('dailySpending'),
          date: t('date'),
          description: t('description'),
          category: t('category'),
          amount: t('amount'),
          total: t('total')
        }
      });
      toast.success(t('exportSuccess'), {
        description: t('exportSuccessDesc'),
        icon: <CheckCircle2 className="h-5 w-5 text-income" />
      });
      setIsOpen(false);
    } catch (error) {
      toast.error(t('exportError'));
    }
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const { importFromCSV } = await import('@/utils/exportData');
      const data = await importFromCSV(file);
      onImport(data);
      toast.success(t('importSuccess'), {
        description: `${t('imported')} ${data.incomes.length} ${t('income').toLowerCase()}, ${data.expenses.length} ${t('expenses').toLowerCase()}`,
        icon: <CheckCircle2 className="h-5 w-5 text-income" />
      });
      setIsOpen(false);
    } catch (error) {
      toast.error(t('importError'));
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">{t('exportBackup')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('exportBackup')}
          </DialogTitle>
          <DialogDescription>{t('exportBackupDesc')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Button
            onClick={handleExportCSV}
            className="w-full justify-start gap-3"
            variant="outline"
          >
            <FileSpreadsheet className="h-5 w-5 text-income" />
            <div className="flex flex-col items-start">
              <span className="font-medium">{t('exportCSV')}</span>
              <span className="text-xs text-muted-foreground">{t('exportCSVDesc')}</span>
            </div>
          </Button>
          
          <Button
            onClick={handleExportPDF}
            className="w-full justify-start gap-3"
            variant="outline"
          >
            <FileText className="h-5 w-5 text-expense" />
            <div className="flex flex-col items-start">
              <span className="font-medium">{t('exportPDF')}</span>
              <span className="text-xs text-muted-foreground">{t('exportPDFDesc')}</span>
            </div>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t('or')}</span>
            </div>
          </div>
          
          <Button
            className="w-full justify-start gap-3"
            variant="outline"
            onClick={() => document.getElementById('import-csv')?.click()}
            disabled={importing}
          >
            <Upload className="h-5 w-5 text-primary" />
            <div className="flex flex-col items-start">
              <span className="font-medium">{t('importCSV')}</span>
              <span className="text-xs text-muted-foreground">{t('importCSVDesc')}</span>
            </div>
          </Button>
          <input
            id="import-csv"
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}