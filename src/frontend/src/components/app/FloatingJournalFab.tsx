import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useFloatingJournalVisibility } from '@/contexts/FloatingJournalVisibilityContext';
import { useNavigate } from '@tanstack/react-router';

export default function FloatingJournalFab() {
  const { isVisible } = useFloatingJournalVisibility();
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <Button
      onClick={() => navigate({ to: '/compose' })}
      size="lg"
      className="fixed fab-bottom-safe right-4 z-[60] h-14 w-14 rounded-full shadow-lg"
      aria-label="New mood"
    >
      <PlusCircle className="h-6 w-6" />
    </Button>
  );
}
