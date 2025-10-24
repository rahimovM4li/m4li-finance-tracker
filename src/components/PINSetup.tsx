import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { useSecurity } from '@/contexts/SecurityContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface PINSetupProps {
  onClose: () => void;
}

export function PINSetup({ onClose }: PINSetupProps) {
  const { setupPIN } = useSecurity();
  const { t } = useLanguage();
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [firstPin, setFirstPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState(false);

  const currentPin = step === 'enter' ? firstPin : confirmPin;
  const setCurrentPin = step === 'enter' ? setFirstPin : setConfirmPin;

  const handlePinInput = (digit: string) => {
    if (currentPin.length < 4) {
      const newPin = currentPin + digit;
      setCurrentPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (step === 'enter') {
          setTimeout(() => setStep('confirm'), 300);
        } else {
          setTimeout(() => {
            if (newPin === firstPin) {
              setupPIN(newPin);
              onClose();
            } else {
              setError(true);
              setConfirmPin('');
            }
          }, 100);
        }
      }
    }
  };

  const handleDelete = () => {
    setCurrentPin(currentPin.slice(0, -1));
    setError(false);
  };

  const handleBack = () => {
    setStep('enter');
    setConfirmPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm px-6 space-y-8 relative"
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-6"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Lock className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">{t('setupPIN')}</h1>
          <p className="text-muted-foreground text-center">
            {step === 'enter' ? t('createPIN') : t('confirmPIN')}
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: currentPin.length > i ? 1.2 : 1,
                backgroundColor: currentPin.length > i ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
              }}
              className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center"
            >
              {currentPin.length > i && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary-foreground"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Success/Error Message */}
        <AnimatePresence>
          {step === 'confirm' && !error && confirmPin.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-primary"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">{t('pinEntered')}</span>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-sm text-destructive">{t('pinsDoNotMatch')}</span>
              <Button variant="ghost" size="sm" onClick={handleBack}>
                {t('tryAgain')}
              </Button>
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
          <div />
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
            disabled={currentPin.length === 0}
          >
            ⌫
          </Button>
        </div>
      </motion.div>
    </div>
  );
}