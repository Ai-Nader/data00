import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Info } from 'lucide-react';
import { cn } from '../../lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Factor {
  name: string;
  impact: number;
  status: 'positive' | 'neutral' | 'negative';
  details: {
    current: string;
    target: string;
    suggestion?: string;
  };
}

interface SuccessProbabilityProps {
  clientId: string;
  score: number;
}

export function SuccessProbability({ clientId, score }: SuccessProbabilityProps) {
  const [probability, setProbability] = useState(0);
  const [animatedProbability, setAnimatedProbability] = useState(0);
  const [factors, setFactors] = useState<Factor[]>([
    {
      name: 'Financial Health',
      impact: 30,
      status: 'positive',
      details: {
        current: 'Revenue: $2.5M',
        target: 'Required: $1M+',
      },
    },
    {
      name: 'Market Position',
      impact: 25,
      status: 'neutral',
      details: {
        current: 'Market Share: 15%',
        target: 'Target: 20%',
        suggestion: 'Consider expanding market presence',
      },
    },
    {
      name: 'Team Size',
      impact: 20,
      status: 'negative',
      details: {
        current: '8 employees',
        target: 'Required: 10+',
        suggestion: 'Hire additional team members',
      },
    },
    {
      name: 'Industry Experience',
      impact: 25,
      status: 'positive',
      details: {
        current: '5 years',
        target: 'Required: 3+ years',
      },
    },
  ]);
  const [selectedFactor, setSelectedFactor] = useState<Factor | null>(null);

  useEffect(() => {
    // Calculate probability based on validation score and other factors
    const calculatedProbability = Math.min(Math.round(score * 0.9), 95);
    setProbability(calculatedProbability);

    const timer = setInterval(() => {
      setAnimatedProbability(prev => {
        const next = prev + 1;
        if (next >= calculatedProbability) {
          clearInterval(timer);
          return calculatedProbability;
        }
        return next;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [score]);

  const chartData: ChartData<'doughnut'> = {
    labels: ['Success Probability', 'Remaining'],
    datasets: [
      {
        data: [animatedProbability, 100 - animatedProbability],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(229, 231, 235)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Success Probability
        </h3>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-48 sm:h-64">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {animatedProbability}%
                </span>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Probability
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Contributing Factors
            </h4>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {factors.map((factor) => (
                <button
                  key={factor.name}
                  onClick={() => setSelectedFactor(
                    selectedFactor?.name === factor.name ? null : factor
                  )}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-lg",
                    "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                    "text-left",
                    selectedFactor?.name === factor.name && 
                    "bg-gray-50 dark:bg-gray-700"
                  )}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      {
                        'bg-green-500': factor.status === 'positive',
                        'bg-yellow-500': factor.status === 'neutral',
                        'bg-red-500': factor.status === 'negative',
                      }
                    )} />
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {factor.name}
                    </span>
                    <Info className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">
                    {factor.impact}%
                  </span>
                </button>
              ))}
            </div>

            {selectedFactor && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedFactor.name} Details
                </h5>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedFactor.details.current}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedFactor.details.target}
                  </p>
                  {selectedFactor.details.suggestion && (
                    <p className="text-fundspoke-600 dark:text-fundspoke-400">
                      Suggestion: {selectedFactor.details.suggestion}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}