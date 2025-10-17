import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    income: 'Income',
    expenses: 'Expenses',
    calendar: 'Calendar',
    statistics: 'Statistics',
    
    // Common
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    total: 'Total',
    date: 'Date',
    amount: 'Amount',
    category: 'Category',
    name: 'Name',
    description: 'Description',
    
    // Income
    addIncome: 'Add Income',
    incomeSource: 'Income Source',
    mainJob: 'Main Job',
    sideJob: 'Side Job',
    other: 'Other',
    totalIncome: 'Total Income',
    
    // Expenses
    addExpense: 'Add Expense',
    expenseName: 'Expense Name',
    totalExpenses: 'Total Expenses',
    remainingBalance: 'Remaining Balance',
    
    // Categories
    food: 'Food',
    transport: 'Transport',
    housing: 'Housing',
    entertainment: 'Entertainment',
    healthcare: 'Healthcare',
    shopping: 'Shopping',
    utilities: 'Utilities',
    education: 'Education',
    
    // Statistics
    incomeVsExpenses: 'Income vs Expenses',
    spendingByCategory: 'Spending by Category',
    monthlyTrends: 'Monthly Trends',
    financialGrowth: 'Financial Growth',
    
    // Calendar
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    
    // Messages
    noData: 'No data available',
    exportData: 'Export Data',
    importData: 'Import Data',
    
    // Welcome & Greetings
    welcomeTitle: 'Welcome to Finance Tracker!',
    welcomeDescription: 'Let\'s get to know you better',
    yourName: 'Your Name',
    enterYourName: 'Enter your name',
    getStarted: 'Get Started',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    yourBalanceToday: 'Your balance today',
    changeName: 'Change Name',
    
    // Currency
    selectCurrency: 'Select Currency',
    currency: 'Currency',
  },
  ru: {
    // Navigation
    dashboard: 'Панель',
    income: 'Доходы',
    expenses: 'Расходы',
    calendar: 'Календарь',
    statistics: 'Статистика',
    
    // Common
    add: 'Добавить',
    edit: 'Изменить',
    delete: 'Удалить',
    cancel: 'Отмена',
    save: 'Сохранить',
    total: 'Всего',
    date: 'Дата',
    amount: 'Сумма',
    category: 'Категория',
    name: 'Название',
    description: 'Описание',
    
    // Income
    addIncome: 'Добавить доход',
    incomeSource: 'Источник дохода',
    mainJob: 'Основная работа',
    sideJob: 'Подработка',
    other: 'Другое',
    totalIncome: 'Общий доход',
    
    // Expenses
    addExpense: 'Добавить расход',
    expenseName: 'Название расхода',
    totalExpenses: 'Общие расходы',
    remainingBalance: 'Остаток',
    
    // Categories
    food: 'Еда',
    transport: 'Транспорт',
    housing: 'Жилье',
    entertainment: 'Развлечения',
    healthcare: 'Здоровье',
    shopping: 'Покупки',
    utilities: 'Коммунальные',
    education: 'Образование',
    
    // Statistics
    incomeVsExpenses: 'Доходы против расходов',
    spendingByCategory: 'Расходы по категориям',
    monthlyTrends: 'Месячные тренды',
    financialGrowth: 'Финансовый рост',
    
    // Calendar
    today: 'Сегодня',
    thisWeek: 'Эта неделя',
    thisMonth: 'Этот месяц',
    
    // Messages
    noData: 'Нет данных',
    exportData: 'Экспорт данных',
    importData: 'Импорт данных',
    
    // Welcome & Greetings
    welcomeTitle: 'Добро пожаловать в Finance Tracker!',
    welcomeDescription: 'Давайте познакомимся',
    yourName: 'Ваше имя',
    enterYourName: 'Введите ваше имя',
    getStarted: 'Начать',
    goodMorning: 'Доброе утро',
    goodAfternoon: 'Добрый день',
    goodEvening: 'Добрый вечер',
    yourBalanceToday: 'Ваш баланс сегодня',
    changeName: 'Изменить имя',
    
    // Currency
    selectCurrency: 'Выбрать валюту',
    currency: 'Валюта',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ru' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}