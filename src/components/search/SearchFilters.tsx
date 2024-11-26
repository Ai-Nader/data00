import { Calendar, User, Tag } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';
import { Select } from '../ui/Select';

interface SearchFiltersProps {
  filters: {
    category: string;
    dateRange: { from: string; to: string } | null;
    clientId: string | null;
  };
  onChange: (filters: any) => void;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'emails', label: 'Emails' },
  { value: 'reports', label: 'Reports' },
  { value: 'documents', label: 'Documents' },
  { value: 'meetings', label: 'Meeting Notes' },
  { value: 'social', label: 'Social Media' },
];

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <Select
          options={categories}
          value={filters.category}
          onChange={(value) => onChange({ category: value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date Range
        </label>
        <DateRangePicker
          value={filters.dateRange}
          onChange={(range) => onChange({ dateRange: range })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Client
        </label>
        <Select
          options={[
            { value: '', label: 'All Clients' },
            { value: '1', label: 'Client A' },
            { value: '2', label: 'Client B' },
            { value: '3', label: 'Client C' },
          ]}
          value={filters.clientId || ''}
          onChange={(value) => onChange({ clientId: value || null })}
        />
      </div>
    </div>
  );
}