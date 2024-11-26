import { useState } from 'react';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { ClientSelect } from '../components/data-entry/ClientSelect';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ChatInterface } from '../components/chat/ChatInterface';

interface Client {
  id: string;
  name: string;
  company: string;
}

export function AdvancedSearch() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchAll, setSearchAll] = useState(false);
  const [query, setQuery] = useState('');

  const handleBackToSearch = () => {
    setSelectedClient(null);
    setQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Search</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Search across all client data or focus on a specific client
        </p>
      </div>

      <div className="space-y-6">
        {/* Search Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Search Parameters</h2>
              <Button
                onClick={() => {
                  setSearchAll(!searchAll);
                  if (!searchAll) setSelectedClient(null);
                }}
                variant={searchAll ? 'primary' : 'secondary'}
              >
                {searchAll ? 'Searching All Data' : 'Search Specific Client'}
              </Button>
            </div>

            {!searchAll && !selectedClient && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Client
                </label>
                <ClientSelect
                  selectedClient={selectedClient}
                  onSelect={setSelectedClient}
                />
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface or Results Area */}
        {selectedClient ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToSearch}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedClient.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedClient.company}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-[600px]">
              <ChatInterface
                clientId={selectedClient.id}
                clientName={selectedClient.name}
                onClose={handleBackToSearch}
              />
            </div>
          </div>
        ) : searchAll ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Global Search
              </h2>
            </div>
            <div className="h-[600px]">
              <ChatInterface
                isGlobalSearch
                initialMessage="You are now searching across all data. Ask your query below."
              />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Select a client or enable "Search All Data" to start searching.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}