import { useEffect, useState } from 'react';
import { Calendar, DollarSign, TrendingUp, Search, SortAsc, SortDesc, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { GrantDetailsModal } from './GrantDetailsModal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface Requirement {
  id: string;
  name: string;
  status: 'met' | 'not-met' | 'partial';
  current: string;
  required: string;
  recommendation?: string;
}

interface Opportunity {
  id: string;
  name: string;
  description: string;
  amount: string;
  amountRange: { min: number; max: number };
  deadline: string;
  matchScore: number;
  requirements: Requirement[];
  overview: string;
}

interface FundingOpportunitiesProps {
  clientId: string;
  onOpportunitiesChange?: (opportunities: Opportunity[]) => void;
}

type SortField = 'matchScore' | 'deadline' | 'amount';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

const amountRanges = [
  { label: 'All Amounts', value: 'all' },
  { label: 'Under $50,000', value: '0-50000' },
  { label: '$50,000 - $100,000', value: '50000-100000' },
  { label: 'Over $100,000', value: '100000-' },
];

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Innovation Growth Fund',
    description: 'Support for technology adoption and R&D initiatives',
    amount: '$50,000 - $150,000',
    amountRange: { min: 50000, max: 150000 },
    deadline: '2024-04-15',
    matchScore: 85,
    overview: 'Designed to help businesses accelerate their technological capabilities and research initiatives.',
    requirements: [
      {
        id: 'r1',
        name: 'Annual Revenue',
        status: 'met',
        current: '$2.5M',
        required: '$1M+',
      },
      {
        id: 'r2',
        name: 'R&D Investment',
        status: 'partial',
        current: '8%',
        required: '10%',
        recommendation: 'Increase R&D spending by 2%',
      },
    ],
  },
  {
    id: '2',
    name: 'Business Expansion Grant',
    description: 'Funding for market expansion and hiring',
    amount: '$75,000 - $200,000',
    amountRange: { min: 75000, max: 200000 },
    deadline: '2024-05-01',
    matchScore: 92,
    overview: 'Supports businesses looking to expand their operations and workforce.',
    requirements: [
      {
        id: 'r1',
        name: 'Years in Business',
        status: 'met',
        current: '5 years',
        required: '3+ years',
      },
      {
        id: 'r2',
        name: 'Current Employees',
        status: 'met',
        current: '25',
        required: '10+',
      },
    ],
  },
  {
    id: '3',
    name: 'Digital Transformation Fund',
    description: 'Support for digital infrastructure and training',
    amount: '$25,000 - $100,000',
    amountRange: { min: 25000, max: 100000 },
    deadline: '2024-03-30',
    matchScore: 78,
    overview: 'Helps businesses modernize their digital infrastructure and upskill employees.',
    requirements: [
      {
        id: 'r1',
        name: 'Digital Readiness',
        status: 'partial',
        current: 'Basic',
        required: 'Intermediate',
        recommendation: 'Develop digital transformation roadmap',
      },
    ],
  },
  {
    id: '4',
    name: 'Sustainability Initiative Grant',
    description: 'Funding for green business practices',
    amount: '$40,000 - $120,000',
    amountRange: { min: 40000, max: 120000 },
    deadline: '2024-06-15',
    matchScore: 45,
    overview: 'Supports the adoption of sustainable business practices and green technologies.',
    requirements: [
      {
        id: 'r1',
        name: 'Environmental Impact',
        status: 'not-met',
        current: 'No assessment',
        required: 'Assessment completed',
        recommendation: 'Complete environmental impact assessment',
      },
    ],
  },
  {
    id: '5',
    name: 'Market Research Fund',
    description: 'Support for market analysis and strategy',
    amount: '$15,000 - $50,000',
    amountRange: { min: 15000, max: 50000 },
    deadline: '2024-04-30',
    matchScore: 88,
    overview: 'Helps businesses conduct market research and develop strategic plans.',
    requirements: [
      {
        id: 'r1',
        name: 'Business Plan',
        status: 'met',
        current: 'Comprehensive',
        required: 'Basic+',
      },
    ],
  },
];

export function FundingOpportunities({ clientId, onOpportunitiesChange }: FundingOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'matchScore', order: 'desc' });
  const [amountFilter, setAmountFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOpportunities = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOpportunities(mockOpportunities);
        onOpportunitiesChange?.(mockOpportunities);
      } catch (error) {
        console.error('Error loading opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
  }, [clientId, onOpportunitiesChange]);

  const filteredAndSortedOpportunities = opportunities
    .filter((opp) => {
      const matchesSearch = searchQuery.toLowerCase() === '' ||
        opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesAmount = true;
      if (amountFilter !== 'all') {
        const [min, max] = amountFilter.split('-').map(Number);
        if (max) {
          matchesAmount = opp.amountRange.min <= max && opp.amountRange.max >= min;
        } else {
          matchesAmount = opp.amountRange.min >= min;
        }
      }

      return matchesSearch && matchesAmount;
    })
    .sort((a, b) => {
      const { field, order } = sortConfig;
      let comparison = 0;

      switch (field) {
        case 'matchScore':
          comparison = a.matchScore - b.matchScore;
          break;
        case 'deadline':
          comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          break;
        case 'amount':
          comparison = a.amountRange.min - b.amountRange.min;
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc',
    }));
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Available Funding Opportunities
              </h3>
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
                  aria-label="Search grants"
                />

                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <Select
                      value={amountFilter}
                      onChange={(value) => setAmountFilter(value)}
                      options={amountRanges}
                      aria-label="Filter by amount"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant={sortConfig.field === 'matchScore' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('matchScore')}
                      icon={sortConfig.field === 'matchScore' && sortConfig.order === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                      aria-label="Sort by match score"
                    >
                      Match Score
                    </Button>
                    <Button
                      variant={sortConfig.field === 'deadline' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('deadline')}
                      icon={sortConfig.field === 'deadline' && sortConfig.order === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                      aria-label="Sort by deadline"
                    >
                      Deadline
                    </Button>
                    <Button
                      variant={sortConfig.field === 'amount' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('amount')}
                      icon={sortConfig.field === 'amount' && sortConfig.order === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                      aria-label="Sort by amount"
                    >
                      Amount
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedOpportunities.length > 0 ? (
              filteredAndSortedOpportunities.map((opportunity) => (
                <button
                  key={opportunity.id}
                  onClick={() => setSelectedGrant(opportunity)}
                  className="w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fundspoke-500"
                  aria-label={`View details for ${opportunity.name}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">
                        {opportunity.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {opportunity.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {opportunity.amount}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(opportunity.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        getMatchScoreColor(opportunity.matchScore)
                      )}>
                        {opportunity.matchScore}% Match
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No matching grants found
              </div>
            )}
          </div>
        )}
      </div>

      {selectedGrant && (
        <GrantDetailsModal
          grant={selectedGrant}
          onClose={() => setSelectedGrant(null)}
        />
      )}
    </>
  );
}