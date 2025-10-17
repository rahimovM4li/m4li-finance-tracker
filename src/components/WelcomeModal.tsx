import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface WelcomeModalProps {
  open: boolean;
  onComplete: (name: string) => void;
}

export function WelcomeModal({ open, onComplete }: WelcomeModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-5xl">👋</span>
              </div>
            </motion.div>
            <DialogTitle className="text-2xl text-center">
              {t('welcomeTitle')}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t('welcomeDescription')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <Label htmlFor="name">{t('yourName')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('enterYourName')}
                autoFocus
                className="mt-2"
              />
            </div>
            <Button type="submit" className="w-full gradient-primary" disabled={!name.trim()}>
              {t('getStarted')}
            </Button>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}