import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lock, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGetJournalEntriesForDate, useCreateOrUpdateJournalEntry, useDeleteJournalEntry } from '@/hooks/useJournal';
import { isToday, isPastDate, timeToDate } from '@/utils/time';
import type { JournalEntry } from '@/backend';

interface JournalEntriesPanelProps {
  selectedDate: Date;
}

export default function JournalEntriesPanel({ selectedDate }: JournalEntriesPanelProps) {
  const { data: entries = [], isLoading } = useGetJournalEntriesForDate(selectedDate);
  const createOrUpdate = useCreateOrUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const [newEntryContent, setNewEntryContent] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const isTodaySelected = isToday(selectedDate);
  const isPast = isPastDate(selectedDate);
  const canEdit = isTodaySelected;

  useEffect(() => {
    setIsAddingNew(false);
    setNewEntryContent('');
  }, [selectedDate]);

  const handleSaveEntry = async () => {
    if (!newEntryContent.trim()) {
      toast.error('Entry cannot be empty');
      return;
    }

    try {
      await createOrUpdate.mutateAsync(newEntryContent.trim());
      toast.success('Journal entry saved');
      setNewEntryContent('');
      setIsAddingNew(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save entry');
    }
  };

  const handleDeleteEntry = async (entry: JournalEntry) => {
    try {
      await deleteEntry.mutateAsync(entry.date);
      toast.success('Entry deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete entry');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isPast && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            This date has passed. You can view past entries but cannot create or edit them.
          </AlertDescription>
        </Alert>
      )}

      {entries.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="py-8 text-center space-y-2">
            <p className="text-muted-foreground">
              {canEdit ? 'No entries for today yet.' : 'No entries for this date.'}
            </p>
            {canEdit && (
              <>
                <p className="text-sm text-muted-foreground/80">Want to leave one sentence?</p>
                <p className="text-xs text-muted-foreground/70">No words is okay too.</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {entries.length > 0 && (
        <ScrollArea className="h-[300px]">
          <div className="space-y-4 pr-4">
            {entries.map((entry, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {timeToDate(entry.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {timeToDate(entry.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry)}
                        disabled={deleteEntry.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {canEdit && (
        <>
          {entries.length > 0 && <Separator />}

          {isAddingNew ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">New Entry</CardTitle>
                <CardDescription className="text-xs">Want to leave one sentence? No words is okay too.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Write your thoughts..."
                  value={newEntryContent}
                  onChange={(e) => setNewEntryContent(e.target.value)}
                  rows={6}
                  className="resize-none"
                  autoFocus
                />
                <div className="flex gap-2 sticky bottom-0 bg-card pt-2">
                  <Button onClick={handleSaveEntry} disabled={createOrUpdate.isPending} size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    {createOrUpdate.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingNew(false)} size="sm">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button onClick={() => setIsAddingNew(true)} variant="outline" className="w-full sticky bottom-0">
              <Plus className="mr-2 h-4 w-4" />
              Add New Entry
            </Button>
          )}
        </>
      )}
    </div>
  );
}
