import { Income, Expense, RecurringTransaction } from '@/types/finance';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, isBefore, isAfter, isSameMonth } from 'date-fns';
import { generateRecurringTransactionsForMonth } from './recurringTransactions';

export function calculatePreviousBalance(
  incomes: Income[],
  expenses: Expense[],
  recurringTransactions: RecurringTransaction[],
  selectedMonth: Date
): number {
  const monthStart = startOfMonth(selectedMonth);
  
  // Get all incomes and expenses before the selected month
  const previousIncomes = incomes.filter(income => {
    const incomeDate = parseISO(income.date);
    return isBefore(incomeDate, monthStart);
  });
  
  const previousExpenses = expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isBefore(expenseDate, monthStart);
  });
  
  // Find the earliest transaction date to know where to start generating recurring transactions
  const allDates = [
    ...previousIncomes.map(i => parseISO(i.date)),
    ...previousExpenses.map(e => parseISO(e.date)),
    ...recurringTransactions.map(r => parseISO(r.startDate))
  ];
  
  if (allDates.length === 0) return 0;
  
  const earliestDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const earliestMonth = startOfMonth(earliestDate);
  
  // Generate recurring transactions for all months before the selected month
  let recurringIncomesTotal = 0;
  let recurringExpensesTotal = 0;
  
  let currentMonth = new Date(earliestMonth);
  while (isBefore(currentMonth, monthStart)) {
    // Für vergangene Monate: alle Transaktionen des Monats (keine Limitierung)
    const generated = generateRecurringTransactionsForMonth(
      recurringTransactions, 
      currentMonth,
      false // Keine Limitierung auf heute, da es vergangene Monate sind
    );
    recurringIncomesTotal += generated.incomes.reduce((sum, income) => sum + income.amount, 0);
    recurringExpensesTotal += generated.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Move to next month
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }
  
  const previousIncomeTotal = previousIncomes.reduce((sum, income) => sum + income.amount, 0);
  const previousExpensesTotal = previousExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (previousIncomeTotal + recurringIncomesTotal) - (previousExpensesTotal + recurringExpensesTotal);
}

/**
 * Berechnet den Balance für den ausgewählten Monat
 * Berücksichtigt nur Transaktionen, die bereits stattgefunden haben
 */
export function calculateCurrentMonthBalance(
  allIncomes: Income[], // ALLE Incomes (nicht gefiltert)
  allExpenses: Expense[], // ALLE Expenses (nicht gefiltert)
  recurringTransactions: RecurringTransaction[],
  selectedMonth: Date
): { 
  totalIncome: number; 
  totalExpenses: number; 
  balance: number;
  incomes: Income[];
  expenses: Expense[];
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  
  const isCurrentMonth = isSameMonth(selectedMonth, today);
  const isFutureMonth = isAfter(monthStart, today);
  
  // Wenn zukünftiger Monat: keine Transaktionen
  if (isFutureMonth) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      incomes: [],
      expenses: []
    };
  }
  
  // Manuelle Transaktionen für den ausgewählten Monat filtern
  const monthlyIncomes = allIncomes.filter(income => {
    const incomeDate = parseISO(income.date);
    return isWithinInterval(incomeDate, { start: monthStart, end: monthEnd });
  });
  
  const monthlyExpenses = allExpenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });
  
  // Wiederkehrende Transaktionen generieren
  // Für aktuellen Monat: nur bis heute
  // Für vergangene Monate: alle Transaktionen
  const generated = generateRecurringTransactionsForMonth(
    recurringTransactions,
    selectedMonth,
    isCurrentMonth // true = nur bis heute, false = ganzer Monat
  );
  
  // Alle Transaktionen zusammenführen
  const allMonthIncomes = [...monthlyIncomes, ...generated.incomes];
  const allMonthExpenses = [...monthlyExpenses, ...generated.expenses];
  
  const totalIncome = allMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = allMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    incomes: allMonthIncomes,
    expenses: allMonthExpenses
  };
}