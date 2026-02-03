import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, JoinRequest, StatusPost, Notification } from '@/backend';
import type { Principal } from '@dfinity/principal';

// Profile queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(principal: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getUserProfile(principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserProfiles(principals: Principal[]) {
  const { actor, isFetching } = useActor();

  return useQuery<Record<string, UserProfile>>({
    queryKey: ['userProfiles', principals.map((p) => p.toString()).sort()],
    queryFn: async () => {
      if (!actor) return {};
      const profiles: Record<string, UserProfile> = {};
      await Promise.all(
        principals.map(async (principal) => {
          try {
            const profile = await actor.getUserProfile(principal);
            if (profile) {
              profiles[principal.toString()] = profile;
            }
          } catch {
            // Ignore errors for individual profiles
          }
        })
      );
      return profiles;
    },
    enabled: !!actor && !isFetching && principals.length > 0,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
    },
  });
}

// Share code queries
export function useUpdateShareCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.updateShareCode(code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['joinRequests'] });
    },
  });
}

// Join request queries
export function useJoinCircleFromShareCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.joinCircleFromShareCode(code);
    },
  });
}

export function useGetUnprocessedJoinRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<JoinRequest[]>({
    queryKey: ['joinRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnprocessedJoinRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAcceptJoinRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ from, code }: { from: Principal; code: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.acceptJoinRequest(from, code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['joinRequests'] });
      queryClient.invalidateQueries({ queryKey: ['circleMembers'] });
    },
  });
}

export function useDeclineJoinRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, code }: { user: Principal; code: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.declineJoinRequest(user, code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['joinRequests'] });
    },
  });
}

// Circle queries
export function useGetCircleMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['circleMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCircleMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRemoveCircleMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (member: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.removeCircleMember(member);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circleMembers'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
    },
  });
}

// Status queries
export function usePostStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: StatusPost) => {
      if (!actor) throw new Error('Actor not available');
      await actor.postStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useGetFeed() {
  const { actor, isFetching } = useActor();

  return useQuery<StatusPost[]>({
    queryKey: ['feed'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeed();
    },
    select: (data) => {
      // Ensure stable descending sort by createdAt (newest first)
      return [...data].sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      });
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Poll every 30 seconds for near-real-time updates
  });
}

export function useGetStatus(statusId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<StatusPost | null>({
    queryKey: ['status', statusId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStatus(statusId);
    },
    enabled: !!actor && !isFetching && !!statusId,
  });
}

// Notification queries
export function useGetNotifications() {
  const { actor, isFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000, // Poll every 15 seconds for notifications
  });
}

export function useMarkNotificationAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
