import type React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function PageContainer({ className, children }: PageContainerProps) {
  return <div className={cn('max-w-4xl mx-auto px-md', className)}>{children}</div>;
}
