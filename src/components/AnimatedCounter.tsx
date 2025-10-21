import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  formatValue?: (value: number) => string;
  showSign?: boolean;
}

export function AnimatedCounter({ value, className, formatValue, showSign = false }: AnimatedCounterProps) {
  const { formatAmount } = useCurrency();
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => {
    if (formatValue) {
      return formatValue(Math.round(current));
    }
    if (showSign) {
      return formatAmount(Math.round(current), true);
    }
    return formatAmount(Math.round(current));
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}
