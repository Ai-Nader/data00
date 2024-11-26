import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, User, Building2, MapPin, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Client {
  id: string;
  name: string;
  company: string;
  position?: string;
  industry: string;
  location: string;
  status: 'active' | 'inactive';
  lastContact?: string;
}

interface ClientSelectProps {
  selectedClient: Client | null;
  onSelect: (client: Client) => void;
}

// Mock data with enhanced client information
const clients: Client[] = [
  {
    id: "1",
    name: "John Morrison",
    position: "CEO",
    company: "Morrison Enterprises",
    industry: "Technology",
    location: "Ontario",
    status: "active",
    lastContact: "2024-02-20"
  },
  {
    id: "2",
    name: "Sarah Williams",
    position: "Director",
    company: "Williams & Co",
    industry: "Finance",
    location: "British Columbia",
    status: "active",
    lastContact: "2024-02-18"
  },
  {
    id: "3",
    name: "Michael Chang",
    position: "President",
    company: "Chang Industries",
    industry: "Manufacturing",
    location: "Quebec",
    status: "inactive",
    lastContact: "2024-01-15"
  },
  {
    id: "4",
    name: "Emma Davis",
    position: "COO",
    company: "Davis Solutions",
    industry: "Technology",
    location: "Alberta",
    status: "active",
    lastContact: "2024-02-19"
  },
  {
    id: "5",
    name: "Robert Wilson",
    position: "Managing Director",
    company: "Wilson Group",
    industry: "Consulting",
    location: "Ontario",
    status: "active",
    lastContact: "2024-02-17"
  }
];

const industries = Array.from(new Set(clients.map(client => client.industry)));
const locations = Array.from(new Set(clients.map(client => client.location)));

export function ClientSelect({ selectedClient, onSelect }: ClientSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    industry: 'all',
    status: 'all',
    location: 'all'
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = (
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.company.toLowerCase().includes(search.toLowerCase()) ||
      client.position?.toLowerCase().includes(search.toLowerCase())
    );

    const matchesIndustry = filters.industry === 'all' || client.industry === filters.industry;
    const matchesStatus = filters.status === 'all' || client.status === filters.status;
    const matchesLocation = filters.location === 'all' || client.location === filters.location;

    return matchesSearch && matchesIndustry && matchesStatus && matchesLocation;
  });

  const getStatusColor = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? 'text-green-500' 
      : 'text-gray-400';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2 text-left",
          "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg",
          "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
          isOpen && "ring-2 ring-fundspoke-500"
        )}
      >
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-fundspoke-100 dark:bg-fundspoke-900 flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
          </div>
          <div>
            {selectedClient ? (
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {selectedClient.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedClient.company}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">Select a client</div>
            )}
          </div>
        </div>
        <ChevronDown className={cn(
          "h-5 w-5 text-gray-400 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className={cn(
                  "w-full pl-9 pr-3 py-2 text-sm",
                  "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-fundspoke-500"
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <select
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                className="text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900"
              >
                <option value="all">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Client List */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    onSelect(client);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    "w-full text-left p-4",
                    "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                    "focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700",
                    selectedClient?.id === client.id && "bg-gray-50 dark:bg-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-fundspoke-100 dark:bg-fundspoke-900 flex items-center justify-center">
                        <User className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {client.name}
                          </span>
                          <Circle 
                            className={cn(
                              "h-2 w-2 ml-2",
                              getStatusColor(client.status)
                            )}
                            fill="currentColor"
                          />
                        </div>
                        {client.position && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {client.position}
                          </div>
                        )}
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {client.company}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {client.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedClient?.id === client.id && (
                      <Check className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No clients found matching your criteria
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}