import { BarChart3, Flame, TrendingDown, XCircle } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { CircularProgress } from '../components/CircularProgress';
import { PageHeader } from '../components/PageHeader';
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
      return lang.insights.timeUnits.day(days);
    }
    return lang.insights.timeUnits.hour(hours);
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <PageHeader title={lang.insights.title} subtitle={lang.insights.subtitle} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-md py-lg space-y-lg">
          {metrics.total === 0 ? (
            <Card>
              <CardContent className="p-lg text-center">
                <BarChart3 className="size-icon-xl mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {lang.insights.empty.title}
                </h2>
                <p className="text-muted-foreground">{lang.insights.empty.message}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Weekly Streak Banner */}
              {metrics.thisWeekResolved > 0 && (
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/20 border-primary/20 animate-in fade-in slide-in-from-top-4">
                  <CardHeader className="p-lg">
                    <div className="flex items-center gap-md">
                      <Flame className="size-icon-xl text-primary" aria-hidden="true" />
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-1">
                          {lang.insights.weeklyStreak.title(metrics.thisWeekResolved)}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {lang.insights.weeklyStreak.message}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}

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
                  <CardHeader className="p-lg">
                    <CardTitle className="text-lg mb-4">
                      {lang.insights.keyInsights.completionRate.title}
                    </CardTitle>
                    <div className="flex items-center gap-lg">
                      <CircularProgress value={metrics.completionRate} />
                      <div className="flex-1">
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
                        <TrendingDown className="size-icon-md text-primary flex-shrink-0 mt-2" />
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            {lang.insights.keyInsights.resolutionRate.title}
                          </CardTitle>
                          <div className="text-3xl font-bold text-primary mb-2">
                            {metrics.resolutionRate}%
                          </div>
                          <CardDescription>
                            {lang.insights.keyInsights.resolutionRate.description(
                              metrics.resolved,
                              metrics.dismissed
                            )}
                          </CardDescription>
                          {metrics.dismissed > metrics.resolved && (
                            <p className="text-sm text-muted-foreground mt-3">
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
                        <XCircle className="size-icon-md text-primary flex-shrink-0 mt-2" />
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            {lang.insights.keyInsights.avgTimeToResolve.title}
                          </CardTitle>
                          <div className="text-3xl font-bold text-primary mb-2">
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
                      <CardTitle className="text-lg mb-2">{lang.insights.thisWeek.title}</CardTitle>
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
