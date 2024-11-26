import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ClientSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ClientSearch({ value, onChange, className }: ClientSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-fundspoke-500 focus:border-fundspoke-500 sm:text-sm"
        placeholder="Search clients..."
      />
    </div>
  );
}