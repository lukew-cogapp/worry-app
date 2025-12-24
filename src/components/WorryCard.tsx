import { Loader2 } from 'lucide-react';
import type React from 'react';
import type { Worry } from '../types';
import { formatDateTime, getRelativeTime } from '../utils/dates';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';

interface WorryCardProps {
  worry: Worry;
  onResolve?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onSnooze?: (id: string, durationMs: number) => void;
  onUnlockNow?: (id: string) => void;
  onClick?: (id: string) => void;
  isResolving?: boolean;
  isDismissing?: boolean;
  isSnoozing?: boolean;
  isUnlocking?: boolean;
}

export const WorryCard: React.FC<WorryCardProps> = ({
  worry,
  onResolve,
  onDismiss,
  onSnooze,
  onUnlockNow,
  onClick,
  isResolving = false,
  isDismissing = false,
  isSnoozing = false,
  isUnlocking = false,
}) => {
  const getStatusBadge = () => {
    switch (worry.status) {
      case 'locked':
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            🔒 Locked
          </Badge>
        );
      case 'unlocked':
        return (
          <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
            📦 Ready
          </Badge>
        );
      case 'resolved':
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
          >
            ✓ Resolved
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge variant="outline" className="text-muted-foreground">
            ✕ Released
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className="transition-all hover:shadow-md cursor-pointer"
      onClick={() => onClick?.(worry.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium line-clamp-2">{worry.content}</p>
            {worry.action && (
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Action:</span> {worry.action}
              </p>
            )}
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {worry.status === 'locked' && <span>Unlocks {getRelativeTime(worry.unlockAt)}</span>}
          {worry.status === 'unlocked' && worry.unlockedAt && (
            <span>Unlocked {formatDateTime(worry.unlockedAt)}</span>
          )}
          {worry.status === 'resolved' && worry.resolvedAt && (
            <span>Resolved {formatDateTime(worry.resolvedAt)}</span>
          )}
        </div>

        {worry.status === 'locked' && (onUnlockNow || onDismiss) && (
          <>
            <Separator className="my-3" />
            <div className="flex gap-2">
              {onUnlockNow && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnlockNow(worry.id);
                  }}
                  disabled={isUnlocking || isDismissing}
                  className="text-xs"
                >
                  {isUnlocking && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Unlock Now
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(worry.id);
                  }}
                  disabled={isUnlocking || isDismissing}
                  className="text-xs"
                >
                  {isDismissing && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Dismiss
                </Button>
              )}
            </div>
          </>
        )}

        {worry.status === 'unlocked' && (onResolve || onSnooze || onDismiss) && (
          <>
            <Separator className="my-3" />
            <div className="flex gap-2">
              {onResolve && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolve(worry.id);
                  }}
                  disabled={isResolving || isSnoozing || isDismissing}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white"
                >
                  {isResolving && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Mark Done
                </Button>
              )}
              {onSnooze && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      disabled={isResolving || isSnoozing || isDismissing}
                      className="text-xs min-h-[44px]"
                    >
                      {isSnoozing && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                      Snooze
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>Snooze for...</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(worry.id, 30 * 60 * 1000);
                      }}
                      className="min-h-[44px]"
                    >
                      30 minutes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(worry.id, 60 * 60 * 1000);
                      }}
                      className="min-h-[44px]"
                    >
                      1 hour
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(worry.id, 4 * 60 * 60 * 1000);
                      }}
                      className="min-h-[44px]"
                    >
                      4 hours
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(worry.id, 24 * 60 * 60 * 1000);
                      }}
                      className="min-h-[44px]"
                    >
                      1 day
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(worry.id);
                  }}
                  disabled={isResolving || isSnoozing || isDismissing}
                  className="text-xs"
                >
                  {isDismissing && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Dismiss
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
