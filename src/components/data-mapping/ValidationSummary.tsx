import { useState } from 'react';
import { AlertCircle, Download, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ValidationError } from '../../lib/validation';
import { cn } from '../../lib/utils';

interface ValidationSummaryProps {
  errors: ValidationError[];
  onDownloadReport: () => void;
  onEditRow: (rowIndex: number) => void;
}

export function ValidationSummary({ errors, onDownloadReport, onEditRow }: ValidationSummaryProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (rowIndex: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowIndex)) {
        next.delete(rowIndex);
      } else {
        next.add(rowIndex);
      }
      return next;
    });
  };

  const errorsByRow = errors.reduce((acc, error) => {
    if (!acc[error.row]) acc[error.row] = [];
    acc[error.row].push(error);
    return acc;
  }, {} as Record<number, ValidationError[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Validation Errors ({errors.length})
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadReport}
          icon={<Download className="h-4 w-4" />}
        >
          Download Report
        </Button>
      </div>

      <div className="space-y-2">
        {Object.entries(errorsByRow).map(([row, rowErrors]) => (
          <div
            key={row}
            className="border border-red-200 dark:border-red-900 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleRow(parseInt(row))}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Row {row}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {rowErrors.length} {rowErrors.length === 1 ? 'error' : 'errors'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditRow(parseInt(row));
                  }}
                  icon={<Edit2 className="h-4 w-4" />}
                >
                  Edit Row
                </Button>
                <motion.div
                  animate={{ rotate: expandedRows.has(parseInt(row)) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {expandedRows.has(parseInt(row)) && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4">
                    <div className="space-y-2">
                      {rowErrors.map((error, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 text-sm"
                        >
                          <div className="w-24 flex-shrink-0">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {error.column}:
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-red-600 dark:text-red-400">
                              {error.error}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              Current value: {error.value || '(empty)'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}