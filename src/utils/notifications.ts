import { SavingsVaultGoal } from '@/types/finance';

export interface NotificationMessage {
  id: string;
  type: 'budget' | 'exceeded' | 'recurring' | 'savings' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'success';
}

const funnyMessages = {
  en: {
    budgetLow: [
      "You have $[amount] left. Ramen budget activated 🍜",
      "Only $[amount] remaining... Coffee or survival? 🤔",
      "$[amount] left. Time to become a minimalist 😅",
      "Last $[amount] standing. Protect them with your life 💰"
    ],
    budgetExceeded: [
      "Bro… your wallet just cried 💸",
      "Stop buying coffee ☕, invest in yourself!",
      "Overspent by $[amount]. Your future self is judging you 👀",
      "Budget exploded like a confetti cannon 🎊 (but sadder)"
    ],
    savingsNudge: [
      "Add $[amount] to your [goal] fund. Your future self will thank you! 🙏",
      "Just $[amount] away from your [goal] goal. You got this! 💪",
      "Deposit alert: Your [goal] fund misses you 🥺",
      "If you save $[amount] today, you're basically Warren Buffett 📈"
    ],
    achievement: [
      "You actually saved money?! Unbelievable 😱",
      "Goal achieved! If you keep this up, retirement at 2078 😂",
      "Savings goal complete! Now set another one, champion 🏆",
      "$[amount] saved! Your bank account is doing a happy dance 💃"
    ]
  },
  ru: {
    budgetLow: [
      "Осталось $[amount]. Активирован режим рамэна 🍜",
      "Только $[amount]... Кофе или выживание? 🤔",
      "$[amount] осталось. Время стать минималистом 😅",
      "Последние $[amount]. Охраняйте их ценой жизни 💰"
    ],
    budgetExceeded: [
      "Бро… твой кошелек только что заплакал 💸",
      "Хватит покупать кофе ☕, инвестируй в себя!",
      "Перерасход $[amount]. Твое будущее я осуждает тебя 👀",
      "Бюджет взорвался как конфетти 🎊 (но грустнее)"
    ],
    savingsNudge: [
      "Добавь $[amount] в фонд [goal]. Твое будущее я скажет спасибо! 🙏",
      "Всего $[amount] до цели [goal]. Ты справишься! 💪",
      "Предупреждение: Твой фонд [goal] скучает 🥺",
      "Если ты сбережешь $[amount] сегодня, ты практически Уоррен Баффет 📈"
    ],
    achievement: [
      "Ты реально сберег деньги?! Невероятно 😱",
      "Цель достигнута! Если так продолжишь, выйдешь на пенсию в 2078 😂",
      "Цель сбережений выполнена! Теперь поставь новую, чемпион 🏆",
      "$[amount] сбережено! Твой банковский счет танцует от счастья 💃"
    ]
  },
  tg: {
    budgetLow: [
      "Боқимонда $[amount]. Режими рамен фаъол шуд 🍜",
      "Танҳо $[amount] мондааст... Қаҳва ё зиндагӣ? 🤔",
      "$[amount] мондааст. Вақти минималист шудан расид 😅",
      "Охирин $[amount]. Онҳоро бо ҷон нигоҳ дор 💰"
    ],
    budgetExceeded: [
      "Додар… ҳамёнат гиря кард 💸",
      "Харидани қаҳваро қатъ кун ☕, ба худ сармоя гузор!",
      "Зиёдатӣ $[amount]. Оянда ту туро муҳокима мекунад 👀",
      "Буҷет монанди конфетӣ таркид 🎊 (вале ғамгинтар)"
    ],
    savingsNudge: [
      "$[amount] ба фонди [goal] илова кун. Оянда ту миннатдор мешавад! 🙏",
      "Танҳо $[amount] то ҳадафи [goal]. Ту метавонӣ! 💪",
      "Огоҳӣ: Фонди [goal]ат дилтанг шудааст 🥺",
      "Агар имрӯз $[amount] захира кунӣ, ту амалан Уоррен Баффет ҳастӣ 📈"
    ],
    achievement: [
      "Ту воқеан пул захира кардӣ?! Боварнокардани 😱",
      "Ҳадаф ҳосил шуд! Агар ҳамин тавр идома диҳӣ, соли 2078 бознишаста мешавӣ 😂",
      "Ҳадафи пасандоз иҷро шуд! Акнун яке нав гузор, қаҳрамон 🏆",
      "$[amount] захира шуд! Ҳисоби бонкӣат аз хурсандӣ мерақсад 💃"
    ]
  }
};

export function generateNotification(
  type: NotificationMessage['type'],
  language: 'en' | 'ru' | 'tg',
  data: { amount?: number; goal?: string }
): NotificationMessage {
  const messages = funnyMessages[language];
  let messageList: string[] = [];
  let title = '';
  let severity: NotificationMessage['severity'] = 'info';

  switch (type) {
    case 'budget':
      messageList = messages.budgetLow;
      title = language === 'en' ? '⚠️ Budget Alert' : language === 'ru' ? '⚠️ Огоҳии Буҷет' : '⚠️ Предупреждение бюджета';
      severity = 'warning';
      break;
    case 'exceeded':
      messageList = messages.budgetExceeded;
      title = language === 'en' ? '😅 Overspending Alert' : language === 'ru' ? '😅 Перерасход' : '😅 Зиёд харҷ';
      severity = 'warning';
      break;
    case 'savings':
      messageList = messages.savingsNudge;
      title = language === 'en' ? '💰 Savings Reminder' : language === 'ru' ? '💰 Напоминание о сбережениях' : '💰 Ёдовари пасандоз';
      severity = 'info';
      break;
    case 'achievement':
      messageList = messages.achievement;
      title = language === 'en' ? '🎉 Achievement Unlocked' : language === 'ru' ? '🎉 Достижение разблокировано' : '🎉 Муваффақият кушода шуд';
      severity = 'success';
      break;
    default:
      messageList = messages.budgetLow;
  }

  const randomMessage = messageList[Math.floor(Math.random() * messageList.length)];
  let message = randomMessage;

  if (data.amount !== undefined) {
    message = message.replace('[amount]', data.amount.toString());
  }
  if (data.goal) {
    message = message.replace('[goal]', data.goal);
  }

  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    type,
    title,
    message,
    timestamp: new Date(),
    severity
  };
}

export function checkBudgetAlerts(
  expenses: number,
  income: number,
  language: 'en' | 'ru' | 'tg'
): NotificationMessage | null {
  const remaining = income - expenses;
  const percentage = income > 0 ? (remaining / income) * 100 : 0;

  if (remaining < 0) {
    return generateNotification('exceeded', language, { amount: Math.abs(remaining) });
  }

  if (percentage < 10 && percentage > 0) {
    return generateNotification('budget', language, { amount: remaining });
  }

  return null;
}

export function checkSavingsGoalNudge(
  goal: SavingsVaultGoal,
  language: 'en' | 'ru' | 'tg'
): NotificationMessage | null {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  if (progress >= 90 && progress < 100) {
    return generateNotification('savings', language, { 
      amount: remaining, 
      goal: goal.title 
    });
  }

  if (progress >= 100) {
    return generateNotification('achievement', language, { 
      amount: goal.currentAmount, 
      goal: goal.title 
    });
  }

  return null;
}