import { App as CapApp } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { History } from './pages/History';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import * as notifications from './services/notifications';
import { usePreferencesStore } from './store/preferencesStore';
import { useWorryStore } from './store/worryStore';

function App() {
  const loadWorries = useWorryStore((s) => s.loadWorries);
  const loadPreferences = usePreferencesStore((s) => s.loadPreferences);
  const resolveWorry = useWorryStore((s) => s.resolveWorry);
  const snoozeWorry = useWorryStore((s) => s.snoozeWorry);

  useEffect(() => {
    let notificationListenerHandle: any;
    let urlListenerHandle: any;

    async function init() {
      // Request notification permissions
      await notifications.requestPermissions();
      await notifications.registerNotificationActions();

      // Load stored data
      await loadPreferences();
      await loadWorries();

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
      urlListenerHandle = await CapApp.addListener('appUrlOpen', (event) => {
        // Handle worry://open/{worryId} URLs if needed
        console.log('App opened with URL:', event.url);
      });

      // Hide splash screen
      await SplashScreen.hide();
    }

    init();

    // Cleanup listeners on unmount
    return () => {
      notificationListenerHandle?.remove();
      urlListenerHandle?.remove();
    };
  }, [loadWorries, loadPreferences, resolveWorry, snoozeWorry]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
