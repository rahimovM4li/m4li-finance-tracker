import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationMessage } from '@/utils/notifications';
import { Card } from '@/components/ui/card';

interface NotificationAlertProps {
  notification: NotificationMessage | null;
  onDismiss: () => void;
}

export function NotificationAlert({ notification, onDismiss }: NotificationAlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleDismiss();
      }, 8000); // Auto-dismiss after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.severity) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-income" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-expense" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.severity) {
      case 'success':
        return 'border-income';
      case 'warning':
        return 'border-expense';
      default:
        return 'border-primary';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-20 left-1/2 z-50 w-full max-w-sm px-4"
        >
          <Card className={`p-4 border-l-4 ${getBorderColor()} shadow-medium glass-effect`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}