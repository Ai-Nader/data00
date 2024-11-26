import { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSend(trimmedMessage);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex items-end space-x-2">
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className={cn(
            "block w-full resize-none rounded-lg border-0 bg-gray-50 dark:bg-gray-900",
            "p-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset",
            "ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400",
            "focus:ring-2 focus:ring-inset focus:ring-fundspoke-600 dark:focus:ring-fundspoke-500",
            "sm:text-sm sm:leading-6"
          )}
          style={{ maxHeight: '200px' }}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!message.trim()}
        className={cn(
          "flex items-center justify-center rounded-lg p-3",
          "bg-fundspoke-600 text-white transition-colors",
          "hover:bg-fundspoke-700 focus:outline-none focus:ring-2",
          "focus:ring-fundspoke-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}