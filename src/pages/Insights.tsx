import { BarChart3, CheckCircle2, TrendingDown, XCircle } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { lang } from '../config/language';
import { useWorryStore } from '../store/worryStore';

export const Insights: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = worries.length;
    const resolved = worries.filter((w) => w.status === 'resolved').length;
    const dismissed = worries.filter((w) => w.status === 'dismissed').length;
    const locked = worries.filter((w) => w.status === 'locked').length;
    const unlocked = worries.filter((w) => w.status === 'unlocked').length;
    const completed = resolved + dismissed;

    // Calculate resolution rate (what % of completed worries were resolved vs dismissed)
    const resolutionRate = completed > 0 ? Math.round((resolved / completed) * 100) : 0;

    // Calculate average time to resolution
    const resolvedWorries = worries.filter(
      (w) => w.status === 'resolved' && w.resolvedAt && w.unlockedAt
    );
    const avgTimeToResolve =
      resolvedWorries.length > 0
        ? resolvedWorries.reduce((sum, w) => {
            if (!w.unlockedAt || !w.resolvedAt) return sum;
            const unlocked = new Date(w.unlockedAt).getTime();
            const resolved = new Date(w.resolvedAt).getTime();
            return sum + (resolved - unlocked);
          }, 0) / resolvedWorries.length
        : 0;

    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Get this week's data
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = worries.filter((w) => new Date(w.createdAt) >= oneWeekAgo);
    const thisWeekResolved = thisWeek.filter((w) => w.status === 'resolved').length;

    return {
      total,
      resolved,
      dismissed,
      locked,
      unlocked,
      completed,
      resolutionRate,
      avgTimeToResolve,
      completionRate,
      thisWeekCount: thisWeek.length,
      thisWeekResolved,
    };
  }, [worries]);

  const formatTimeToResolve = (ms: number) => {
    const hours = Math.round(ms / (1000 * 60 * 60));
    const days = Math.round(hours / 24);

    if (days >= 1) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between px-md py-md max-w-4xl mx-auto w-full">
          <Link to="/" aria-label={lang.aria.back}>
            <svg
              className="size-icon-md text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>{lang.aria.back}</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">{lang.insights.title}</h1>
          <div className="size-icon-md" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-md py-lg space-y-lg">
          {metrics.total === 0 ? (
            <Card>
              <CardContent className="p-lg text-center">
                <BarChart3 className="size-icon-xl mx-auto mb-md text-muted-foreground" />
                <h2 className="text-xl font-semibold text-foreground mb-xs">
                  {lang.insights.empty.title}
                </h2>
                <p className="text-muted-foreground">{lang.insights.empty.message}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-2 gap-md">
                <Card>
                  <CardHeader className="p-md">
                    <CardDescription className="text-sm">
                      {lang.insights.stats.total}
                    </CardDescription>
                    <CardTitle className="text-3xl">{metrics.total}</CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="p-md">
                    <CardDescription className="text-sm">
                      {lang.insights.stats.completed}
                    </CardDescription>
                    <CardTitle className="text-3xl">{metrics.completed}</CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="p-md">
                    <CardDescription className="text-sm">
                      {lang.insights.stats.locked}
                    </CardDescription>
                    <CardTitle className="text-3xl">{metrics.locked}</CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="p-md">
                    <CardDescription className="text-sm">
                      {lang.insights.stats.unlocked}
                    </CardDescription>
                    <CardTitle className="text-3xl">{metrics.unlocked}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Key Insights */}
              <div className="space-y-md">
                <h2 className="text-xl font-semibold text-foreground">
                  {lang.insights.keyInsights.title}
                </h2>

                {/* Completion Rate */}
                <Card>
                  <CardHeader className="p-md">
                    <div className="flex items-start gap-sm">
                      <CheckCircle2 className="size-icon-md text-primary flex-shrink-0 mt-xs" />
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-xs">
                          {lang.insights.keyInsights.completionRate.title}
                        </CardTitle>
                        <div className="text-3xl font-bold text-primary mb-xs">
                          {metrics.completionRate}%
                        </div>
                        <CardDescription>
                          {lang.insights.keyInsights.completionRate.description(
                            metrics.completed,
                            metrics.total
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Resolution vs Dismissal */}
                {metrics.completed > 0 && (
                  <Card>
                    <CardHeader className="p-md">
                      <div className="flex items-start gap-sm">
                        <TrendingDown className="size-icon-md text-primary flex-shrink-0 mt-xs" />
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-xs">
                            {lang.insights.keyInsights.resolutionRate.title}
                          </CardTitle>
                          <div className="text-3xl font-bold text-primary mb-xs">
                            {metrics.resolutionRate}%
                          </div>
                          <CardDescription>
                            {lang.insights.keyInsights.resolutionRate.description(
                              metrics.resolved,
                              metrics.dismissed
                            )}
                          </CardDescription>
                          {metrics.dismissed > metrics.resolved && (
                            <p className="text-sm text-muted-foreground mt-sm">
                              {lang.insights.keyInsights.resolutionRate.insight}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )}

                {/* Average Time to Resolve */}
                {metrics.avgTimeToResolve > 0 && (
                  <Card>
                    <CardHeader className="p-md">
                      <div className="flex items-start gap-sm">
                        <XCircle className="size-icon-md text-primary flex-shrink-0 mt-xs" />
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-xs">
                            {lang.insights.keyInsights.avgTimeToResolve.title}
                          </CardTitle>
                          <div className="text-3xl font-bold text-primary mb-xs">
                            {formatTimeToResolve(metrics.avgTimeToResolve)}
                          </div>
                          <CardDescription>
                            {lang.insights.keyInsights.avgTimeToResolve.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )}

                {/* This Week */}
                {metrics.thisWeekCount > 0 && (
                  <Card>
                    <CardHeader className="p-md">
                      <CardTitle className="text-lg mb-xs">
                        {lang.insights.thisWeek.title}
                      </CardTitle>
                      <CardDescription>
                        {lang.insights.thisWeek.description(
                          metrics.thisWeekCount,
                          metrics.thisWeekResolved
                        )}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
