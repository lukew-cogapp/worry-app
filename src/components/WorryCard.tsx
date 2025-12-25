import { ActionSheetButtonStyle } from '@capacitor/action-sheet';
import {
  CheckCircle2,
  Edit3,
  Loader2,
  Lock,
  Package,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { SNOOZE_DURATIONS } from '../config/constants';
import { lang } from '../config/language';
import type { Worry } from '../types';
import { showActionSheet } from '../utils/actionSheet';
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
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  isResolving?: boolean;
  isDismissing?: boolean;
  isSnoozing?: boolean;
  isUnlocking?: boolean;
}

const WorryCardComponent: React.FC<WorryCardProps> = ({
  worry,
  onResolve,
  onDismiss,
  onSnooze,
  onUnlockNow,
  onEdit,
  onDelete,
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
          <Badge
            variant="secondary"
            className="bg-[hsl(var(--status-locked-bg))] text-[hsl(var(--status-locked-fg))] border-[hsl(var(--status-locked-border))]"
          >
            <Lock className="size-icon-xs mr-xs" />
            {lang.worryCard.status.locked}
          </Badge>
        );
      case 'unlocked':
        return (
          <Badge
            variant="secondary"
            className="bg-[hsl(var(--status-ready-bg))] text-[hsl(var(--status-ready-fg))] border-[hsl(var(--status-ready-border))]"
          >
            <Package className="size-icon-xs mr-xs" />
            {lang.worryCard.status.ready}
          </Badge>
        );
      case 'resolved':
        return (
          <Badge
            variant="secondary"
            className="bg-[hsl(var(--status-resolved-bg))] text-[hsl(var(--status-resolved-fg))] border-[hsl(var(--status-resolved-border))]"
          >
            <CheckCircle2 className="size-icon-xs mr-xs" />
            {lang.worryCard.status.resolved}
          </Badge>
        );
      case 'dismissed':
        // Check if it was released (user let go of something they can't control)
        if (worry.releasedAt) {
          return (
            <Badge
              variant="secondary"
              className="bg-[hsl(var(--status-released-bg))] text-[hsl(var(--status-released-fg))] border-[hsl(var(--status-released-border))]"
            >
              <Sparkles className="size-icon-xs mr-xs" />
              {lang.worryCard.status.released}
            </Badge>
          );
        }
        // Regular dismissal
        return (
          <Badge
            variant="secondary"
            className="bg-[hsl(var(--status-dismissed-bg))] text-[hsl(var(--status-dismissed-fg))] border-[hsl(var(--status-dismissed-border))]"
          >
            <XCircle className="size-icon-xs mr-xs" />
            {lang.worryCard.status.dismissed}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className="transition-all duration-300 ease-out shadow-card hover:shadow-lg cursor-pointer active:scale-[0.98] active:shadow-sm"
      onClick={() => onClick?.(worry.id)}
    >
      <CardContent className="p-md">
        <div className="flex items-start justify-between gap-sm mb-sm">
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium line-clamp-2">{worry.content}</p>
            {worry.action && (
              <p className="text-sm text-muted-foreground mt-xs">
                <span className="font-medium">{lang.worryCard.labels.action}</span> {worry.action}
              </p>
            )}
            {worry.resolutionNote && (
              <p className="text-sm text-muted-foreground mt-xs">
                <span className="font-medium">{lang.worryCard.labels.resolution}</span>{' '}
                {worry.resolutionNote}
              </p>
            )}
          </div>
          <div className="flex items-center gap-xs">
            {getStatusBadge()}
            {onEdit && (worry.status === 'locked' || worry.status === 'unlocked') && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(worry.id);
                }}
                className="min-h-touch-target min-w-touch-target text-muted-foreground hover:text-foreground"
                aria-label={lang.aria.editWorry}
              >
                <Edit3 className="size-icon-sm" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(worry.id);
                }}
                className="min-h-touch-target min-w-touch-target text-muted-foreground hover:text-destructive"
                aria-label={lang.aria.delete}
              >
                <Trash2 className="size-icon-sm" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-xs text-xs text-muted-foreground">
          {worry.status === 'locked' && (
            <span>{lang.worryCard.labels.unlocks(getRelativeTime(worry.unlockAt))}</span>
          )}
          {worry.status === 'unlocked' && worry.unlockedAt && (
            <span>{lang.worryCard.labels.unlocked(formatDateTime(worry.unlockedAt))}</span>
          )}
          {worry.status === 'resolved' && worry.resolvedAt && (
            <span>{lang.worryCard.labels.resolved(formatDateTime(worry.resolvedAt))}</span>
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
                  {isUnlocking && <Loader2 className="mr-2 size-icon-xs animate-spin" />}
                  {lang.worryCard.buttons.unlockNow}
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
                  {isDismissing && <Loader2 className="mr-2 size-icon-xs animate-spin" />}
                  {lang.worryCard.buttons.dismiss}
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
                  className="text-xs bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                >
                  {isResolving && <Loader2 className="mr-2 size-icon-xs animate-spin" />}
                  {lang.worryCard.buttons.markDone}
                </Button>
              )}
              {onSnooze && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async (e) => {
                        e.stopPropagation();
                        // Try native action sheet first (iOS/Android)
                        const showedNative = await showActionSheet(
                          [
                            {
                              title: lang.worryCard.snooze.thirtyMin,
                              onClick: () => onSnooze(worry.id, SNOOZE_DURATIONS.THIRTY_MINUTES),
                            },
                            {
                              title: lang.worryCard.snooze.oneHour,
                              onClick: () => onSnooze(worry.id, SNOOZE_DURATIONS.ONE_HOUR),
                            },
                            {
                              title: lang.worryCard.snooze.fourHours,
                              onClick: () => onSnooze(worry.id, SNOOZE_DURATIONS.FOUR_HOURS),
                            },
                            {
                              title: lang.worryCard.snooze.oneDay,
                              onClick: () => onSnooze(worry.id, SNOOZE_DURATIONS.ONE_DAY),
                            },
                            {
                              title: 'Cancel',
                              onClick: () => {},
                              style: ActionSheetButtonStyle.Cancel,
                            },
                          ],
                          lang.worryCard.buttons.snoozeOptions
                        );
                        // If not native, dropdown will open automatically
                        if (showedNative) {
                          // Prevent dropdown from opening
                          e.preventDefault();
                        }
                      }}
                      disabled={isResolving || isSnoozing || isDismissing}
                      className="text-xs min-h-touch-target"
                    >
                      {isSnoozing && <Loader2 className="mr-2 size-icon-xs animate-spin" />}
                      {lang.worryCard.buttons.snooze}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>{lang.worryCard.buttons.snoozeOptions}</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(worry.id, SNOOZE_DURATIONS.THIRTY_MINUTES);
                      }}
                      className="min-h-touch-target"
                    >
                      {lang.worryCard.snooze.thirtyMin}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(worry.id, SNOOZE_DURATIONS.ONE_HOUR);
                      }}
                      className="min-h-touch-target"
                    >
                      {lang.worryCard.snooze.oneHour}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(worry.id, SNOOZE_DURATIONS.FOUR_HOURS);
                      }}
                      className="min-h-touch-target"
                    >
                      {lang.worryCard.snooze.fourHours}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(worry.id, SNOOZE_DURATIONS.ONE_DAY);
                      }}
                      className="min-h-touch-target"
                    >
                      {lang.worryCard.snooze.oneDay}
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
                  {isDismissing && <Loader2 className="mr-2 size-icon-xs animate-spin" />}
                  {lang.worryCard.buttons.dismiss}
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Memoize component to prevent unnecessary re-renders in lists
export const WorryCard = React.memo(WorryCardComponent);
