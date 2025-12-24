import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { usePreferencesStore } from '../store/preferencesStore';

export function useHaptics() {
  const hapticEnabled = usePreferencesStore((s) => s.preferences.hapticFeedback);

  const lockWorry = async () => {
    if (!hapticEnabled) return;
    // Satisfying "thunk" when locking away a worry
    await Haptics.impact({ style: ImpactStyle.Heavy });
  };

  const unlockWorry = async () => {
    if (!hapticEnabled) return;
    await Haptics.notification({ type: NotificationType.Success });
  };

  const buttonTap = async () => {
    if (!hapticEnabled) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  };

  const resolveWorry = async () => {
    if (!hapticEnabled) return;
    await Haptics.notification({ type: NotificationType.Success });
  };

  return { lockWorry, unlockWorry, buttonTap, resolveWorry };
}
