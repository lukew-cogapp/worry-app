import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect } from 'react';
import { lang } from '../config/language';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'destructive';
  showTextarea?: boolean;
  textareaValue?: string;
  onTextareaChange?: (value: string) => void;
  textareaLabel?: string;
  textareaPlaceholder?: string;
}

/**
 * Bottom sheet confirmation dialog that doesn't cause layout shift
 * Uses simple fixed positioning like WorryFormSheet
 */
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  isLoading = false,
  variant = 'default',
  showTextarea = false,
  textareaValue = '',
  onTextareaChange,
  textareaLabel,
  textareaPlaceholder,
}) => {
  const handleClose = useCallback(() => {
    if (!isLoading) {
      onOpenChange(false);
    }
  }, [isLoading, onOpenChange]);

  // Handle Escape key
  useEscapeKey(handleClose, open);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-dialog animate-slide-up"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div className="p-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-md">
            <h2 id="dialog-title" className="text-xl font-bold text-foreground">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground text-2xl size-button-icon"
              aria-label={lang.aria.close}
            >
              ×
            </Button>
          </div>

          {/* Description */}
          {description && (
            <p id="dialog-description" className="text-muted-foreground text-sm mb-md">
              {description}
            </p>
          )}

          {/* Optional Textarea */}
          {showTextarea && (
            <div className="mb-md">
              {textareaLabel && (
                <label
                  htmlFor="dialog-textarea"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {textareaLabel}
                </label>
              )}
              <Textarea
                id="dialog-textarea"
                value={textareaValue}
                onChange={(e) => onTextareaChange?.(e.target.value)}
                placeholder={textareaPlaceholder}
                rows={3}
                disabled={isLoading}
                className="bg-background resize-none"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 min-h-touch-target"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              className="flex-1 min-h-touch-target"
            >
              {isLoading && <Loader2 className="mr-2 size-icon-sm animate-spin" />}
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
