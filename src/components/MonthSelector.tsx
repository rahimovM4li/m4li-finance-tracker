import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const { language } = useLanguage();
  
  const handlePrevMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  const handleCurrentMonth = () => {
    onMonthChange(startOfMonth(new Date()));
  };

  const isCurrentMonth = format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

  const monthDisplay = format(selectedMonth, 'MMMM yyyy', {
    locale: language === 'ru' ? ru : undefined,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-border/50 backdrop-blur-sm"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevMonth}
        className="hover:scale-105 transition-transform"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-primary" />
        <span className="text-lg font-semibold text-foreground min-w-[140px] text-center">
          {monthDisplay}
        </span>
      </div>

      <div className="flex gap-2">
        {!isCurrentMonth && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCurrentMonth}
            className="hover:scale-105 transition-transform"
          >
            Today
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="hover:scale-105 transition-transform"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}