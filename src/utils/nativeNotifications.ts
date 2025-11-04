export class NativeNotificationService {
  private static instance: NativeNotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.checkPermission();
  }

  static getInstance(): NativeNotificationService {
    if (!NativeNotificationService.instance) {
      NativeNotificationService.instance = new NativeNotificationService();
    }
    return NativeNotificationService.instance;
  }

  private checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async showNotification(title: string, options?: {
    body?: string;
    icon?: string;
    badge?: string;
    vibrate?: number[];
    tag?: string;
  }) {
    if (!('Notification' in window)) {
      return;
    }

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    const defaultOptions = {
      icon: '/icon-512.png',
      badge: '/icon-512.png',
      vibrate: [200, 100, 200],
      tag: 'finance-app',
      ...options,
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }
}

export const nativeNotifications = NativeNotificationService.getInstance();
