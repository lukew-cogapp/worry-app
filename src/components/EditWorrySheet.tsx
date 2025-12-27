import type React from 'react';
import type { Worry, WorryCategory } from '../types';
import { WorryFormSheet } from './WorryFormSheet';

interface EditWorrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (
    id: string,
    updates: { content?: string; unlockAt?: string; category?: WorryCategory; bestOutcome?: string }
  ) => void;
  worry: Worry | null;
  defaultTime?: string;
  isSubmitting?: boolean;
}

/**
 * Thin wrapper around WorryFormSheet for editing existing worries
 * Maintains existing API while using unified form component
 */
export const EditWorrySheet: React.FC<EditWorrySheetProps> = (props) => {
  return <WorryFormSheet mode="edit" {...props} />;
};
