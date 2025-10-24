export interface Income {
  id: string;
  source: 'mainJob' | 'sideJob' | 'other';
  amount: number;
  date: string;
  description?: string;
  isRecurring?: boolean;
  recurringId?: string;
}

export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description?: string;
  isRecurring?: boolean;
  recurringId?: string;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'healthcare'
  | 'shopping'
  | 'utilities'
  | 'education'
  | 'other';

export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
  isPaused: boolean;
  // For income
  source?: 'mainJob' | 'sideJob' | 'other';
  // For expense
  name?: string;
  category?: ExpenseCategory;
  description?: string;
}

export interface DailyData {
  date: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface SavingsDeposit {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SavingsVaultGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
  deposits: SavingsDeposit[];
  isCompleted: boolean;
}