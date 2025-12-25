import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { Capacitor } from '@capacitor/core';

/**
 * Action Sheet utility for native-first UX
 *
 * Shows native action sheets on iOS/Android, gracefully handles web.
 * Action sheets provide a more native feel than dropdown menus on mobile.
 */

export interface ActionSheetOption {
  title: string;
  onClick: () => void;
  style?: ActionSheetButtonStyle;
}

/**
 * Show a native action sheet on mobile, returns false on web for fallback handling
 *
 * @param options - Array of action sheet options
 * @param title - Optional title for the action sheet
 * @returns Promise<boolean> - true if action sheet was shown, false if should use fallback
 */
export async function showActionSheet(
  options: ActionSheetOption[],
  title?: string
): Promise<boolean> {
  // Only use action sheets on native platforms
  if (!Capacitor.isNativePlatform()) {
    return false; // Signal to use fallback (dropdown menu)
  }

  try {
    const result = await ActionSheet.showActions({
      title,
      options: options.map((opt) => ({
        title: opt.title,
        style: opt.style,
      })),
    });

    // Execute the selected option's callback
    if (result.index >= 0 && result.index < options.length) {
      options[result.index].onClick();
    }

    return true; // Action sheet was shown
  } catch (error) {
    console.error('[ActionSheet] Failed to show action sheet:', error);
    return false; // Fall back to dropdown
  }
}

/**
 * Show a confirmation action sheet with Yes/No options
 *
 * @param title - Dialog title
 * @param message - Optional message
 * @param confirmText - Text for confirm button
 * @param onConfirm - Callback when confirmed
 * @param destructive - Whether the confirm action is destructive
 * @returns Promise<boolean> - true if action sheet was shown, false if should use fallback
 */
export async function showConfirmSheet(
  title: string,
  message: string | undefined,
  confirmText: string,
  onConfirm: () => void,
  destructive = false
): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    const result = await ActionSheet.showActions({
      title: message ? `${title}\n\n${message}` : title,
      options: [
        {
          title: confirmText,
          style: destructive ? ActionSheetButtonStyle.Destructive : ActionSheetButtonStyle.Default,
        },
        {
          title: 'Cancel',
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    // Index 0 is confirm, index 1 is cancel
    if (result.index === 0) {
      onConfirm();
    }

    return true;
  } catch (error) {
    console.error('[ActionSheet] Failed to show confirm sheet:', error);
    return false;
  }
}
