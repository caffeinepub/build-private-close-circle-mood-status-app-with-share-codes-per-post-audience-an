import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, JoinRequest, StatusPost, Notification, FeedItem, SilentSignal, Mood, Avatar, UploadedAvatar, PendingRequestWithProfile, UpdateUserProfile, ConnectionWhyExplanation } from '@/backend';
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
    mutationFn: async (updates: UpdateUserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProfile(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
    },
  });
}

// Avatar mutations
export function useUploadAvatar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatar: UploadedAvatar) => {
      if (!actor) throw new Error('Actor not available');
      await actor.uploadAvatar(avatar);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
    },
  });
}

export function useSelectSystemAvatar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.selectSystemAvatar(avatarId);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.joinCircleFromShareCode(code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circlesImIn'] });
    },
  });
}

export function useGetUnprocessedJoinRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingRequestWithProfile[]>({
    queryKey: ['joinRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnprocessedJoinRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Poll every 30 seconds for circle activity
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
      queryClient.invalidateQueries({ queryKey: ['circlesImIn'] });
      queryClient.invalidateQueries({ queryKey: ['closestConnections'] });
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
    refetchInterval: 30000, // Poll every 30 seconds for circle activity
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
      queryClient.invalidateQueries({ queryKey: ['circlesImIn'] });
      queryClient.invalidateQueries({ queryKey: ['closestConnections'] });
    },
  });
}

// Circles I'm in query
export function useGetCirclesImInOwners() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<{ principal: Principal; profile: UserProfile }>>({
    queryKey: ['circlesImIn'],
    queryFn: async () => {
      if (!actor) return [];
      const ownerPrincipals = await actor.getCallerCircleOwners();
      
      // Fetch profiles for all owners
      const ownersWithProfiles = await Promise.all(
        ownerPrincipals.map(async (principal) => {
          try {
            const profile = await actor.getUserProfile(principal);
            if (profile) {
              return { principal, profile };
            }
            return null;
          } catch {
            return null;
          }
        })
      );

      // Filter out any null results
      return ownersWithProfiles.filter((item): item is { principal: Principal; profile: UserProfile } => item !== null);
    },
    enabled: !!actor && !isFetching,
  });
}

// Pulse queries
export function useGetCallerPulseScore() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['callerPulseScore'],
    queryFn: async () => {
      if (!actor) return 0;
      const score = await actor.getCallerPulseScore();
      return Number(score);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserPulseScore(user: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['userPulseScore', user.toString()],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        const score = await actor.getUserPulseScore(user);
        return Number(score);
      } catch {
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserPulseScores(users: Principal[]) {
  const { actor, isFetching } = useActor();

  return useQuery<Record<string, number>>({
    queryKey: ['userPulseScores', users.map((u) => u.toString()).sort()],
    queryFn: async () => {
      if (!actor) return {};
      const scores: Record<string, number> = {};
      await Promise.all(
        users.map(async (user) => {
          try {
            const score = await actor.getUserPulseScore(user);
            scores[user.toString()] = Number(score);
          } catch {
            scores[user.toString()] = 0;
          }
        })
      );
      return scores;
    },
    enabled: !!actor && !isFetching && users.length > 0,
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
      queryClient.invalidateQueries({ queryKey: ['status'] });
      queryClient.invalidateQueries({ queryKey: ['callerPulseScore'] });
      queryClient.invalidateQueries({ queryKey: ['userPulseScores'] });
      queryClient.invalidateQueries({ queryKey: ['closestConnections'] });
    },
  });
}

export function useGetFeed() {
  const { actor, isFetching } = useActor();

  return useQuery<FeedItem[]>({
    queryKey: ['feed'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeed();
    },
    select: (data) => {
      // Ensure stable descending sort by createdAt (newest first)
      return [...data].sort((a, b) => {
        const aTime = a.__kind__ === 'status' ? a.status.createdAt : a.silentSignal.createdAt;
        const bTime = b.__kind__ === 'status' ? b.status.createdAt : b.silentSignal.createdAt;
        if (aTime > bTime) return -1;
        if (aTime < bTime) return 1;
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

// Closest Connections query
export function useGetClosestConnections() {
  const { actor, isFetching } = useActor();

  return useQuery<ConnectionWhyExplanation[]>({
    queryKey: ['closestConnections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBestCircleConnectionsWithWhyExplanation();
    },
    enabled: !!actor && !isFetching,
  });
}

// Safe People queries
export function useGetEligibleSafePeopleCandidates() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['safePeopleCandidates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEligibleSafePeopleCandidates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSafePeople() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['safePeople'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSafePeople();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetSafePerson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (person: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setSafePerson(person);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safePeople'] });
      queryClient.invalidateQueries({ queryKey: ['safePeopleCandidates'] });
    },
  });
}

export function useUnsetSafePerson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (person: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.unsetSafePerson(person);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safePeople'] });
      queryClient.invalidateQueries({ queryKey: ['safePeopleCandidates'] });
    },
  });
}

// Silent Signal queries
export function usePostSilentSignal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mood, content }: { mood: Mood; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.postSilentSignal(mood, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
