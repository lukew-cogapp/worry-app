import type React from 'react';
import { usePreferencesStore } from '../store/preferencesStore';
import { WorryFormSheet } from './WorryFormSheet';

interface AddWorrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (worry: { content: string; action?: string; unlockAt: string }) => void;
  onRelease?: (content: string) => void;
  isSubmitting?: boolean;
  isReleasing?: boolean;
}

/**
 * Thin wrapper around WorryFormSheet for adding new worries
 * Maintains existing API while using unified form component
 */
export const AddWorrySheet: React.FC<AddWorrySheetProps> = (props) => {
  const defaultUnlockTime = usePreferencesStore((s) => s.preferences.defaultUnlockTime);

  return <WorryFormSheet mode="add" defaultTime={defaultUnlockTime} {...props} />;
};
