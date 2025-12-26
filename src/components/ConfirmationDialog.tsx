import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useCallback } from 'react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { SheetShell } from './SheetShell';
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

  useBodyScrollLock(open);

  const descriptionId = description ? 'dialog-description' : undefined;

  return (
    <SheetShell
      open={open}
      onClose={handleClose}
      role="alertdialog"
      ariaLabelledBy="dialog-title"
      ariaDescribedBy={descriptionId}
      title={title}
      closeDisabled={isLoading}
      trapFocus
    >
      {description && (
        <p id="dialog-description" className="text-muted-foreground text-sm mb-md">
          {description}
        </p>
      )}

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

      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="lg"
          onClick={handleClose}
          disabled={isLoading}
          className="flex-1 min-h-touch-target"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          size="lg"
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          className="flex-1 min-h-touch-target"
        >
          {isLoading && <Loader2 className="mr-2 size-icon-sm animate-spin" />}
          {confirmText}
        </Button>
      </div>
    </SheetShell>
  );
};
