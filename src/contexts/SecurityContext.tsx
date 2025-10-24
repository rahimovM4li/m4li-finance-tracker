import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SecurityContextType {
  isLocked: boolean;
  isPINSet: boolean;
  setupPIN: (pin: string) => void;
  verifyPIN: (pin: string) => boolean;
  unlock: () => void;
  lock: () => void;
  resetPIN: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [storedPIN, setStoredPIN] = useLocalStorage<string | null>('appPIN', null);
  const [isLocked, setIsLocked] = useState(!!storedPIN);

  const isPINSet = !!storedPIN;

  useEffect(() => {
    // Lock app when page loads if PIN is set
    if (storedPIN) {
      setIsLocked(true);
    }
  }, []);

  const setupPIN = (pin: string) => {
    setStoredPIN(pin);
    setIsLocked(false);
  };

  const verifyPIN = (pin: string) => {
    return pin === storedPIN;
  };

  const unlock = () => {
    setIsLocked(false);
  };

  const lock = () => {
    if (storedPIN) {
      setIsLocked(true);
    }
  };

  const resetPIN = () => {
    setStoredPIN(null);
    setIsLocked(false);
  };

  return (
    <SecurityContext.Provider value={{ isLocked, isPINSet, setupPIN, verifyPIN, unlock, lock, resetPIN }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}