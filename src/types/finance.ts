export interface Income {
  id: string;
  source: 'mainJob' | 'sideJob' | 'other';
  amount: number;
  date: string;
  description?: string;
}

export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description?: string;
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

export interface DailyData {
  date: string;
  income: number;
  expenses: number;
  balance: number;
}