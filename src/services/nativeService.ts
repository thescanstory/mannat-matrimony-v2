import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const nativeService = {
  // Check if running on native iOS/Android device
  isNative: (): boolean => {
    return Capacitor.isNativePlatform();
  },

  // Native Haptic Vibrations
  haptic: {
    // Light tactile feedback on standard buttons and navigation clicks
    light: async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await Haptics.impact({ style: ImpactStyle.Light });
        } catch (e) {
          console.debug('Haptics not supported:', e);
        }
      }
    },

    // Medium tactile feedback on major actions (e.g. Express Interest, Vouch)
    medium: async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await Haptics.impact({ style: ImpactStyle.Medium });
        } catch (e) {
          console.debug('Haptics not supported:', e);
        }
      }
    },

    // Heavy tactile feedback on significant events (e.g. Mutual Match, Unlock)
    heavy: async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await Haptics.impact({ style: ImpactStyle.Heavy });
        } catch (e) {
          console.debug('Haptics not supported:', e);
        }
      }
    },

    // Success notification vibration
    success: async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await Haptics.notification({ type: NotificationType.Success });
        } catch (e) {
          console.debug('Haptics not supported:', e);
        }
      }
    },

    // Warning / Error vibration
    warning: async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await Haptics.notification({ type: NotificationType.Warning });
        } catch (e) {
          console.debug('Haptics not supported:', e);
        }
      }
    },

    // Selection change tick (e.g. scrolling carousels or tabs)
    selection: async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await Haptics.selectionStart();
        } catch (e) {
          console.debug('Haptics not supported:', e);
        }
      }
    }
  },

  // Native iOS Share Sheet (UIActivityViewController) with Web Share API fallback
  share: async (options: {
    title: string;
    text: string;
    url?: string;
    dialogTitle?: string;
  }): Promise<{ completed: boolean; error?: string }> => {
    try {
      if (Capacitor.isNativePlatform()) {
        const canShare = await Share.canShare();
        if (canShare.value) {
          await Share.share({
            title: options.title,
            text: options.text,
            url: options.url || window.location.href,
            dialogTitle: options.dialogTitle || 'Share Matrimonial Bio-Data'
          });
          return { completed: true };
        }
      }

      // Web Navigator Share fallback
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url || window.location.href
        });
        return { completed: true };
      }

      // Clipboard fallback if sharing is unsupported
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const textToCopy = `${options.title}\n${options.text}\n${options.url || window.location.href}`;
        await navigator.clipboard.writeText(textToCopy);
        return { completed: true };
      }

      return { completed: false, error: 'Share unsupported' };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { completed: false };
      }
      console.warn('Native share error:', err);
      return { completed: false, error: err.message };
    }
  },

  // Status Bar Customization
  setStatusBarLight: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: Style.Light });
      } catch (e) {
        console.debug('StatusBar style error:', e);
      }
    }
  },

  setStatusBarDark: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (e) {
        console.debug('StatusBar style error:', e);
      }
    }
  },

  // Hide Splash Screen once App is ready
  hideSplashScreen: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await SplashScreen.hide();
      } catch (e) {
        console.debug('SplashScreen error:', e);
      }
    }
  }
};
