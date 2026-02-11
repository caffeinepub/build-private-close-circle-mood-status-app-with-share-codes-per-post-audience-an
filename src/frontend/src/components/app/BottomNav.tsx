import { useNavigate, useLocation } from '@tanstack/react-router';
import { Home, Users, Bell, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGetNotifications } from '@/hooks/useQueries';
import IconActionButton from '@/components/common/IconActionButton';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: notifications = [] } = useGetNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/circle', icon: Users, label: 'Circle' },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container max-w-2xl mx-auto px-4 pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ path, icon: Icon, label, badge }) => (
            <IconActionButton
              key={path}
              icon={
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive(path) ? 'text-primary' : 'text-muted-foreground'}`} />
                  {badge !== undefined && badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {badge > 9 ? '9+' : badge}
                    </Badge>
                  )}
                </div>
              }
              label={label}
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: path })}
              className={isActive(path) ? 'bg-primary/10' : ''}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
