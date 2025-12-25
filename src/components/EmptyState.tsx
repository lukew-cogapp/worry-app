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
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-muted-foreground">{icon}</div>
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </div>
  );
};
