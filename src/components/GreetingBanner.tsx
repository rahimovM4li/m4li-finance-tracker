import { motion } from 'framer-motion';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from './ui/card';

interface GreetingBannerProps {
  userName: string;
  balance: number;
}

export function GreetingBanner({ userName, balance }: GreetingBannerProps) {
  const { formatAmount } = useCurrency();
  const { t } = useLanguage();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  const getBalanceEmoji = () => {
    if (balance > 1000) return '😄';
    if (balance > 0) return '🙂';
    if (balance === 0) return '😐';
    return '😢';
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' as const }}
      className="mb-8"
    >
      <Card className="p-6 glass-effect border-2 border-primary/20">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' as const, stiffness: 200 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {getTimeGreeting()}, {userName}! <span className="text-3xl">{getBalanceEmoji()}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('yourBalanceToday')}: {' '}
            <span className={`font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
              {formatAmount(balance, true)}
            </span>
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
