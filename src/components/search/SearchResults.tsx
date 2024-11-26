import { Mail, FileText, MessageSquare, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchResult {
  id: string;
  type: 'email' | 'report' | 'document' | 'meeting' | 'social';
  title: string;
  excerpt: string;
  date: string;
  client: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

const typeIcons = {
  email: Mail,
  report: FileText,
  document: FileText,
  meeting: MessageSquare,
  social: Globe,
};

export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Globe className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No results found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Results
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {results.length} {results.length === 1 ? 'item' : 'items'} found
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {results.map((result) => {
          const Icon = typeIcons[result.type];
          return (
            <div
              key={result.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "mt-1 p-2 rounded-lg",
                  "bg-fundspoke-100 dark:bg-fundspoke-900",
                )}>
                  <Icon className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                      {result.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {result.excerpt}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="truncate">{result.client}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}