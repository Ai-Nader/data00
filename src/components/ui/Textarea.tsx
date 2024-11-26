import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "block w-full rounded-md border-gray-300 dark:border-gray-600",
          "focus:border-fundspoke-500 focus:ring-fundspoke-500",
          "dark:bg-gray-800 dark:text-white",
          "sm:text-sm",
          className
        )}
        {...props}
      />
    );
  }
);