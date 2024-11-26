import { User, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  type: 'system' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isSystem = message.type === 'system';

  return (
    <div
      className={cn(
        "flex items-start space-x-3",
        isSystem ? "mr-auto" : "ml-auto flex-row-reverse space-x-reverse"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isSystem 
          ? "bg-fundspoke-100 dark:bg-fundspoke-900" 
          : "bg-gray-100 dark:bg-gray-800"
      )}>
        {isSystem ? (
          <Bot className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
        ) : (
          <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        )}
      </div>

      <div className={cn(
        "flex flex-col space-y-1",
        isSystem ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2 max-w-lg",
          isSystem 
            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
            : "bg-fundspoke-600 text-white"
        )}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <span className="text-xs text-gray-500">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}