import { Income, Expense } from '@/types/finance';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportOptions {
  month: Date;
  incomes: Income[];
  expenses: Expense[];
  language: string;
  formatAmount: (amount: number) => string;
  translations: {
    reportTitle: string;
    monthLabel: string;
    income: string;
    expenses: string;
    netSavings: string;
    categoryBreakdown: string;
    dailySpending: string;
    date: string;
    description: string;
    category: string;
    amount: string;
    total: string;
  };
}

export function exportToCSV(options: ExportOptions): void {
  const { incomes, expenses, formatAmount, translations, month } = options;
  const monthStr = format(month, 'yyyy-MM');

  // Create CSV content
  let csv = `\uFEFF`; // UTF-8 BOM for Excel compatibility
  
  // Header
  csv += `${translations.reportTitle} - ${format(month, 'MMMM yyyy')}\n\n`;
  
  // Income section
  csv += `${translations.income}\n`;
  csv += `${translations.date},${translations.description},${translations.amount}\n`;
  incomes.forEach(income => {
    csv += `${format(new Date(income.date), 'yyyy-MM-dd')},${income.source},${income.amount}\n`;
  });
  csv += `${translations.total},,${incomes.reduce((sum, i) => sum + i.amount, 0)}\n\n`;
  
  // Expenses section
  csv += `${translations.expenses}\n`;
  csv += `${translations.date},${translations.description},${translations.category},${translations.amount}\n`;
  expenses.forEach(expense => {
    csv += `${format(new Date(expense.date), 'yyyy-MM-dd')},${expense.name},${expense.category},${expense.amount}\n`;
  });
  csv += `${translations.total},,,${expenses.reduce((sum, e) => sum + e.amount, 0)}\n\n`;
  
  // Summary
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  csv += `${translations.netSavings},,${totalIncome - totalExpense}\n`;
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `finance-report-${monthStr}.csv`;
  link.click();
}

export function exportToPDF(options: ExportOptions): void {
  const { incomes, expenses, formatAmount, translations, month } = options;
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(translations.reportTitle, 14, 20);
  doc.setFontSize(12);
  doc.text(`${translations.monthLabel}: ${format(month, 'MMMM yyyy')}`, 14, 30);
  
  let yPos = 40;
  
  // Income table
  doc.setFontSize(14);
  doc.text(translations.income, 14, yPos);
  yPos += 5;
  
  autoTable(doc, {
    startY: yPos,
    head: [[translations.date, translations.description, translations.amount]],
    body: incomes.map(i => [
      format(new Date(i.date), 'yyyy-MM-dd'),
      i.source,
      formatAmount(i.amount)
    ]),
    foot: [[translations.total, '', formatAmount(incomes.reduce((sum, i) => sum + i.amount, 0))]],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Expenses table
  doc.setFontSize(14);
  doc.text(translations.expenses, 14, yPos);
  yPos += 5;
  
  autoTable(doc, {
    startY: yPos,
    head: [[translations.date, translations.description, translations.category, translations.amount]],
    body: expenses.map(e => [
      format(new Date(e.date), 'yyyy-MM-dd'),
      e.name,
      e.category,
      formatAmount(e.amount)
    ]),
    foot: [[translations.total, '', '', formatAmount(expenses.reduce((sum, e) => sum + e.amount, 0))]],
    theme: 'grid',
    headStyles: { fillColor: [251, 146, 60] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
  });
  
  // Summary
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netSavings = totalIncome - totalExpense;
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text(`${translations.netSavings}: ${formatAmount(netSavings)}`, 14, yPos);
  
  // Download
  const monthStr = format(month, 'yyyy-MM');
  doc.save(`finance-report-${monthStr}.pdf`);
}

export function importFromCSV(file: File): Promise<{ incomes: Income[]; expenses: Expense[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        const incomes: Income[] = [];
        const expenses: Expense[] = [];
        let section: 'income' | 'expense' | null = null;
        
        lines.forEach((line, index) => {
          // Skip BOM and headers
          const cleanLine = line.replace(/^\uFEFF/, '').trim();
          
          // Detect sections
          if (cleanLine.toLowerCase().includes('income') && cleanLine.split(',').length === 1) {
            section = 'income';
            return;
          }
          if (cleanLine.toLowerCase().includes('expense') && cleanLine.split(',').length === 1) {
            section = 'expense';
            return;
          }
          
          // Skip header and total rows
          if (cleanLine.toLowerCase().includes('date') || 
              cleanLine.toLowerCase().includes('total') ||
              cleanLine.toLowerCase().includes('report') ||
              !cleanLine) {
            return;
          }
          
          const parts = cleanLine.split(',');
          
          if (section === 'income' && parts.length >= 3) {
            const [date, source, amount] = parts;
            if (date && source && amount && !isNaN(parseFloat(amount))) {
              incomes.push({
                id: `import-${Date.now()}-${index}`,
                source: source.trim() as any,
                amount: parseFloat(amount),
                date: new Date(date.trim()).toISOString()
              });
            }
          } else if (section === 'expense' && parts.length >= 4) {
            const [date, name, category, amount] = parts;
            if (date && name && category && amount && !isNaN(parseFloat(amount))) {
              expenses.push({
                id: `import-${Date.now()}-${index}`,
                name: name.trim(),
                amount: parseFloat(amount),
                category: category.trim() as any,
                date: new Date(date.trim()).toISOString()
              });
            }
          }
        });
        
        resolve({ incomes, expenses });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}