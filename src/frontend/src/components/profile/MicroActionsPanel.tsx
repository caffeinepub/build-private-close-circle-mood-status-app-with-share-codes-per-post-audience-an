import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Info } from 'lucide-react';
import type { MoodHistoryEntryWithTags } from '@/utils/microActions';
import { generateMicroActionSuggestions, getMicroActionsDisclaimer } from '@/utils/microActions';

interface MicroActionsPanelProps {
  moodHistory: MoodHistoryEntryWithTags[];
  className?: string;
}

export default function MicroActionsPanel({ moodHistory, className }: MicroActionsPanelProps) {
  const suggestion = generateMicroActionSuggestions(moodHistory);

  // Insufficient data fallback
  if (!suggestion) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Tiny Actions</CardTitle>
              <CardDescription>Small ideas based on your patterns</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Keep checking in with moods and context tags to see personalized suggestions here.
            </AlertDescription>
          </Alert>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {getMicroActionsDisclaimer()}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Tiny Actions</CardTitle>
            <CardDescription>{suggestion.reason}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {suggestion.actions.map((action) => (
            <div
              key={action.id}
              className="flex items-start gap-3 rounded-lg border p-3 bg-muted/30"
            >
              <div className="mt-0.5">
                <Badge variant="outline" className="text-xs">
                  ≤2 min
                </Badge>
              </div>
              <p className="text-sm flex-1 leading-relaxed">{action.text}</p>
            </div>
          ))}
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs leading-relaxed">
            {getMicroActionsDisclaimer()}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
