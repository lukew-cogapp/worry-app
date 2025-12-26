import type * as React from 'react';
import { cn } from '@/lib/utils';

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('relative', className)} {...props} />;
}

function InputGroupIcon({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupIcon };
