import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useSecurity } from '@/contexts/SecurityContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function LockScreen() {
  const { verifyPIN, unlock, resetPIN } = useSecurity();
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        setTimeout(() => {
          if (verifyPIN(newPin)) {
            unlock();
          } else {
            setError(true);
            setPin('');
          }
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleReset = () => {
    resetPIN();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm px-6 space-y-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Lock className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">{t('unlockApp')}</h1>
          <p className="text-muted-foreground text-center">{t('enterPIN')}</p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: pin.length > i ? 1.2 : 1,
                backgroundColor: pin.length > i ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
              }}
              className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center"
            >
              {pin.length > i && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary-foreground"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{t('wrongPIN')}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              size="lg"
              className="h-16 text-xl font-bold"
              onClick={() => handlePinInput(num.toString())}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="lg"
            className="h-16"
            onClick={() => setShowReset(!showReset)}
          >
            {showReset ? t('cancel') : t('forgot')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-16 text-xl font-bold"
            onClick={() => handlePinInput('0')}
          >
            0
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-16"
            onClick={handleDelete}
            disabled={pin.length === 0}
          >
            ⌫
          </Button>
        </div>

        {/* Reset Confirmation */}
        {showReset && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-3"
          >
            <p className="text-sm text-center">{t('resetPINWarning')}</p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleReset}
            >
              {t('resetPIN')}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}