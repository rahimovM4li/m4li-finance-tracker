import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ru' | 'tg';

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

     // PWA Install
    installApp: 'Install Finance Tracker',
    installAppDescription: 'Install this app on your device for the best experience!',
    install: 'Install',
    notNow: 'Not Now',
    home: 'Home',
    insights: 'Insights',
    insightsDescription: 'Analyze your financial trends and patterns',
    compareWithLastMonth: 'Compare with last month',
    hideComparison: 'Hide comparison',
    vsLastMonth: 'vs last month',
    netSavings: 'Net Savings',
    dailyExpenseCalendar: 'Daily Expense Calendar',
    dailyExpenseDescription: 'Heatmap showing spending intensity throughout the month',
    spendingByCategory: 'Spending by Category',
    categoryBreakdown: 'Current month category breakdown',
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

       // PWA Install
    installApp: 'Установить Finance Tracker',
    installAppDescription: 'Установите это приложение на устройство для лучшего опыта!',
    install: 'Установить',
    notNow: 'Позже',
    home: 'Главная',
    insights: 'Аналитика',
    insightsDescription: 'Анализируйте финансовые тренды и паттерны',
    compareWithLastMonth: 'Сравнить с прошлым месяцем',
    hideComparison: 'Скрыть сравнение',
    vsLastMonth: 'против прошлого месяца',
    netSavings: 'Чистые сбережения',
    dailyExpenseCalendar: 'Календарь ежедневных расходов',
    dailyExpenseDescription: 'Тепловая карта интенсивности расходов в течение месяца',
    spendingByCategory: 'Расходы по категориям',
    categoryBreakdown: 'Разбивка по категориям за текущий месяц',
  },
  tg: {
    // Navigation
    dashboard: 'Лавҳаи асосӣ',
    income: 'Даромад',
    expenses: 'Хароҷот',
    calendar: 'Тақвим',
    statistics: 'Статистика',
    
    // Common
    add: 'Илова кардан',
    edit: 'Тағйир додан',
    delete: 'Нест кардан',
    cancel: 'Бекор кардан',
    save: 'Захира кардан',
    total: 'Ҳамагӣ',
    date: 'Сана',
    amount: 'Миқдор',
    category: 'Категория',
    name: 'Ном',
    description: 'Тавсиф',
    
    // Income
    addIncome: 'Илова кардани даромад',
    incomeSource: 'Манбаи даромад',
    mainJob: 'Кори асосӣ',
    sideJob: 'Кори иловагӣ',
    other: 'Дигар',
    totalIncome: 'Даромади умумӣ',
    
    // Expenses
    addExpense: 'Илова кардани хароҷот',
    expenseName: 'Номи хароҷот',
    totalExpenses: 'Хароҷоти умумӣ',
    remainingBalance: 'Боқимонда',
    
    // Categories
    food: 'Хӯрок',
    transport: 'Нақлиёт',
    housing: 'Хонагӣ',
    entertainment: 'Фароғат',
    healthcare: 'Тандурустӣ',
    shopping: 'Харидорӣ',
    utilities: 'Коммуналӣ',
    education: 'Маориф',
    
    // Statistics
    incomeVsExpenses: 'Даромад ба муқобили харoҷот',
    monthlyTrends: 'Тамоюли моҳона',
    financialGrowth: 'Афзоиши молиявӣ',
    
    // Calendar
    today: 'Имрӯз',
    thisWeek: 'Ҳафтаи ҷорӣ',
    thisMonth: 'Моҳи ҷорӣ',
    
    // Messages
    noData: 'Маълумот нест',
    exportData: 'Содироти маълумот',
    importData: 'Вороди маълумот',
    
    // Welcome & Greetings
    welcomeTitle: 'Хуш омадед ба Finance Tracker!',
    welcomeDescription: 'Биёед шиносӣ шавем',
    yourName: 'Номи шумо',
    enterYourName: 'Номи худро ворид кунед',
    getStarted: 'Оғоз кардан',
    goodMorning: 'Субҳ ба хайр',
    goodAfternoon: 'Рӯз ба хайр',
    goodEvening: 'Шом ба хайр',
    yourBalanceToday: 'Балансатон имрӯз',
    changeName: 'Тағйир додани ном',
    
    // Currency
    selectCurrency: 'Интихоби асъор',
    currency: 'Асъор',
    
    // PWA Install
    installApp: 'Насб кардани Finance Tracker',
    installAppDescription: 'Барои таҷрибаи беҳтарин ин барномаро дар дастгоҳатон насб кунед!',
    install: 'Насб кардан',
    notNow: 'Баъдтар',
    home: 'Асосӣ',
    insights: 'Таҳлил',
    insightsDescription: 'Таҳлили тамоюл ва намунаҳои молиявии худ',
    compareWithLastMonth: 'Муқоиса бо моҳи гузашта',
    hideComparison: 'Пинҳон кардани муқоиса',
    vsLastMonth: 'ба муқобили моҳи гузашта',
    netSavings: 'Пасандози холис',
    dailyExpenseCalendar: 'Тақвими харoҷоти ҳаррӯза',
    dailyExpenseDescription: 'Харитаи гармии шиддати харoҷот дар тӯли моҳ',
    spendingByCategory: 'Харoҷот аз рӯи категория',
    categoryBreakdown: 'Тақсимот аз рӯи категория барои моҳи ҷорӣ',
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
     setLanguage((prev) => {
      if (prev === 'en') return 'ru';
      if (prev === 'ru') return 'tg';
      return 'en';
    });
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