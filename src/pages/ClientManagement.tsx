import { useState } from 'react';
import { ClientList } from '../components/clients/ClientList';
import { ClientSearch } from '../components/clients/ClientSearch';
import { ClientProfile } from '../components/clients/ClientProfile';

export function ClientManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Management</h1>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <ClientSearch
            value={searchQuery}
            onChange={setSearchQuery}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="space-y-6">
        {selectedClientId ? (
          <ClientProfile />
        ) : (
          <ClientList />
        )}
      </div>
    </div>
  );
}