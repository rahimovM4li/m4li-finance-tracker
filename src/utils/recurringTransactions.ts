import { RecurringTransaction, Income, Expense } from '@/types/finance';
import { addDays, addWeeks, addMonths, addYears, startOfMonth, endOfMonth, isWithinInterval, isBefore, isAfter, format } from 'date-fns';

export function generateRecurringTransactionsForMonth(
  recurring: RecurringTransaction[],
  month: Date
): { incomes: Income[]; expenses: Expense[] } {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  
  const generatedIncomes: Income[] = [];
  const generatedExpenses: Expense[] = [];

  recurring.forEach((transaction) => {
    if (transaction.isPaused) return;

    const startDate = new Date(transaction.startDate);
    const endDate = transaction.endDate ? new Date(transaction.endDate) : null;

    // Skip if start date is after the month we're checking
    if (isAfter(startDate, monthEnd)) return;

    // Skip if end date is before the month we're checking
    if (endDate && isBefore(endDate, monthStart)) return;

    const occurrences = getOccurrencesInMonth(
      startDate,
      endDate,
      transaction.frequency,
      monthStart,
      monthEnd
    );

    occurrences.forEach((occurrenceDate) => {
      const dateStr = format(occurrenceDate, 'yyyy-MM-dd');
      
      if (transaction.type === 'income') {
        generatedIncomes.push({
          id: `recurring-${transaction.id}-${dateStr}`,
          source: transaction.source || 'other',
          amount: transaction.amount,
          date: dateStr,
          description: transaction.description,
          isRecurring: true,
          recurringId: transaction.id,
        });
      } else {
        generatedExpenses.push({
          id: `recurring-${transaction.id}-${dateStr}`,
          name: transaction.name || '',
          category: transaction.category || 'other',
          amount: transaction.amount,
          date: dateStr,
          description: transaction.description,
          isRecurring: true,
          recurringId: transaction.id,
        });
      }
    });
  });

  return { incomes: generatedIncomes, expenses: generatedExpenses };
}

function getOccurrencesInMonth(
  startDate: Date,
  endDate: Date | null,
  frequency: 'weekly' | 'monthly' | 'yearly',
  monthStart: Date,
  monthEnd: Date
): Date[] {
  const occurrences: Date[] = [];
  let currentDate = new Date(startDate);

  // Find the first occurrence in or before the target month
  while (isBefore(currentDate, monthStart)) {
    currentDate = getNextOccurrence(currentDate, frequency);
  }

  // Generate all occurrences within the month
  while (
    !isAfter(currentDate, monthEnd) &&
    (endDate === null || !isAfter(currentDate, endDate))
  ) {
    if (isWithinInterval(currentDate, { start: monthStart, end: monthEnd })) {
      occurrences.push(new Date(currentDate));
    }
    currentDate = getNextOccurrence(currentDate, frequency);
  }

  return occurrences;
}

function getNextOccurrence(date: Date, frequency: 'weekly' | 'monthly' | 'yearly'): Date {
  switch (frequency) {
    case 'weekly':
      return addWeeks(date, 1);
    case 'monthly':
      return addMonths(date, 1);
    case 'yearly':
      return addYears(date, 1);
  }
}

export function getUpcomingRecurringTransactions(
  recurring: RecurringTransaction[],
  daysAhead: number = 7
): Array<RecurringTransaction & { nextDate: string; daysUntil: number }> {
  const today = new Date();
  const futureDate = addDays(today, daysAhead);

  return recurring
    .filter((t) => !t.isPaused)
    .map((transaction) => {
      const nextDate = getNextOccurrenceDate(transaction, today);
      if (!nextDate || isAfter(nextDate, futureDate)) return null;

      const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...transaction,
        nextDate: format(nextDate, 'yyyy-MM-dd'),
        daysUntil,
      };
    })
    .filter(Boolean) as Array<RecurringTransaction & { nextDate: string; daysUntil: number }>;
}

function getNextOccurrenceDate(transaction: RecurringTransaction, fromDate: Date): Date | null {
  const startDate = new Date(transaction.startDate);
  const endDate = transaction.endDate ? new Date(transaction.endDate) : null;

  if (endDate && isBefore(endDate, fromDate)) return null;

  let currentDate = new Date(startDate);

  // If start date is in the future, that's the next occurrence
  if (isAfter(currentDate, fromDate)) return currentDate;

  // Find the next occurrence after fromDate
  while (!isAfter(currentDate, fromDate)) {
    currentDate = getNextOccurrence(currentDate, transaction.frequency);
  }

  // Check if it's within the end date
  if (endDate && isAfter(currentDate, endDate)) return null;

  return currentDate;
}
