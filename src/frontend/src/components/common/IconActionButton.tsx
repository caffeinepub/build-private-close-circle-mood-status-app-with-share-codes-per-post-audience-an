import { ReactNode, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IconActionButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  icon: ReactNode;
  label: string;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
}

const IconActionButton = forwardRef<HTMLButtonElement, IconActionButtonProps>(
  ({ icon, label, tooltipSide = 'top', children, ...buttonProps }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button ref={ref} aria-label={label} {...buttonProps}>
              {children || icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

IconActionButton.displayName = 'IconActionButton';

export default IconActionButton;
