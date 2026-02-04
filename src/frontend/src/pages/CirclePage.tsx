import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShareCodeCard from '@/components/circle/ShareCodeCard';
import JoinByCodeForm from '@/components/circle/JoinByCodeForm';
import PendingRequestsPanel from '@/components/circle/PendingRequestsPanel';
import CircleMembersList from '@/components/circle/CircleMembersList';
import CircleEnergyCard from '@/components/circle/CircleEnergyCard';
import SafePeoplePanel from '@/components/circle/SafePeoplePanel';
import { useGetUnprocessedJoinRequests, useGetFeed } from '@/hooks/useQueries';
import { useSearch } from '@tanstack/react-router';

export default function CirclePage() {
  const { data: requests = [] } = useGetUnprocessedJoinRequests();
  const { data: feed = [] } = useGetFeed();
  const search = useSearch({ from: '/circle' }) as { tab?: string };
  const pendingCount = requests.length;

  // Filter feed to only status posts for Circle Energy
  const statusPosts = feed
    .filter((item) => item.__kind__ === 'status')
    .map((item) => item.status);

  const defaultTab = search.tab === 'safe' ? 'safe' : 'members';

  return (
    <div className="container max-w-2xl py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Circle</h1>
        <p className="text-muted-foreground">Your connections</p>
      </div>

      <CircleEnergyCard posts={statusPosts} />

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="requests">
            Requests{pendingCount > 0 ? ` (${pendingCount})` : ''}
          </TabsTrigger>
          <TabsTrigger value="join">Join</TabsTrigger>
          <TabsTrigger value="safe">Safe</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <CircleMembersList />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <PendingRequestsPanel />
        </TabsContent>

        <TabsContent value="join" className="space-y-4">
          <ShareCodeCard />
          <JoinByCodeForm />
        </TabsContent>

        <TabsContent value="safe" className="space-y-4">
          <SafePeoplePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
