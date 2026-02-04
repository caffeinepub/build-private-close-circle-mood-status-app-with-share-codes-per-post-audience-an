import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, Lightbulb } from 'lucide-react';
import type { MoodHistoryEntryWithTags } from '@/utils/microActions';
import { generateMicroActionSuggestions, getMicroActionsDisclaimer } from '@/utils/microActions';

interface PostStatusPrivateNotePromptProps {
  isOpen: boolean;
  onOpenJournal: () => void;
  onDismiss: () => void;
  moodHistory?: MoodHistoryEntryWithTags[];
}

export default function PostStatusPrivateNotePrompt({
  isOpen,
  onOpenJournal,
  onDismiss,
  moodHistory = [],
}: PostStatusPrivateNotePromptProps) {
  const suggestion = generateMicroActionSuggestions(moodHistory);

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
      <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Private Reflection</AlertDialogTitle>
          <AlertDialogDescription>
            Want to write a private note about this?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {suggestion && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Tiny actions you might try</p>
              </div>
              <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
              <div className="space-y-2">
                {suggestion.actions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start gap-2 rounded-lg border p-2.5 bg-muted/30"
                  >
                    <Badge variant="outline" className="text-xs mt-0.5">
                      ≤2 min
                    </Badge>
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
            </div>
          </>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDismiss}>Not now</AlertDialogCancel>
          <AlertDialogAction onClick={onOpenJournal}>Yes, write a note</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
