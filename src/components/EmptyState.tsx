import { Package } from 'lucide-react';
import type React from 'react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = <Package className="size-icon-xl" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 text-muted-foreground animate-pulse">{icon}</div>
      <h2 className="text-foreground mb-2">{title}</h2>
      <p className="text-base text-muted-foreground w-full max-w-xl leading-relaxed">{message}</p>
    </div>
  );
};
