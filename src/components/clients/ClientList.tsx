import { User, MoreVertical, Mail, Phone } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  portfolioValue: string;
  status: 'active' | 'pending' | 'inactive';
}

const clients: Client[] = [
  {
    id: '1',
    name: 'John Morrison',
    email: 'john.m@example.com',
    phone: '+1 (555) 123-4567',
    portfolioValue: '$2.5M',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '+1 (555) 234-5678',
    portfolioValue: '$1.8M',
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Chang',
    email: 'michael.c@example.com',
    phone: '+1 (555) 345-6789',
    portfolioValue: '$3.2M',
    status: 'pending'
  }
];

export function ClientList() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Clients</h2>
          <button className="px-4 py-2 bg-fundspoke-600 text-white rounded-lg hover:bg-fundspoke-700 transition-colors">
            Add Client
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50 dark:bg-gray-900">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Portfolio Value
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-fundspoke-100 dark:bg-fundspoke-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {client.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="h-4 w-4 mr-2" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      {client.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{client.portfolioValue}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${client.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                    ${client.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                    ${client.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                  `}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="min-w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-lg p-1">
                        <DropdownMenu.Item className="text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 cursor-pointer">
                          View Details
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 cursor-pointer">
                          Edit Client
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 cursor-pointer">
                          Remove Client
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}