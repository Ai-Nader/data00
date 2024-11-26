import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export function TagInput({ value, onChange, placeholder, icon }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      if (!value.includes(input)) {
        onChange([...value, input]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-fundspoke-100 text-fundspoke-800 dark:bg-fundspoke-900 dark:text-fundspoke-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-fundspoke-500"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <div className="flex-1 inline-flex items-center">
          {icon && (
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {icon}
            </span>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            className={cn(
              "flex-1 outline-none bg-transparent text-sm ml-2",
              "placeholder-gray-400 dark:placeholder-gray-500",
              "text-gray-900 dark:text-white"
            )}
          />
        </div>
      </div>
    </div>
  );
}