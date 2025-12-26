import type React from 'react';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const WorryCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-md">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
};
