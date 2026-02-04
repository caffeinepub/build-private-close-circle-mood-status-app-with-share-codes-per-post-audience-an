import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import type { StatusPost } from '@/backend';
import { generateCircleEnergySummary } from '@/utils/circleEnergy';

interface CircleEnergyCardProps {
  posts: StatusPost[];
}

export default function CircleEnergyCard({ posts }: CircleEnergyCardProps) {
  const summary = generateCircleEnergySummary(posts);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Circle Energy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  );
}
