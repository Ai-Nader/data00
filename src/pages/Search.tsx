import { useState, useMemo } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { SearchBar } from '../components/search/SearchBar';
import { SearchFilters } from '../components/search/SearchFilters';
import { SearchResults } from '../components/search/SearchResults';

interface SearchFilters {
  category: string;
  dateRange: { from: string; to: string } | null;
  clientId: string | null;
}

// Mock data - in a real app, this would come from an API
const mockData = [
  {
    id: '1',
    type: 'email',
    title: 'Q4 Investment Strategy Review',
    excerpt: 'Discussion of portfolio performance and future investment strategies...',
    date: '2024-02-20',
    client: 'Morrison Enterprises',
    category: 'emails'
  },
  {
    id: '2',
    type: 'report',
    title: 'Annual Financial Report 2024',
    excerpt: 'Comprehensive analysis of financial performance and market trends...',
    date: '2024-02-15',
    client: 'Williams & Co',
    category: 'reports'
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Client Strategy Meeting',
    excerpt: 'Meeting notes regarding expansion plans and market analysis...',
    date: '2024-02-10',
    client: 'Chang Industries',
    category: 'meetings'
  },
  {
    id: '4',
    type: 'document',
    title: 'Investment Portfolio Analysis',
    excerpt: 'Detailed breakdown of current investment allocations and performance metrics...',
    date: '2024-02-18',
    client: 'Morrison Enterprises',
    category: 'documents'
  },
  {
    id: '5',
    type: 'social',
    title: 'LinkedIn Market Update',
    excerpt: 'Latest market insights and investment opportunities shared on LinkedIn...',
    date: '2024-02-19',
    client: 'Williams & Co',
    category: 'social'
  }
];

export function Search() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    dateRange: null,
    clientId: null,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredResults = useMemo(() => {
    return mockData.filter(item => {
      // Search query filter
      const searchMatch = query.toLowerCase() === '' || 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        item.client.toLowerCase().includes(query.toLowerCase());

      // Category filter
      const categoryMatch = filters.category === 'all' || item.category === filters.category;

      // Date range filter
      let dateMatch = true;
      if (filters.dateRange) {
        const itemDate = new Date(item.date);
        const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
        const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;

        if (fromDate && toDate) {
          dateMatch = itemDate >= fromDate && itemDate <= toDate;
        } else if (fromDate) {
          dateMatch = itemDate >= fromDate;
        } else if (toDate) {
          dateMatch = itemDate <= toDate;
        }
      }

      // Client filter
      const clientMatch = !filters.clientId || 
        item.client === mockData.find(c => c.id === filters.clientId)?.client;

      return searchMatch && categoryMatch && dateMatch && clientMatch;
    });
  }, [query, filters]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Search</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search across all client data, documents, and communications
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fundspoke-500"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters {isFilterOpen ? 'Hide' : 'Show'}
          </button>
        </div>

        {isFilterOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <SearchFilters
              filters={filters}
              onChange={handleFilterChange}
            />
          </div>
        )}

        <SearchResults results={filteredResults} />
      </div>
    </div>
  );
}