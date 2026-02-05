import { useGetNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import ProgressiveDisclosure from '@/components/common/ProgressiveDisclosure';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useGetNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const navigate = useNavigate();

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await markAsReadMutation.mutateAsync(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        toast.error('Failed to mark notification as read');
      }
    }

    // Navigate if there's a status link
    if (notification.statusId) {
      navigate({ to: '/status/$statusId', params: { statusId: notification.statusId } });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Helper to display notification message with fallback for requesterName
  const getNotificationMessage = (notification: typeof notifications[0]) => {
    // If requesterName is available and message contains "Unknown user", replace it
    if (notification.requesterName && notification.message.includes('Unknown user')) {
      return notification.message.replace('Unknown user', notification.requesterName);
    }
    return notification.message;
  };

  return (
    <div className="container max-w-2xl py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay updated</p>
      </div>

      <ProgressiveDisclosure trigger="Push Notifications — Coming soon" variant="default">
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Real-time push notifications to your device are in development.
          </p>
        </div>
      </ProgressiveDisclosure>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <BellOff className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {unreadNotifications.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  New ({unreadNotifications.length})
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                  className="gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark all as read'}
                </Button>
              </div>
              {unreadNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className="cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-colors"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{getNotificationMessage(notification)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(Number(notification.createdAt) / 1_000_000, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <Badge variant="default">New</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {readNotifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-muted-foreground">Earlier</h2>
              {readNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-muted-foreground">{getNotificationMessage(notification)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(Number(notification.createdAt) / 1_000_000, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
