import { Moon, Sun, Globe, Settings, Home, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency, currencies, Currency } from '@/contexts/CurrencyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useMemo, useState } from "react";

export function Header() {
   const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [userName, setUserName] = useLocalStorage<string>('userName', '');
  const [tempName, setTempName] = useLocalStorage<string>('userName', userName);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const [visibleTop, setVisibleTop] = useState(0);
  const [visibleBottom, setVisibleBottom] = useState(0);

  // Textzeilen
  const topLine = useMemo(() => "M4li".split(""), []);
  const bottomLine = useMemo(() => "finance".split(""), []);

  // Scroll → animiert beide Zeilen nacheinander
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const total = topLine.length + bottomLine.length;
    const progress = latest * total * 1.5; // etwas beschleunigt

    if (progress < topLine.length) {
      setVisibleTop(Math.floor(progress));
      setVisibleBottom(0);
    } else {
      setVisibleTop(topLine.length);
      setVisibleBottom(Math.floor(progress - topLine.length));
    }
  });

  // Farben je nach Theme
  const glowColor = theme === "dark" ? "#5110b9ff" : "#ffffffff";
  const textColor = theme === "dark" ? "#ffffff" : "#5110b9ff";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full glass-effect shadow-soft"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        
        {/* Logo + Title (Desktop) */}
        <motion.div className="hidden md:flex items-center gap-3" whileHover={{ scale: 1.02 }}>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-2xl">💰</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              M4li Finance
            </h1>
          </Link>
        </motion.div>

        {/* Mobile App Name in Center */}
   <motion.div
          className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden text-center text-sm font-bold leading-[1.1] select-none"
          style={{ color: textColor }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* obere Zeile */}
          <motion.div
            style={{
              textShadow: `0 0 6px ${glowColor}, 0 0 12px ${glowColor}`,
            }}
          >
            {topLine.map((char, index) => (
              <motion.span
                key={index}
                animate={{ opacity: index < visibleTop ? 1 : 0.1 }}
                transition={{ duration: 0.05, ease: "easeInOut" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* untere Zeile */}
          <motion.div
            style={{
              textShadow: `0 0 6px ${glowColor}, 0 0 12px ${glowColor}`,
              marginTop: "0.1rem",
            }}
          >
            {bottomLine.map((char, index) => (
              <motion.span
                key={index}
                animate={{ opacity: index < visibleBottom ? 1 : 0.1 }}
                transition={{ duration: 0.05, ease: "easeInOut" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>


        {/* Navigation */}
        <nav className="flex items-center gap-2 md:gap-2">
          <Link to="/">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 sm:gap-2 flex-col sm:flex-row items-center"
            >
              <Home className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{t('home')}</span>
            </Button>
          </Link>
          <Link to="/insights">
            <Button
              variant={location.pathname === '/insights' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 sm:gap-2 flex-col sm:flex-row items-center"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{t('insights')}</span>
            </Button>
          </Link>
        </nav>

        {/* Settings / Theme / Language */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative overflow-hidden">
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 bg-card z-50" align="end">
              <div className="space-y-4">
                <div>
                  <Label>{t('currency')}</Label>
                  <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      {Object.values(currencies).map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          <span className="flex items-center gap-2">
                            <span>{curr.flag}</span>
                            <span>{curr.symbol} - {curr.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {userName && (
                  <div>
                    <Label>{t('changeName')}</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder={t('enterYourName')}
                      />
                      <Button 
                        size="sm" 
                        onClick={() => setUserName(tempName)}
                        disabled={!tempName.trim()}
                      >
                        {t('save')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="relative overflow-hidden"
          >
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <Globe className="h-5 w-5" />
            </motion.div>
            <span className="absolute -bottom-1 -right-1 text-xs font-bold">
                {language === 'en'
    ? '🇬🇧'
    : language === 'ru'
    ? '🇷🇺'
    : language === 'tg'
    ? '🇹🇯'
    : '🌐'}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
