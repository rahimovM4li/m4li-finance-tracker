import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type Currency = 'TJS' | 'USD' | 'EUR' | 'RUB' | 'GBP';

interface CurrencyInfo {
  code: Currency;
  symbol: string;
  flag: string;
  name: string;
}

export const currencies: Record<Currency, CurrencyInfo> = {
  TJS: { code: 'TJS', symbol: 'tjs', flag: '🇹🇯', name: 'Tajik Somoni' },
  USD: { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  RUB: { code: 'RUB', symbol: '₽', flag: '🇷🇺', name: 'Russian Ruble' },
  GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencyInfo: CurrencyInfo;
  formatAmount: (amount: number, showSign?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useLocalStorage<Currency>('currency', 'USD');
  const currencyInfo = currencies[currency];

  const formatAmount = (amount: number, showSign = false): string => {
    const sign = showSign ? (amount >= 0 ? '+' : '-') : '';
    const absAmount = Math.abs(amount);
    return `${sign}${currencyInfo.symbol}${absAmount.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencyInfo, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}