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
import React, { useState } from 'react';
import { lang } from '../config/language';
import type { Worry } from '../types';
import { formatDateTime, getRelativeTime } from '../utils/dates';
import { SnoozeSheet } from './SnoozeSheet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
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
  const [showSnoozeSheet, setShowSnoozeSheet] = useState(false);

  const getStatusBadge = () => {
    switch (worry.status) {
      case 'locked':
        return (
          <Badge
            variant="secondary"
            className="bg-status-locked text-status-locked-foreground border-status-locked-border"
          >
            <Lock className="size-icon-xs mr-xs" />
            {lang.worryCard.status.locked}
          </Badge>
        );
      case 'unlocked':
        return (
          <Badge
            variant="secondary"
            className="bg-status-ready text-status-ready-foreground border-status-ready-border"
          >
            <Package className="size-icon-xs mr-xs" />
            {lang.worryCard.status.ready}
          </Badge>
        );
      case 'resolved':
        return (
          <Badge
            variant="secondary"
            className="bg-status-resolved text-status-resolved-foreground border-status-resolved-border"
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
              className="bg-status-released text-status-released-foreground border-status-released-border"
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
            className="bg-status-dismissed text-status-dismissed-foreground border-status-dismissed-border"
          >
            <XCircle className="size-icon-xs mr-xs" />
            {lang.worryCard.status.dismissed}
          </Badge>
        );
      default:
        return null;
    }
  };

  const isClickable = Boolean(onClick);

  return (
    <>
      <Card
        className={`transition-all duration-300 ease-out active:scale-[0.98] active:shadow-sm ${
          isClickable ? 'cursor-pointer' : ''
        }`}
        onClick={() => onClick?.(worry.id)}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={(event) => {
          if (!isClickable) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick?.(worry.id);
          }
        }}
      >
        <CardContent className="p-md">
          <div className="flex items-start justify-between gap-sm mb-sm">
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium line-clamp-2">{worry.content}</p>
              {worry.action && (
                <p className="text-sm text-muted-foreground mt-xs leading-relaxed">
                  <span className="font-medium">{lang.worryCard.labels.action}</span> {worry.action}
                </p>
              )}
              {worry.resolutionNote && (
                <p className="text-sm text-muted-foreground mt-xs leading-relaxed">
                  <span className="font-medium">{lang.worryCard.labels.resolution}</span>{' '}
                  {worry.resolutionNote}
                </p>
              )}
              {worry.category && (
                <div className="mt-xs">
                  <Badge variant="outline" className="text-xs">
                    {lang.categories[worry.category]}
                  </Badge>
                </div>
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
                  className="min-h-touch-target min-w-touch-target text-muted-foreground active:text-foreground"
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
                  className="min-h-touch-target min-w-touch-target text-muted-foreground active:text-destructive"
                  aria-label={lang.aria.delete}
                >
                  <Trash2 className="size-icon-sm" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-xs text-caption">
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
                    className="text-sm"
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
                    className="text-sm"
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
                    className="text-sm"
                  >
                    {isResolving && <Loader2 className="mr-2 size-icon-xs animate-spin" />}
                    {lang.worryCard.buttons.markDone}
                  </Button>
                )}
                {onSnooze && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSnoozeSheet(true);
                    }}
                    disabled={isResolving || isSnoozing || isDismissing}
                    className="text-sm min-h-touch-target"
                  >
                    {isSnoozing && <Loader2 className="mr-2 size-icon-xs animate-spin" />}
                    {lang.worryCard.buttons.snooze}
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
                    disabled={isResolving || isSnoozing || isDismissing}
                    className="text-sm"
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

      {/* Snooze Sheet */}
      {onSnooze && (
        <SnoozeSheet
          open={showSnoozeSheet}
          onOpenChange={setShowSnoozeSheet}
          onSnooze={(durationMs) => onSnooze(worry.id, durationMs)}
        />
      )}
    </>
  );
};

// Memoize component to prevent unnecessary re-renders in lists
export const WorryCard = React.memo(WorryCardComponent);
