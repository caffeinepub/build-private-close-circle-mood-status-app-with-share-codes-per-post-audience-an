import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import JournalDatePicker from './JournalDatePicker';
import JournalEntriesPanel from './JournalEntriesPanel';

interface JournalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JournalOverlay({ isOpen, onClose }: JournalOverlayProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Daily Journal</SheetTitle>
          <SheetDescription>
            Write unlimited entries for today. Past days are locked.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-safe">
          <div className="space-y-6 pb-6">
            <JournalDatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <JournalEntriesPanel selectedDate={selectedDate} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
