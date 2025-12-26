import type React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  className?: string;
  withBottomPadding?: boolean;
  children: React.ReactNode;
}

export function PageContainer({
  className,
  withBottomPadding = false,
  children,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'max-w-4xl mx-auto px-md',
        withBottomPadding && 'pb-[calc(var(--spacing-xl)+env(safe-area-inset-bottom))]',
        className
      )}
    >
      {children}
    </div>
  );
}
