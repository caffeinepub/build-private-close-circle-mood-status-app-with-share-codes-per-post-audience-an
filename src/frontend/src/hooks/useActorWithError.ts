import { useActor } from './useActor';
import { useQuery } from '@tanstack/react-query';

/**
 * Extended actor hook that exposes error state and refetch capability
 * This wraps the base useActor hook to add error handling without modifying the generated file
 */
export function useActorWithError() {
  const baseActor = useActor();
  
  // Create a query that tracks the actor state with error handling
  const actorStateQuery = useQuery({
    queryKey: ['actorState', baseActor.actor ? 'ready' : 'pending'],
    queryFn: async () => {
      if (!baseActor.actor && !baseActor.isFetching) {
        throw new Error('Actor initialization failed');
      }
      return baseActor.actor;
    },
    enabled: !baseActor.isFetching,
    retry: false,
    staleTime: Infinity,
  });

  return {
    actor: baseActor.actor,
    isFetching: baseActor.isFetching,
    isError: actorStateQuery.isError && !baseActor.isFetching && !baseActor.actor,
    error: actorStateQuery.error,
    refetch: actorStateQuery.refetch,
  };
}
