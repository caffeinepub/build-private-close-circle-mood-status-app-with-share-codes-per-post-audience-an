import { BookOpen, LogOut, User } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APP_NAME } from '@/constants/branding';
import { useJournalOverlayController } from '@/contexts/JournalOverlayControllerContext';
import IconActionButton from '@/components/common/IconActionButton';
import ThemeToggleButton from './ThemeToggleButton';

export default function AppHeader() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openJournal } = useJournalOverlayController();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleProfile = () => {
    navigate({ to: '/profile' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container max-w-2xl mx-auto flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-semibold">{APP_NAME}</h1>
        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          <IconActionButton
            icon={<BookOpen className="h-5 w-5" />}
            label="Open journal"
            variant="ghost"
            size="icon"
            onClick={() => openJournal()}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconActionButton
                icon={<User className="h-5 w-5" />}
                label="User menu"
                variant="ghost"
                size="icon"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
