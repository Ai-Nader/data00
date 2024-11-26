import { useState } from 'react';
import { Search, Calendar, DollarSign, TrendingUp, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { cn } from '../../lib/utils';

interface Grant {
  id: string;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  matchScore: number;
  probability: number;
  category: string;
}

const mockGrants: Grant[] = [
  {
    id: '1',
    name: 'Technology Innovation Fund',
    description: 'Supporting technological advancement in small businesses',
    amount: '$50,000 - $150,000',
    deadline: '2024-04-15',
    matchScore: 85,
    probability: 78,
    category: 'technology'
  },
  {
    id: '2',
    name: 'Green Business Initiative',
    description: 'Funding for sustainable business practices',
    amount: '$25,000 - $75,000',
    deadline: '2024-05-01',
    matchScore: 92,
    probability: 85,
    category: 'sustainability'
  },
  {
    id: '3',
    name: 'Workforce Development Grant',
    description: 'Support for employee training and development',
    amount: '$35,000 - $100,000',
    deadline: '2024-03-30',
    matchScore: 75,
    probability: 65,
    category: 'workforce'
  },
  {
    id: '4',
    name: 'Market Expansion Fund',
    description: 'Assistance for business market expansion',
    amount: '$75,000 - $200,000',
    deadline: '2024-06-15',
    matchScore: 88,
    probability: 72,
    category: 'expansion'
  },
  {
    id: '5',
    name: 'Research & Development Grant',
    description: 'Funding for innovative R&D projects',
    amount: '$100,000 - $300,000',
    deadline: '2024-05-30',
    matchScore: 79,
    probability: 68,
    category: 'research'
  }
];

interface GrantSelectionPanelProps {
  selectedGrantId: string | null;
  onSelectGrant: (grantId: string) => void;
}

export function GrantSelectionPanel({ selectedGrantId, onSelectGrant }: GrantSelectionPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'workforce', label: 'Workforce' },
    { value: 'expansion', label: 'Expansion' },
    { value: 'research', label: 'Research' },
  ];

  const filteredGrants = mockGrants.filter(grant => {
    const matchesSearch = grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || grant.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Available Grants
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="h-4 w-4" />}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {showFilters && (
            <div className="space-y-4">
              <Input
                placeholder="Search grants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
              
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categories}
              />
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredGrants.map((grant) => (
          <button
            key={grant.id}
            onClick={() => onSelectGrant(grant.id)}
            className={cn(
              "w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
              selectedGrantId === grant.id && "bg-gray-50 dark:bg-gray-700"
            )}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {grant.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {grant.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    grant.matchScore >= 80
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  )}>
                    {grant.matchScore}% Match
                  </span>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    grant.probability >= 75
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  )}>
                    {grant.probability}% Success
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {grant.amount}
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(grant.deadline).toLocaleDateString()}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}