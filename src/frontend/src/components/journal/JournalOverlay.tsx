import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import JournalDatePicker from './JournalDatePicker';
import JournalEntriesPanel from './JournalEntriesPanel';
import ProgressiveDisclosure from '@/components/common/ProgressiveDisclosure';

interface JournalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  resetToToday?: boolean;
}

export default function JournalOverlay({ isOpen, onClose, resetToToday = false }: JournalOverlayProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (isOpen && resetToToday) {
      setSelectedDate(new Date());
    }
  }, [isOpen, resetToToday]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Journal</SheetTitle>
          <SheetDescription>
            Unlimited entries for today
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-safe">
          <div className="space-y-6 pb-6">
            <ProgressiveDisclosure trigger="Rules">
              <p className="text-sm text-muted-foreground">
                Past days are locked. Only today is editable.
              </p>
            </ProgressiveDisclosure>
            <JournalDatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <JournalEntriesPanel selectedDate={selectedDate} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
