import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChecklistItem {
  id: string;
  name: string;
  status: 'available' | 'missing' | 'pending';
  description: string;
  required: boolean;
}

const mockChecklists: Record<string, ChecklistItem[]> = {
  '1': [
    {
      id: 'doc1',
      name: 'Business Plan',
      status: 'available',
      description: 'Current business plan with 3-year projections',
      required: true,
    },
    {
      id: 'doc2',
      name: 'Financial Statements',
      status: 'available',
      description: 'Last 2 years of financial statements',
      required: true,
    },
    {
      id: 'doc3',
      name: 'Technology Assessment',
      status: 'missing',
      description: 'Current technology infrastructure assessment',
      required: true,
    },
    {
      id: 'doc4',
      name: 'Project Timeline',
      status: 'pending',
      description: 'Detailed project implementation timeline',
      required: true,
    },
  ],
  '2': [
    {
      id: 'doc1',
      name: 'Sustainability Report',
      status: 'missing',
      description: 'Current environmental impact assessment',
      required: true,
    },
    {
      id: 'doc2',
      name: 'Financial Projections',
      status: 'available',
      description: 'Green initiative ROI projections',
      required: true,
    },
    {
      id: 'doc3',
      name: 'Implementation Plan',
      status: 'pending',
      description: 'Sustainable practices implementation plan',
      required: true,
    },
  ],
};

interface PreWritingChecklistProps {
  grantId: string | null;
}

export function PreWritingChecklist({ grantId }: PreWritingChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (grantId && mockChecklists[grantId]) {
      setChecklist(mockChecklists[grantId]);
    } else {
      setChecklist([]);
    }
  }, [grantId]);

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'missing':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'missing':
        return 'Missing - Action Required';
      case 'pending':
        return 'Pending Review';
    }
  };

  if (!grantId) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No Grant Selected
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a grant to view the required documents checklist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Pre-Writing Checklist
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Required documents and information
        </p>
      </div>

      <div className="p-6 space-y-6">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-lg border p-4",
              item.status === 'available' && "border-green-200 dark:border-green-900",
              item.status === 'missing' && "border-red-200 dark:border-red-900",
              item.status === 'pending' && "border-yellow-200 dark:border-yellow-900"
            )}
          >
            <div className="flex items-start space-x-3">
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                      {item.required && (
                        <span className="ml-2 text-xs text-red-500">*Required</span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
                <p className={cn(
                  "mt-2 text-xs font-medium",
                  item.status === 'available' && "text-green-600 dark:text-green-400",
                  item.status === 'missing' && "text-red-600 dark:text-red-400",
                  item.status === 'pending' && "text-yellow-600 dark:text-yellow-400"
                )}>
                  {getStatusText(item.status)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}