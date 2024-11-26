import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '../ui/Input';

interface DateRangePickerProps {
  value: { from: string; to: string } | null;
  onChange: (range: { from: string; to: string } | null) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex space-x-2">
      <Input
        type="date"
        value={value?.from || ''}
        onChange={(e) => onChange({ from: e.target.value, to: value?.to || '' })}
        icon={<Calendar className="h-4 w-4" />}
      />
      <Input
        type="date"
        value={value?.to || ''}
        onChange={(e) => onChange({ from: value?.from || '', to: e.target.value })}
        icon={<Calendar className="h-4 w-4" />}
      />
    </div>
  );
}