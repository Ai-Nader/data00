import { X, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Requirement {
  id: string;
  name: string;
  status: 'met' | 'not-met' | 'partial';
  current: string;
  required: string;
  recommendation?: string;
}

interface Grant {
  id: string;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  matchScore: number;
  requirements: Requirement[];
  overview: string;
}

interface GrantDetailsModalProps {
  grant: Grant;
  onClose: () => void;
}

export function GrantDetailsModal({ grant, onClose }: GrantDetailsModalProps) {
  const getStatusIcon = (status: Requirement['status']) => {
    switch (status) {
      case 'met':
        return <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />;
      case 'not-met':
        return <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-500" aria-hidden="true" />;
    }
  };

  const getStatusText = (status: Requirement['status']) => {
    switch (status) {
      case 'met':
        return 'Met';
      case 'not-met':
        return 'Not Met';
      case 'partial':
        return 'Partially Met';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-labelledby="grant-details-title"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" 
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Back to opportunities"
              >
                <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
                Back to Opportunities
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <h3 id="grant-details-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {grant.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {grant.overview}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {grant.amount}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Deadline</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {new Date(grant.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Requirements
            </h4>
            <div className="space-y-4">
              {grant.requirements.map((req) => (
                <div
                  key={req.id}
                  className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(req.status)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {req.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Current: {req.current} | Required: {req.required}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      {
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': req.status === 'met',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': req.status === 'not-met',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': req.status === 'partial',
                      }
                    )}>
                      {getStatusText(req.status)}
                    </span>
                  </div>
                  {req.recommendation && (
                    <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                      Recommendation: {req.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}