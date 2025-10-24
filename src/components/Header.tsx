import { Moon, Sun, Globe, Settings, Home, TrendingUp, Vault, Lock, Unlock, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency, currencies, Currency } from '@/contexts/CurrencyContext';
import { useSecurity } from '@/contexts/SecurityContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface HeaderProps {
  onOpenPINSetup?: () => void;
}

export function Header({ onOpenPINSetup }: HeaderProps = {}) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { isPINSet, lock } = useSecurity();
  const [userName, setUserName] = useLocalStorage<string>('userName', '');
  const [tempName, setTempName] = useLocalStorage<string>('userName', userName);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const headerRef = useRef(null);
  const { scrollY } = useScroll();
  
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.8]);
  const logoRotate = useTransform(scrollY, [0, 100], [0, 360]);
  const textY = useTransform(scrollY, [0, 100], [0, -5]);
  const textOpacity = useTransform(scrollY, [0, 50], [1, 0.8]);

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full glass-effect shadow-soft"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          style={{ perspective: "1000px" }}
        >
          <Link to="/" className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow"
              style={{ 
                scale: logoScale,
                rotateY: logoRotate
              }}
              whileHover={{ 
                scale: 1.2,
                rotateZ: 15,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">💰</span>
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold relative overflow-hidden"
              style={{ 
                y: textY,
                opacity: textOpacity
              }}
            >
              {"M4li-finance".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    rotateX: 0,
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    opacity: { duration: 0.3, delay: index * 0.05 },
                    y: { duration: 0.3, delay: index * 0.05 },
                    rotateX: { duration: 0.3, delay: index * 0.05 },
                    backgroundPosition: { 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: index * 0.1
                    }
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    rotateZ: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                  style={{ 
                    backgroundSize: "200% 200%",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear",
                  repeatDelay: 1
                }}
                style={{ 
                  mixBlendMode: "overlay",
                  pointerEvents: "none"
                }}
              />
            </motion.h1>
          </Link>
        </motion.div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent font-bold">
                    M4li-finance
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-3 mt-8">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={location.pathname === '/' ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3 h-12 text-base"
                  >
                    <Home className="h-5 w-5" />
                    {t('home')}
                  </Button>
                </Link>
                <Link to="/insights" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={location.pathname === '/insights' ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3 h-12 text-base"
                  >
                    <TrendingUp className="h-5 w-5" />
                    {t('insights')}
                  </Button>
                </Link>
                <Link to="/vault" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={location.pathname === '/vault' ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3 h-12 text-base"
                  >
                    <Vault className="h-5 w-5" />
                    {t('vault')}
                  </Button>
                </Link>
                
                <div className="border-t border-border my-4" />
                
                {/* Mobile Settings Section */}
                <div className="space-y-4 px-2">
                  <div>
                    <Label className="text-sm">{t('currency')}</Label>
                    <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                      <SelectTrigger className="mt-2 h-12">
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
                      <Label className="text-sm">{t('changeName')}</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          placeholder={t('enterYourName')}
                          className="h-12"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => setUserName(tempName)}
                          disabled={!tempName.trim()}
                          className="h-12"
                        >
                          {t('save')}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm">{t('security')}</Label>
                    {isPINSet ? (
                      <Button
                        variant="outline"
                        className="w-full mt-2 gap-2 h-12 justify-start"
                        onClick={() => {
                          lock();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Lock className="h-4 w-4" />
                        {t('lockApp')}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full mt-2 gap-2 h-12 justify-start"
                        onClick={() => {
                          onOpenPINSetup?.();
                          setMobileMenuOpen(false);
                        }}
                        disabled={!onOpenPINSetup}
                      >
                        <Unlock className="h-4 w-4" />
                        {t('setupPINLock')}
                      </Button>
                    )}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/">
              <Button
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                {t('home')}
              </Button>
            </Link>
            <Link to="/insights">
              <Button
                variant={location.pathname === '/insights' ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                {t('insights')}
              </Button>
            </Link>
            <Link to="/vault">
              <Button
                variant={location.pathname === '/vault' ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <Vault className="h-4 w-4" />
                {t('vault')}
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
          {/* Desktop Settings Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex relative overflow-hidden">
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
                <div className="pt-4 border-t border-border">
                  <Label>{t('security')}</Label>
                  {isPINSet ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 gap-2"
                      onClick={lock}
                    >
                      <Lock className="h-4 w-4" />
                      {t('lockApp')}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 gap-2"
                      onClick={onOpenPINSetup}
                      disabled={!onOpenPINSetup}
                    >
                      <Unlock className="h-4 w-4" />
                      {t('setupPINLock')}
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Language Toggle - Touch-Friendly */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="relative overflow-hidden min-w-[44px] min-h-[44px]"
            aria-label="Toggle language"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Globe className="h-5 w-5" />
            </motion.div>
            <span className="absolute -bottom-1 -right-1 text-xs font-bold">
              {language === 'en' ? '🇬🇧' : language === 'ru' ? '🇷🇺' : '🇹🇯'}
            </span>
          </Button>

          {/* Theme Toggle - Touch-Friendly */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden min-w-[44px] min-h-[44px]"
            aria-label="Toggle theme"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'light' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.div>
          </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}