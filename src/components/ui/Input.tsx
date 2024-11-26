import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
              {icon}
            </span>
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "block w-full rounded-md border-gray-300 dark:border-gray-600",
            "focus:border-fundspoke-500 focus:ring-fundspoke-500",
            "dark:bg-gray-800 dark:text-white",
            "sm:text-sm",
            icon ? "pl-10" : "pl-3",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);