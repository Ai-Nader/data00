import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Edit2, Save } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/Input';

interface Criterion {
  id: string;
  name: string;
  status: 'met' | 'not-met' | 'partial';
  value: string;
  numericValue: number;
  requirement: string;
  requirementValue: number;
  unit: string;
  editable: boolean;
  suggestion?: string;
}

interface EligibilityCriteriaProps {
  clientId: string;
  onCriteriaUpdate?: (criteria: Criterion[]) => void;
}

export function EligibilityCriteria({ clientId, onCriteriaUpdate }: EligibilityCriteriaProps) {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Simulate loading criteria data
    const timer = setTimeout(() => {
      setCriteria([
        {
          id: '1',
          name: 'Annual Revenue',
          status: 'met',
          value: '$2.5M',
          numericValue: 2500000,
          requirement: 'Min. $1M',
          requirementValue: 1000000,
          unit: '$',
          editable: true,
        },
        {
          id: '2',
          name: 'Years in Business',
          status: 'met',
          value: '5 years',
          numericValue: 5,
          requirement: 'Min. 3 years',
          requirementValue: 3,
          unit: 'years',
          editable: false,
        },
        {
          id: '3',
          name: 'Credit Score',
          status: 'partial',
          value: '680',
          numericValue: 680,
          requirement: 'Min. 700',
          requirementValue: 700,
          unit: '',
          editable: true,
          suggestion: 'Consider credit improvement strategies',
        },
        {
          id: '4',
          name: 'Employee Count',
          status: 'not-met',
          value: '8',
          numericValue: 8,
          requirement: 'Min. 10',
          requirementValue: 10,
          unit: '',
          editable: true,
          suggestion: 'Growth plan needed to meet minimum requirement',
        },
      ]);
    }, 500);

    return () => clearTimeout(timer);
  }, [clientId]);

  const updateCriterionStatus = (criterion: Criterion): Criterion['status'] => {
    const value = criterion.numericValue;
    const requirement = criterion.requirementValue;
    
    if (value >= requirement) return 'met';
    if (value >= requirement * 0.9) return 'partial';
    return 'not-met';
  };

  const handleEdit = (criterion: Criterion) => {
    setEditingId(criterion.id);
    setEditValue(criterion.numericValue.toString());
  };

  const handleSave = (criterion: Criterion) => {
    const newValue = parseFloat(editValue);
    if (isNaN(newValue)) return;

    const updatedCriteria = criteria.map((c) => {
      if (c.id === criterion.id) {
        const formattedValue = criterion.unit === '$' 
          ? `$${newValue.toLocaleString()}M`
          : newValue.toString() + (criterion.unit ? ` ${criterion.unit}` : '');

        const updated = {
          ...c,
          value: formattedValue,
          numericValue: newValue,
          status: updateCriterionStatus({ ...c, numericValue: newValue }),
        };

        // Update suggestion based on new value
        if (updated.status === 'not-met') {
          updated.suggestion = `Increase ${c.name.toLowerCase()} by ${
            criterion.unit === '$'
              ? `$${(criterion.requirementValue - newValue).toLocaleString()}M`
              : (criterion.requirementValue - newValue)
          } to meet requirement`;
        } else if (updated.status === 'partial') {
          updated.suggestion = `Close to meeting requirement, small improvement needed`;
        } else {
          updated.suggestion = undefined;
        }

        return updated;
      }
      return c;
    });

    setCriteria(updatedCriteria);
    setEditingId(null);
    setHasChanges(true);
    onCriteriaUpdate?.(updatedCriteria);
  };

  const StatusIcon = ({ status }: { status: Criterion['status'] }) => {
    switch (status) {
      case 'met':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'not-met':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Eligibility Criteria
          </h3>
          {hasChanges && (
            <span className="text-sm text-fundspoke-600 dark:text-fundspoke-400 animate-pulse">
              Simulated changes applied
            </span>
          )}
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className={cn(
              "px-6 py-4 transition-colors duration-200",
              editingId === criterion.id
                ? "bg-gray-50 dark:bg-gray-900"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <StatusIcon status={criterion.status} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {criterion.name}
                  </p>
                  <div className="flex items-center mt-1">
                    {editingId === criterion.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSave(criterion)}
                          className="p-1 text-fundspoke-600 hover:text-fundspoke-700 dark:text-fundspoke-400 dark:hover:text-fundspoke-300"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Current: {criterion.value} | Required: {criterion.requirement}
                        </p>
                        {criterion.editable && (
                          <button
                            onClick={() => handleEdit(criterion)}
                            className="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {criterion.suggestion && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      {criterion.suggestion}
                    </p>
                  )}
                </div>
              </div>
              <div className={cn(
                "transition-opacity duration-200",
                editingId === criterion.id ? "opacity-0" : "opacity-100"
              )}>
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  {
                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":
                      criterion.status === "met",
                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200":
                      criterion.status === "not-met",
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":
                      criterion.status === "partial",
                  }
                )}>
                  {criterion.status === "met"
                    ? "Met"
                    : criterion.status === "partial"
                    ? "Partially Met"
                    : "Not Met"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}