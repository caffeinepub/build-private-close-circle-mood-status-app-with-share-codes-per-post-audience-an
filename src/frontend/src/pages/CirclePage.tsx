import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShareCodeCard from '@/components/circle/ShareCodeCard';
import JoinByCodeForm from '@/components/circle/JoinByCodeForm';
import PendingRequestsPanel from '@/components/circle/PendingRequestsPanel';
import CircleMembersList from '@/components/circle/CircleMembersList';
import { useGetUnprocessedJoinRequests } from '@/hooks/useQueries';

export default function CirclePage() {
  const { data: requests = [] } = useGetUnprocessedJoinRequests();
  const pendingCount = requests.length;

  return (
    <div className="container max-w-2xl py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Circle</h1>
        <p className="text-muted-foreground">Manage your trusted connections</p>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="requests">
            Requests{pendingCount > 0 ? ` (${pendingCount})` : ''}
          </TabsTrigger>
          <TabsTrigger value="join">Join</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
