import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, Users, PlusCircle, Bell } from 'lucide-react';
import { useGetNotifications } from '@/hooks/useQueries';

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: notifications } = useGetNotifications();

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const navItems = [
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/circle', icon: Users, label: 'Circle' },
    { path: '/compose', icon: PlusCircle, label: 'Post' },
    { path: '/notifications', icon: Bell, label: 'Alerts', badge: unreadCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around px-1 py-1.5">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className="relative flex-1 flex-col gap-0.5 h-auto py-2 px-2"
              onClick={() => navigate({ to: item.path })}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute right-1 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
