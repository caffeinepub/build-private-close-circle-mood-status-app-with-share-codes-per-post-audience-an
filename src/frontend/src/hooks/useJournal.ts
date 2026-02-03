import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { JournalEntry, Time } from '@/backend';
import { dateToTime, getStartOfDay, getEndOfDay } from '@/utils/time';

export function useGetJournalEntriesForDate(date: Date) {
  const { actor, isFetching } = useActor();
  const startTime = dateToTime(getStartOfDay(date));
  const endTime = dateToTime(getEndOfDay(date));

  return useQuery<JournalEntry[]>({
    queryKey: ['journalEntries', date.toDateString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEntriesByRange(startTime, endTime);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllJournalEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<JournalEntry[]>({
    queryKey: ['allJournalEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJournalEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrUpdateJournalEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createOrUpdateJournalEntry(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['allJournalEntries'] });
    },
  });
}

export function useDeleteJournalEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: Time) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteJournalEntry(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['allJournalEntries'] });
    },
  });
}
