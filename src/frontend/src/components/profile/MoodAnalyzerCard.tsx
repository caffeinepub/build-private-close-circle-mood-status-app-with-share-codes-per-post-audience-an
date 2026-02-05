import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { analyzeMoodPatterns } from '@/utils/moodAnalysis';
import { presentMood, MOODS } from '@/constants/moods';
import MicroActionsPanel from './MicroActionsPanel';
import ProgressiveDisclosure from '@/components/common/ProgressiveDisclosure';
import type { Mood } from '@/backend';

export default function MoodAnalyzerCard() {
  const [timeframe, setTimeframe] = useState<number>(14);
  const { moodHistory, isLoading } = useMoodHistory(timeframe);

  const analysis = analyzeMoodPatterns(
    moodHistory.map((entry) => entry.mood),
    timeframe
  );

  const getTrendIcon = () => {
    switch (analysis.trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-orange-600" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getConcernBadge = () => {
    switch (analysis.concernLevel) {
      case 'elevated':
        return <Badge variant="destructive">Frequent Low</Badge>;
      case 'moderate':
        return <Badge className="bg-orange-600">Some Low</Badge>;
      case 'mild':
        return <Badge className="bg-yellow-600">Mixed</Badge>;
      default:
        return <Badge variant="outline">Varied</Badge>;
    }
  };

  // Get top moods for display from catalog (sorted by count, show top 10)
  // Only include moods from the catalog, not the __unknown__ bucket
  const topMoods = MOODS.map((moodOption) => ({
    mood: moodOption.value,
    count: analysis.distribution[moodOption.value] || 0,
    label: moodOption.label,
    emoji: moodOption.emoji,
  }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item) => ({
      mood: item.mood,
      count: item.count,
      label: item.label,
      emoji: item.emoji,
      percentage: analysis.totalEntries > 0 ? (item.count / analysis.totalEntries) * 100 : 0,
    }));

  // Handle unknown moods if present
  const unknownCount = analysis.distribution['__unknown__'] || 0;
  if (unknownCount > 0) {
    const unknownPercentage = analysis.totalEntries > 0 ? (unknownCount / analysis.totalEntries) * 100 : 0;
    topMoods.push({
      mood: 'neutral' as Mood, // Use neutral as placeholder
      count: unknownCount,
      label: 'Unknown',
      emoji: '😐',
      percentage: unknownPercentage,
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Analyzer</CardTitle>
                <CardDescription>Patterns from your moods</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Timeframe</label>
            <Select value={timeframe.toString()} onValueChange={(val) => setTimeframe(Number(val))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Entries</p>
                  <p className="text-2xl font-semibold">{analysis.totalEntries}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Trend</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon()}
                    <p className="text-sm font-medium capitalize">{analysis.trend.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Pattern</p>
                {getConcernBadge()}
              </div>

              {analysis.totalEntries > 0 && topMoods.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Top Moods</p>
                    <div className="space-y-2">
                      {topMoods.map((item) => (
                        <div key={item.mood} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span>{item.emoji}</span>
                              <span>{item.label}</span>
                            </span>
                            <span className="text-muted-foreground">
                              {item.count} ({item.percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-medium">Observations</p>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{analysis.guidance}</p>
                </div>
              </div>

              <ProgressiveDisclosure trigger="Disclaimer">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs leading-relaxed">{analysis.disclaimer}</AlertDescription>
                </Alert>
              </ProgressiveDisclosure>
            </>
          )}
        </CardContent>
      </Card>

      {!isLoading && <MicroActionsPanel moodHistory={moodHistory} />}
    </div>
  );
}
