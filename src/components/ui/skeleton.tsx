import type React from 'react';
import { cn } from '../../lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-accent relative overflow-hidden rounded-md',
        'before:absolute before:inset-0 before:translate-x-[-100%] before:animate-[shimmer_2s_infinite] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]',
        'dark:before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
