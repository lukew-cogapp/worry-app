import type React from 'react';
import type { Worry } from '../types';
import { WorryFormSheet } from './WorryFormSheet';

interface EditWorrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, updates: { content?: string; action?: string; unlockAt?: string }) => void;
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
