import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PostStatusPrivateNotePromptProps {
  isOpen: boolean;
  onOpenJournal: () => void;
  onDismiss: () => void;
}

export default function PostStatusPrivateNotePrompt({
  isOpen,
  onOpenJournal,
  onDismiss,
}: PostStatusPrivateNotePromptProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Private Reflection</AlertDialogTitle>
          <AlertDialogDescription>
            Want to write a private note about this?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDismiss}>Not now</AlertDialogCancel>
          <AlertDialogAction onClick={onOpenJournal}>Yes, write a note</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
