import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { EmailForm } from '../components/forms/EmailForm';
import { ReportForm } from '../components/forms/ReportForm';
import { MeetingNotesForm } from '../components/forms/MeetingNotesForm';
import { FileUpload } from '../components/forms/FileUpload';
import { ClientSelect } from '../components/data-entry/ClientSelect';
import { ClientInfoForm } from '../components/forms/ClientInfoForm';
import { ClientSummary } from '../components/data-entry/ClientSummary';
import { Tabs } from '../components/ui/Tabs';
import { cn } from '../lib/utils';

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  website: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
}

const tabs = [
  { id: 'info', label: 'Client Information' },
  { id: 'email', label: 'Email' },
  { id: 'report', label: 'Report' },
  { id: 'meeting', label: 'Meeting Notes' },
  { id: 'bulk', label: 'Bulk Upload' },
];

export function DataEntry() {
  const [activeTab, setActiveTab] = useState('info');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);

  const handleSaveClientInfo = (info: ClientInfo) => {
    setClientInfo(info);
    // In a real application, you would save this to your backend
    console.log('Saving client info:', info);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Entry</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Add and manage client data, reports, and communications
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Client</h2>
        <ClientSelect selectedClient={selectedClient} onSelect={setSelectedClient} />
      </div>

      {!selectedClient && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20 p-4 mb-8">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                No client selected
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-500">
                Please select a client to enable data entry forms
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedClient && (
        <div className="space-y-6">
          <div className={cn(
            "bg-white dark:bg-gray-800 rounded-lg shadow-md transition-opacity duration-200",
            !selectedClient && "opacity-50 pointer-events-none"
          )}>
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            
            <div className="p-6">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <ClientInfoForm
                    clientId={selectedClient.id}
                    initialData={clientInfo || undefined}
                    onSave={handleSaveClientInfo}
                  />
                  {clientInfo && <ClientSummary {...clientInfo} />}
                </div>
              )}
              {activeTab === 'email' && <EmailForm clientId={selectedClient.id} />}
              {activeTab === 'report' && <ReportForm clientId={selectedClient.id} />}
              {activeTab === 'meeting' && <MeetingNotesForm clientId={selectedClient.id} />}
              {activeTab === 'bulk' && <FileUpload clientId={selectedClient.id} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}