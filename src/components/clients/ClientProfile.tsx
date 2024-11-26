import { useState } from 'react';
import { Mail, FileText, Globe, MessageSquare, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const tabs = [
  { id: 'emails', label: 'Emails', icon: Mail },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'social', label: 'Social Media', icon: Globe },
  { id: 'transcripts', label: 'Transcripts', icon: MessageSquare },
  { id: 'company', label: 'Company Information', icon: Building2 },
];

const mockEmails = [
  { id: 1, subject: 'Q4 Portfolio Review', date: '2024-02-20', status: 'read' },
  { id: 2, subject: 'Investment Strategy Update', date: '2024-02-15', status: 'unread' },
  { id: 3, subject: 'Meeting Follow-up', date: '2024-02-10', status: 'read' },
];

const mockReports = [
  { id: 1, name: 'Annual Performance Review', date: '2024-01-15', type: 'PDF' },
  { id: 2, name: 'Risk Assessment Report', date: '2024-01-10', type: 'PDF' },
  { id: 3, name: 'Portfolio Analysis', date: '2024-01-05', type: 'XLSX' },
];

const mockSocial = [
  { platform: 'LinkedIn', url: '#', username: '@johnmorrison' },
  { platform: 'Twitter', url: '#', username: '@jmorrison' },
];

const mockCompany = {
  name: 'Morrison Enterprises',
  address: '123 Business Ave, Suite 100',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  phone: '+1 (555) 123-4567',
  website: 'www.morrisonenterprises.com',
};

export function ClientProfile() {
  const [activeTab, setActiveTab] = useState('emails');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">John Morrison</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Morrison Enterprises</p>
        </div>
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center px-4 py-2 border-b-2 text-sm font-medium whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-fundspoke-600 text-fundspoke-600 dark:border-fundspoke-400 dark:text-fundspoke-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'emails' && (
          <div className="space-y-4">
            {mockEmails.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    email.status === 'unread' ? "bg-fundspoke-600" : "bg-gray-300 dark:bg-gray-700"
                  )} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{email.subject}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{email.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{report.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{report.date}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-fundspoke-600 bg-fundspoke-100 rounded dark:text-fundspoke-400 dark:bg-fundspoke-900">
                  {report.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            {mockSocial.map((profile) => (
              <a
                key={profile.platform}
                href={profile.url}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.platform}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile.username}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        {activeTab === 'company' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{mockCompany.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {mockCompany.address}<br />
                    {mockCompany.city}, {mockCompany.state} {mockCompany.zip}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                  <p className="text-sm text-gray-900 dark:text-white">{mockCompany.phone}</p>
                  <p className="text-sm text-gray-900 dark:text-white">{mockCompany.website}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}