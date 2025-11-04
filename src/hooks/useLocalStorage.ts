import { useState, useEffect } from 'react';
import localforage from 'localforage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    localforage.getItem<T>(key)
      .then((item) => {
        if (item !== null) {
          setStoredValue(item);
        }
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setIsLoaded(true);
      });
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localforage.setItem(key, valueToStore).catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue, isLoaded] as const;
}
