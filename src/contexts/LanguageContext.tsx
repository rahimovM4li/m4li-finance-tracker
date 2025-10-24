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
    
    // Calendar
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    
    // Messages
    noData: 'No data available',
    exportData: 'Export Data',
    importData: 'Import Data',
    
    // Welcome & Greetings
    welcomeTitle: "Welcome to M4li-finance!",
    welcomeDescription: "Let's get to know you better",
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
    installApp: "Install M4li-finance",
    installAppDescription: "Install this app on your device for the best experience!",
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
    incomeVsExpenses: 'Income vs Expenses',
    monthlyTrends: 'Monthly Trends',
    savingsGoal: 'Savings Goal',
    trackYourProgress: 'Track your monthly savings progress',
    setSavingsGoal: 'Set a monthly savings target',
    enterGoalAmount: 'Enter goal amount',
    setGoal: 'Set Goal',
    progress: 'Progress',
    saved: 'Saved',
    goal: 'Goal',
    toGo: 'to go!',
    keepGoing: 'You can do it!',
    showingInsightsFor: 'Showing insights for',
    
    // Recurring Transactions
    recurring: 'Recurring',
    addRecurring: 'Add Recurring Transaction',
    editRecurring: 'Edit Recurring Transaction',
    frequency: 'Frequency',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    startDate: 'Start Date',
    endDate: 'End Date',
    optional: 'optional',
    pauseRecurring: 'Pause',
    resumeRecurring: 'Resume',
    stopRecurring: 'Stop',
    recurringActive: 'recurring active',
    nextPayment: 'Next payment',
    dueIn: 'due in',
    days: 'days',
    noTransactionsThisMonth: 'No transactions yet for this month. Start adding some!',
    makeRecurring: 'Make Recurring',
    
    // Savings Vault
    savingsVault: 'Savings Vault',
    vault: 'Vault',
    trackYourSavingsGoals: 'Track your personal savings goals',
    newGoal: 'New Goal',
    createSavingsGoal: 'Create Savings Goal',
    goalTitle: 'Goal Title',
    goalTitlePlaceholder: 'e.g., Emergency Fund, Vacation, New Laptop',
    targetAmount: 'Target Amount',
    deadline: 'Deadline',
    createGoal: 'Create Goal',
    addDeposit: 'Add Deposit',
    addDepositTo: 'Add Deposit to',
    note: 'Note',
    depositNotePlaceholder: 'e.g., Weekly savings, bonus money',
    totalSavings: 'Total Savings',
    of: 'of',
    goalsCompleted: 'goals completed',
    noGoalsYet: 'No Goals Yet',
    createFirstSavingsGoal: 'Create your first savings goal and start building your financial future!',
    remaining: 'remaining',
    overdue: 'overdue',
    recentDeposits: 'Recent Deposits',
    
    // Security
    security: 'Security',
    unlockApp: 'Unlock App',
    enterPIN: 'Enter your 4-digit PIN',
    wrongPIN: 'Wrong PIN 😅',
    forgot: 'Forgot?',
    resetPIN: 'Reset PIN',
    resetPINWarning: 'This will clear your PIN and unlock the app. You can set up a new PIN anytime.',
    setupPIN: 'Set Up PIN',
    setupPINLock: 'Set Up PIN Lock',
    lockApp: 'Lock App',
    createPIN: 'Create a 4-digit PIN',
    confirmPIN: 'Confirm your PIN',
    pinEntered: 'PIN entered ✓',
    pinsDoNotMatch: 'PINs do not match',
    tryAgain: 'Try Again',
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
    
    // Calendar
    // Calendar
    today: 'Сегодня',
    thisWeek: 'Эта неделя',
    thisMonth: 'Этот месяц',
    
    // Messages
    noData: 'Нет данных',
    exportData: 'Экспорт данных',
    importData: 'Импорт данных',
    
    // Welcome & Greetings
    welcomeTitle: "Добро пожаловать в M4li-finance!",
    welcomeDescription: "Давайте познакомимся",
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
    installApp: "Установить M4li-finance",
    installAppDescription: "Установите это приложение на устройство для лучшего опыта!",
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
    incomeVsExpenses: 'Доходы против расходов',
    monthlyTrends: 'Месячные тренды',
    savingsGoal: 'Цель по накоплениям',
    trackYourProgress: 'Отслеживайте свой прогресс',
    setSavingsGoal: 'Установите месячную цель',
    enterGoalAmount: 'Введите сумму цели',
    setGoal: 'Установить',
    progress: 'Прогресс',
    saved: 'Накоплено',
    goal: 'Цель',
    toGo: 'осталось!',
    keepGoing: 'У вас получится!',
    showingInsightsFor: 'Показаны данные за',
    
    // Recurring Transactions
    recurring: 'Повторяющиеся',
    addRecurring: 'Добавить повторяющуюся транзакцию',
    editRecurring: 'Редактировать повторяющуюся транзакцию',
    frequency: 'Частота',
    weekly: 'Еженедельно',
    monthly: 'Ежемесячно',
    yearly: 'Ежегодно',
    startDate: 'Дата начала',
    endDate: 'Дата окончания',
    optional: 'необязательно',
    pauseRecurring: 'Приостановить',
    resumeRecurring: 'Возобновить',
    stopRecurring: 'Остановить',
    recurringActive: 'активных повторений',
    nextPayment: 'Следующий платеж',
    dueIn: 'через',
    days: 'дней',
    noTransactionsThisMonth: 'Пока нет транзакций за этот месяц. Начните добавлять!',
    makeRecurring: 'Сделать повторяющимся',
    
    // Savings Vault
    savingsVault: 'Хранилище накоплений',
    vault: 'Хранилище',
    trackYourSavingsGoals: 'Отслеживайте свои личные цели накоплений',
    newGoal: 'Новая цель',
    createSavingsGoal: 'Создать цель накоплений',
    goalTitle: 'Название цели',
    goalTitlePlaceholder: 'например, Резервный фонд, Отпуск, Новый ноутбук',
    targetAmount: 'Целевая сумма',
    deadline: 'Срок',
    createGoal: 'Создать цель',
    addDeposit: 'Добавить вклад',
    addDepositTo: 'Добавить вклад в',
    note: 'Заметка',
    depositNotePlaceholder: 'например, Еженедельные накопления, премия',
    totalSavings: 'Общие накопления',
    of: 'из',
    goalsCompleted: 'целей выполнено',
    noGoalsYet: 'Пока нет целей',
    createFirstSavingsGoal: 'Создайте свою первую цель накоплений и начните строить своё финансовое будущее!',
    remaining: 'осталось',
    overdue: 'просрочено',
    recentDeposits: 'Последние вклады',
    
    // Security
    security: 'Безопасность',
    unlockApp: 'Разблокировать',
    enterPIN: 'Введите 4-значный PIN-код',
    wrongPIN: 'Неверный PIN 😅',
    forgot: 'Забыли?',
    resetPIN: 'Сбросить PIN',
    resetPINWarning: 'Это удалит ваш PIN-код и разблокирует приложение. Вы можете установить новый PIN в любое время.',
    setupPIN: 'Установить PIN',
    setupPINLock: 'Установить PIN-блокировку',
    lockApp: 'Заблокировать',
    createPIN: 'Создайте 4-значный PIN-код',
    confirmPIN: 'Подтвердите ваш PIN-код',
    pinEntered: 'PIN введён ✓',
    pinsDoNotMatch: 'PIN-коды не совпадают',
    tryAgain: 'Попробовать снова',
    
    // Export & Notifications
    exportBackup: 'Экспорт и резервная копия',
    exportBackupDesc: 'Скачайте данные или импортируйте из резервной копии',
    exportCSV: 'Экспорт в CSV',
    exportCSVDesc: 'Формат для Excel, Google Sheets',
    exportPDF: 'Экспорт в PDF',
    exportPDFDesc: 'Профессиональный формат отчета',
    importCSV: 'Импорт из CSV',
    importCSVDesc: 'Восстановление или объединение данных',
    financialReport: 'Финансовый отчет',
    month: 'Месяц',
    exportSuccess: 'Экспорт успешен!',
    exportSuccessDesc: 'Ваш отчет загружен',
    exportError: 'Ошибка экспорта. Попробуйте снова.',
    importSuccess: 'Импорт успешен!',
    imported: 'Импортировано',
    importError: 'Ошибка импорта. Проверьте формат CSV.',
    notifications: 'Уведомления',
    smartNotifications: 'Умные уведомления',
    notificationSettingsDesc: 'Настройте оповещения для ваших финансов',
    enableNotifications: 'Включить уведомления',
    enableNotificationsDesc: 'Получать умные оповещения и напоминания',
    notificationTypes: 'Типы уведомлений',
    dailyBudgetTracking: 'Ежедневный контроль бюджета',
    budgetExceededAlerts: 'Оповещения о превышении бюджета',
    recurringTransactionReminders: 'Напоминания о повторяющихся транзакциях',
    savingsGoalNudges: 'Напоминания о целях сбережений',
    preferredNotificationTime: 'Предпочтительное время уведомлений',
    notificationsEnabled: 'Уведомления включены',
    notificationsEnabledDesc: 'Вы будете получать финансовые оповещения',
    notificationsDisabled: 'Уведомления выключены',
    notificationsDisabledDesc: 'Вы не будете получать уведомления',
    or: 'ИЛИ',
  },
  tg: {
    // Navigation
    dashboard: 'Лавҳаи асосӣ',
    income: 'Даромад',
    expenses: 'Харҷот',
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
    addExpense: 'Илова кардани харҷот',
    expenseName: 'Номи харҷот',
    totalExpenses: 'Харҷоти умумӣ',
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
    
    // Calendar
    today: 'Имрӯз',
    thisWeek: 'Ҳафтаи ҷорӣ',
    thisMonth: 'Моҳи ҷорӣ',
    
    // Messages
    noData: 'Маълумот нест',
    exportData: 'Содироти маълумот',
    importData: 'Вороди маълумот',
    
    // Welcome & Greetings
    welcomeTitle: "Хуш омадед ба M4li-finance!",
    welcomeDescription: "Биёед шиносӣ шавем",
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
    installApp: "Насб кардани M4li-finance",
    installAppDescription: "Барои таҷрибаи беҳтарин ин барномаро дар дастгоҳатон насб кунед!",
    install: 'Насб кардан',
    notNow: 'Баъдтар',
    home: 'Асосӣ',
    insights: 'Таҳлил',
    insightsDescription: 'Таҳлили тамоюл ва намунаҳои молиявии худ',
    compareWithLastMonth: 'Муқоиса бо моҳи гузашта',
    hideComparison: 'Пинҳон кардани муқоиса',
    vsLastMonth: 'ба муқобили моҳи гузашта',
    netSavings: 'Пасандози холис',
    dailyExpenseCalendar: 'Тақвими харҷоти ҳаррӯза',
    dailyExpenseDescription: 'Харитаи гармии шиддати харҷот дар тӯли моҳ',
    spendingByCategory: 'Харҷот аз рӯи категория',
    categoryBreakdown: 'Тақсимот аз рӯи категория барои моҳи ҷорӣ',
    incomeVsExpenses: 'Даромад ба муқобили харҷот',
    monthlyTrends: 'Тамоюли моҳона',
    savingsGoal: 'Максади пасандоз',
    trackYourProgress: 'Пешравии худро пайгирӣ кунед',
    setSavingsGoal: 'Максади моҳона гузоред',
    enterGoalAmount: 'Маблағи максадро ворид кунед',
    setGoal: 'Гузоштан',
    progress: 'Пешравӣ',
    saved: 'Пасандоз',
    goal: 'Максад',
    toGo: 'боқӣ мондааст!',
    keepGoing: 'Шумо метавонед!',
    showingInsightsFor: 'Маълумот барои',
    
    // Recurring Transactions
    recurring: 'Такрорӣ',
    addRecurring: 'Илова кардани транзаксияи такрорӣ',
    editRecurring: 'Тағйир додани транзаксияи такрорӣ',
    frequency: 'Басомад',
    weekly: 'Ҳафтавора',
    monthly: 'Моҳона',
    yearly: 'Солона',
    startDate: 'Санаи оғоз',
    endDate: 'Санаи анҷом',
    optional: 'ихтиёрӣ',
    pauseRecurring: 'Таваққуф',
    resumeRecurring: 'Идома додан',
    stopRecurring: 'Қатъ кардан',
    recurringActive: 'такрорҳои фаъол',
    nextPayment: 'Пардохти оянда',
    dueIn: 'баъди',
    days: 'рӯз',
    noTransactionsThisMonth: 'Ҳоло барои моҳи ҷорӣ транзаксия нест. Илова кардан оғоз кунед!',
    makeRecurring: 'Такрорӣ кардан',
    
    // Savings Vault
    savingsVault: 'Анбори пасандоз',
    vault: 'Анбор',
    trackYourSavingsGoals: 'Максадҳои пасандози шахсии худро пайгирӣ кунед',
    newGoal: 'Максади нав',
    createSavingsGoal: 'Максади пасандоз эҷод кунед',
    goalTitle: 'Номи максад',
    goalTitlePlaceholder: 'масалан, Фонди захиравӣ, Сафар, Ноутбуки нав',
    targetAmount: 'Маблағи максад',
    deadline: 'Мӯҳлат',
    createGoal: 'Эҷод кардан',
    addDeposit: 'Депозит илова кунед',
    addDepositTo: 'Депозит илова кунед ба',
    note: 'Ёддошт',
    depositNotePlaceholder: 'масалан, Пасандози ҳафтавора, маблағи мукофот',
    totalSavings: 'Пасандози умумӣ',
    of: 'аз',
    goalsCompleted: 'максадҳо иҷро шуд',
    noGoalsYet: 'Ҳоло максад нест',
    createFirstSavingsGoal: 'Максади пасандози аввалаи худро эҷод кунед ва оянда молиявии худро бино кунед!',
    remaining: 'боқӣ мондааст',
    overdue: 'мӯҳлат гузаштааст',
    recentDeposits: 'Депозитҳои охирин',
    
    // Security
    security: 'Бехатарӣ',
    unlockApp: 'Кушодан',
    enterPIN: 'PIN-коди 4-рақамии худро ворид кунед',
    wrongPIN: 'PIN нодуруст 😅',
    forgot: 'Фаромӯш кардед?',
    resetPIN: 'Аз нав танзим кардани PIN',
    resetPINWarning: 'Ин PIN-коди шуморо нест мекунад ва барномаро мекушояд. Шумо метавонед ҳар вақт PIN-коди нав гузоред.',
    setupPIN: 'Гузоштани PIN',
    setupPINLock: 'Гузоштани қулфи PIN',
    lockApp: 'Қулф кардан',
    createPIN: 'PIN-коди 4-рақамӣ эҷод кунед',
    confirmPIN: 'PIN-коди худро тасдиқ кунед',
    pinEntered: 'PIN ворид шуд ✓',
    pinsDoNotMatch: 'PIN-кодҳо мувофиқ нестанд',
    tryAgain: 'Аз нав кӯшиш кунед',
    
    // Export & Notifications
    exportBackup: 'Содирот ва нусхаи захира',
    exportBackupDesc: 'Маълумотро боргирӣ кунед ё аз нусхаи захира ворид кунед',
    exportCSV: 'Содирот ба CSV',
    exportCSVDesc: 'Формат барои Excel, Google Sheets',
    exportPDF: 'Содирот ба PDF',
    exportPDFDesc: 'Формати ҳисоботи касбӣ',
    importCSV: 'Воридот аз CSV',
    importCSVDesc: 'Барқарор ё якҷоя кардани маълумот',
    financialReport: 'Ҳисоботи молиявӣ',
    month: 'Моҳ',
    exportSuccess: 'Содирот муваффақ!',
    exportSuccessDesc: 'Ҳисоботи шумо боргирӣ шуд',
    exportError: 'Хатои содирот. Лутфан аз нав кӯшиш кунед.',
    importSuccess: 'Воридот муваффақ!',
    imported: 'Ворид шуд',
    importError: 'Хатои воридот. Форматро санҷед.',
    notifications: 'Огоҳиҳо',
    smartNotifications: 'Огоҳиҳои зирак',
    notificationSettingsDesc: 'Танзими огоҳиҳо барои молияи шумо',
    enableNotifications: 'Фаъол кардани огоҳиҳо',
    enableNotificationsDesc: 'Огоҳиҳо ва ёдоварӣ дарёфт кунед',
    notificationTypes: 'Намудҳои огоҳӣ',
    dailyBudgetTracking: 'Назорати буҷети рӯзона',
    budgetExceededAlerts: 'Огоҳӣ дар бораи зиёдшавии буҷет',
    recurringTransactionReminders: 'Ёдоварии транзаксияҳои давраӣ',
    savingsGoalNudges: 'Ёдоварии ҳадафҳои пасандоз',
    preferredNotificationTime: 'Вақти мақбули огоҳӣ',
    notificationsEnabled: 'Огоҳиҳо фаъол шуданд',
    notificationsEnabledDesc: 'Шумо огоҳиҳои молиявӣ дарёфт хоҳед кард',
    notificationsDisabled: 'Огоҳиҳо ғайрифаъол шуданд',
    notificationsDisabledDesc: 'Шумо огоҳиҳо дарёфт нахоҳед кард',
    or: 'Ё',
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
