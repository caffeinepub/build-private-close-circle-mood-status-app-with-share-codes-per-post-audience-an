import { useMemo } from 'react';
import { useGetFeed } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';
import type { Mood } from '@/backend';
import { timeToDate } from '@/utils/time';

export interface MoodHistoryEntry {
  mood: Mood;
  date: Date;
  content: string;
}

export function useMoodHistory(timeframeDays: number) {
  const { data: feed = [], isLoading } = useGetFeed();
  const { identity } = useInternetIdentity();

  const moodHistory = useMemo(() => {
    if (!identity) return [];

    const currentPrincipal = identity.getPrincipal().toString();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);

    // Filter to current user's posts within timeframe
    const userPosts = feed.filter((post) => {
      const postDate = timeToDate(post.createdAt);
      return post.author.toString() === currentPrincipal && postDate >= cutoffDate;
    });

    // Sort by createdAt ascending (oldest-to-newest) for chronological trend analysis
    const sortedPosts = userPosts.sort((a, b) => {
      const aTime = Number(a.createdAt);
      const bTime = Number(b.createdAt);
      return aTime - bTime;
    });

    // Map to mood history entries
    return sortedPosts.map((post) => ({
      mood: post.mood,
      date: timeToDate(post.createdAt),
      content: post.content,
    }));
  }, [feed, identity, timeframeDays]);

  return {
    moodHistory,
    isLoading,
  };
}
