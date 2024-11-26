import { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Filter, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface Recommendation {
  id: string;
  type: 'improvement' | 'risk' | 'strength';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved' | 'not-applicable';
  timestamp: Date;
}

interface RecommendationsProps {
  clientId: string;
  onRecommendationsChange?: (recommendations: Recommendation[]) => void;
}

const impactFilters = [
  { value: 'all', label: 'All Impact Levels' },
  { value: 'high', label: 'High Impact' },
  { value: 'medium', label: 'Medium Impact' },
  { value: 'low', label: 'Low Impact' },
];

const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'not-applicable', label: 'Not Applicable' },
];

export function Recommendations({ clientId, onRecommendationsChange }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [impactFilter, setImpactFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate loading recommendations data
    const timer = setTimeout(() => {
      const data: Recommendation[] = [
        {
          id: '1',
          type: 'improvement',
          title: 'Increase Employee Count',
          description: 'Consider hiring 2 more full-time employees to meet minimum requirements.',
          impact: 'high',
          status: 'active',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'risk',
          title: 'Credit Score Below Threshold',
          description: 'Work on improving credit score to meet the minimum requirement of 700.',
          impact: 'medium',
          status: 'active',
          timestamp: new Date(),
        },
        {
          id: '3',
          type: 'strength',
          title: 'Strong Revenue Growth',
          description: 'Current revenue growth rate exceeds requirements by 25%.',
          impact: 'high',
          status: 'active',
          timestamp: new Date(),
        },
      ];
      setRecommendations(data);
      onRecommendationsChange?.(data);
    }, 500);

    return () => clearTimeout(timer);
  }, [clientId, onRecommendationsChange]);

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesImpact = impactFilter === 'all' || rec.impact === impactFilter;
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    return matchesImpact && matchesStatus;
  });

  const handleStatusChange = (recId: string, newStatus: Recommendation['status']) => {
    const updated = recommendations.map(rec => {
      if (rec.id === recId) {
        return { ...rec, status: newStatus, timestamp: new Date() };
      }
      return rec;
    });
    setRecommendations(updated);
    onRecommendationsChange?.(updated);
  };

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'strength':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getImpactBadgeStyle = (impact: Recommendation['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusBadgeStyle = (status: Recommendation['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'not-applicable':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recommendations & Insights
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={impactFilter}
              onChange={setImpactFilter}
              options={impactFilters}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusFilters}
            />
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className={cn(
                "p-6 transition-colors duration-200",
                recommendation.status !== 'active' && "bg-gray-50 dark:bg-gray-900/50",
                recommendation.status === 'active' && "hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <div className="flex items-start space-x-4">
                {getTypeIcon(recommendation.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                      {recommendation.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        getImpactBadgeStyle(recommendation.impact)
                      )}>
                        {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)} Impact
                      </span>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        getStatusBadgeStyle(recommendation.status)
                      )}>
                        {recommendation.status.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {recommendation.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {recommendation.timestamp.toLocaleString()}
                    </div>
                    {recommendation.status === 'active' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(recommendation.id, 'resolved')}
                        >
                          Mark as Resolved
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(recommendation.id, 'not-applicable')}
                        >
                          Not Applicable
                        </Button>
                      </div>
                    )}
                    {recommendation.status !== 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(recommendation.id, 'active')}
                      >
                        Reactivate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No recommendations match the selected filters
          </div>
        )}
      </div>
    </div>
  );
}