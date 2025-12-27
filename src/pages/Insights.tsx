import { BarChart3, Flame, TrendingDown, XCircle } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { CircularProgress } from '../components/CircularProgress';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { lang } from '../config/language';
import { useWorryStore } from '../store/worryStore';
import type { WorryCategory } from '../types';
import { calculateWorryMetrics, formatTimeToResolve } from '../utils/metrics';

export const Insights: React.FC = () => {
  const worries = useWorryStore((s) => s.worries);

  const metrics = useMemo(() => calculateWorryMetrics(worries), [worries]);

  const formattedAvgTime = formatTimeToResolve(
    metrics.avgTimeToResolve,
    lang.insights.timeUnits.day,
    lang.insights.timeUnits.hour
  );

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <PageHeader title={lang.insights.title} subtitle={lang.insights.subtitle} />
      <main className="flex-1 overflow-y-auto">
        <PageContainer className="py-lg space-y-lg" withBottomPadding>
          {metrics.total === 0 ? (
            <Card>
              <CardContent className="p-lg text-center">
                <BarChart3 className="size-icon-xl mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-foreground mb-2">{lang.insights.empty.title}</h2>
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
                        <CardTitle className="text-2xl mb-1 tracking-tight">
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
                <h2 className="text-foreground">{lang.insights.keyInsights.title}</h2>

                {/* Completion Rate */}
                <Card>
                  <CardHeader className="p-lg">
                    <CardTitle className="text-lg mb-4 tracking-tight">
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
                          <CardTitle className="text-lg mb-2 tracking-tight">
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
                          <CardTitle className="text-lg mb-2 tracking-tight">
                            {lang.insights.keyInsights.avgTimeToResolve.title}
                          </CardTitle>
                          <div className="text-3xl font-bold text-primary mb-2">
                            {formattedAvgTime}
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
                      <CardTitle className="text-lg mb-2 tracking-tight">
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

                {/* Category Breakdown */}
                {Object.keys(metrics.categoryBreakdown).length > 0 && (
                  <Card>
                    <CardHeader className="p-md">
                      <CardTitle className="text-lg mb-3 tracking-tight">
                        {lang.insights.categoryBreakdown.title}
                      </CardTitle>
                      <div className="space-y-3">
                        {Object.entries(metrics.categoryBreakdown)
                          .sort(([, a], [, b]) => b - a)
                          .map(([category, count]) => {
                            const percentage = Math.round((count / metrics.total) * 100);
                            const categoryLabel =
                              category === 'uncategorized'
                                ? lang.insights.categoryBreakdown.uncategorized
                                : lang.categories[category as WorryCategory];

                            return (
                              <div key={category} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium text-foreground">
                                    {categoryLabel}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {count} ({percentage}%)
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CardHeader>
                  </Card>
                )}
              </div>
            </>
          )}
        </PageContainer>
      </main>
    </div>
  );
};
