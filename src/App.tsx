import { App as CapApp } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';
import { SystemBars, SystemBarsStyle } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { SplashScreen } from '@capacitor/splash-screen';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { DebugErrorDialog } from './components/DebugErrorDialog';
import { useDebugError } from './hooks/useDebugError';
import { History } from './pages/History';
import { Home } from './pages/Home';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import * as notifications from './services/notifications';
import { usePreferencesStore } from './store/preferencesStore';
import { useWorryStore } from './store/worryStore';

function App() {
  const loadWorries = useWorryStore((s) => s.loadWorries);
  const checkAndUnlockExpired = useWorryStore((s) => s.checkAndUnlockExpired);
  const loadPreferences = usePreferencesStore((s) => s.loadPreferences);
  const resolveWorry = useWorryStore((s) => s.resolveWorry);
  const snoozeWorry = useWorryStore((s) => s.snoozeWorry);
  const { debugError, handleError, clearError } = useDebugError();

  useEffect(() => {
    let notificationListenerHandle: PluginListenerHandle | undefined;
    let urlListenerHandle: PluginListenerHandle | undefined;
    let appStateListenerHandle: PluginListenerHandle | undefined;
    let unlockCheckInterval: number | undefined;

    async function init() {
      // Load stored data first (works on all platforms)
      await loadPreferences();
      await loadWorries();

      // Capacitor-specific features - may fail on web, which is fine
      try {
        // Enable privacy screen to protect sensitive content
        // Blurs app in task switcher and prevents screenshots
        await PrivacyScreen.enable();

        // Set system bars to dark style (light content on dark background)
        // Provides cohesive dark mode experience
        await SystemBars.setStyle({ style: SystemBarsStyle.Dark });

        await notifications.requestPermissions();
        await notifications.registerNotificationActions();

        // Handle notification actions
        notificationListenerHandle = await LocalNotifications.addListener(
          'localNotificationActionPerformed',
          (action) => {
            const { worryId } = action.notification.extra;

            if (action.actionId === 'done') {
              resolveWorry(worryId);
            } else if (action.actionId === 'snooze') {
              snoozeWorry(worryId, 60 * 60 * 1000); // 1 hour
            }
          }
        );

        // Handle deep links from notification tap
        urlListenerHandle = await CapApp.addListener('appUrlOpen', (_event) => {
          // Handle worry://open/{worryId} URLs if needed in future
        });

        // Check for expired worries when app comes to foreground
        appStateListenerHandle = await CapApp.addListener('appStateChange', (state) => {
          if (state.isActive) {
            checkAndUnlockExpired();
          }
        });

        // Hide splash screen
        await SplashScreen.hide();
      } catch {
        // Capacitor features not available on web - this is expected
      }

      // Check for expired worries every 30 seconds (works on all platforms)
      unlockCheckInterval = window.setInterval(() => {
        checkAndUnlockExpired();
      }, 30000); // 30 seconds
    }

    init().catch((error) => {
      console.error('Failed to initialize app:', error);
      handleError(error, {
        operation: 'appInitialization',
        stage: 'loadWorries or loadPreferences',
      });
      toast.error('Failed to load app data. Please try restarting the app.');
    });

    // Cleanup listeners on unmount
    return () => {
      notificationListenerHandle?.remove();
      urlListenerHandle?.remove();
      appStateListenerHandle?.remove();
      if (unlockCheckInterval) {
        clearInterval(unlockCheckInterval);
      }
    };
  }, [loadWorries, loadPreferences, resolveWorry, snoozeWorry, checkAndUnlockExpired, handleError]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <DebugErrorDialog error={debugError} onClose={clearError} />
    </BrowserRouter>
  );
}

export default App;
