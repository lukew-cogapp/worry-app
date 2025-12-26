import type React from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { lang } from '../config/language';
import { Button } from './ui/button';

interface SheetShellProps {
  open: boolean;
  onClose: () => void;
  role?: 'dialog' | 'alertdialog';
  ariaLabelledBy: string;
  ariaDescribedBy?: string;
  title: React.ReactNode;
  titleClassName?: string;
  headerIcon?: React.ReactNode;
  headerClassName?: string;
  showCloseButton?: boolean;
  closeDisabled?: boolean;
  trapFocus?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export const SheetShell: React.FC<SheetShellProps> = ({
  open,
  onClose,
  role = 'dialog',
  ariaLabelledBy,
  ariaDescribedBy,
  title,
  titleClassName,
  headerIcon,
  headerClassName,
  showCloseButton = true,
  closeDisabled = false,
  trapFocus = false,
  containerRef,
  children,
}) => {
  const localRef = useRef<HTMLDivElement | null>(null);
  const resolvedRef = containerRef ?? localRef;

  useEffect(() => {
    if (!open || !trapFocus) return;
    const container = resolvedRef.current;
    if (!container) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => !el.hasAttribute('disabled')
      );
    const focusable = getFocusable();
    (focusable[0] ?? container).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, trapFocus, resolvedRef]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={resolvedRef}
        tabIndex={-1}
        className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-dialog motion-safe:animate-slide-up"
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        <div className="p-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <div className={cn('flex items-center justify-between mb-md', headerClassName)}>
            <div className="flex items-center gap-2">
              {headerIcon}
              <h2
                id={ariaLabelledBy}
                className={cn('text-xl font-bold text-foreground', titleClassName)}
              >
                {title}
              </h2>
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                disabled={closeDisabled}
                className="text-muted-foreground active:text-foreground text-2xl size-button-icon"
                aria-label={lang.aria.close}
              >
                ×
              </Button>
            )}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};
