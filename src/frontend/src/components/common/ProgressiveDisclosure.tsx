import { ReactNode } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressiveDisclosureProps {
  trigger: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'ghost';
}

export default function ProgressiveDisclosure({
  trigger,
  children,
  defaultOpen = false,
  variant = 'ghost',
}: ProgressiveDisclosureProps) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger asChild>
        <Button variant={variant} size="sm" className="w-full justify-between group">
          <span className="text-sm font-medium">{trigger}</span>
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
