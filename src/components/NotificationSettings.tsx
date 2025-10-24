import { useState } from 'react';
import { Bell, BellOff, Clock, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

export interface NotificationConfig {
  enabled: boolean;
  dailyBudget: boolean;
  budgetExceeded: boolean;
  recurringReminders: boolean;
  savingsNudges: boolean;
  notificationTime: string;
}

const DEFAULT_CONFIG: NotificationConfig = {
  enabled: false,
  dailyBudget: true,
  budgetExceeded: true,
  recurringReminders: true,
  savingsNudges: true,
  notificationTime: '09:00'
};

export function NotificationSettings() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useLocalStorage<NotificationConfig>('notificationConfig', DEFAULT_CONFIG);

  const updateConfig = (updates: Partial<NotificationConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    
    if (updates.enabled === false) {
      toast.info(t('notificationsDisabled'), {
        description: t('notificationsDisabledDesc'),
        icon: <BellOff className="h-5 w-5" />
      });
    } else if (updates.enabled === true) {
      toast.success(t('notificationsEnabled'), {
        description: t('notificationsEnabledDesc'),
        icon: <Bell className="h-5 w-5 text-income" />
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {config.enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          <span className="hidden md:inline">{t('notifications')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {t('smartNotifications')}
          </DialogTitle>
          <DialogDescription>{t('notificationSettingsDesc')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">{t('enableNotifications')}</Label>
              <p className="text-sm text-muted-foreground">{t('enableNotificationsDesc')}</p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => updateConfig({ enabled })}
            />
          </div>

          {config.enabled && (
            <>
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium">{t('notificationTypes')}</h4>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{t('dailyBudgetTracking')}</Label>
                  <Switch
                    checked={config.dailyBudget}
                    onCheckedChange={(dailyBudget) => updateConfig({ dailyBudget })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">{t('budgetExceededAlerts')}</Label>
                  <Switch
                    checked={config.budgetExceeded}
                    onCheckedChange={(budgetExceeded) => updateConfig({ budgetExceeded })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">{t('recurringTransactionReminders')}</Label>
                  <Switch
                    checked={config.recurringReminders}
                    onCheckedChange={(recurringReminders) => updateConfig({ recurringReminders })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">{t('savingsGoalNudges')}</Label>
                  <Switch
                    checked={config.savingsNudges}
                    onCheckedChange={(savingsNudges) => updateConfig({ savingsNudges })}
                  />
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  {t('preferredNotificationTime')}
                </Label>
                <Select
                  value={config.notificationTime}
                  onValueChange={(notificationTime) => updateConfig({ notificationTime })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00 AM</SelectItem>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="18:00">06:00 PM</SelectItem>
                    <SelectItem value="20:00">08:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}