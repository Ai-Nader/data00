import { useState, useEffect } from 'react';
import { Table, ArrowRight, AlertCircle, CheckCircle, HelpCircle, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ValidationSummary } from './ValidationSummary';
import { EditableDataGrid } from './EditableDataGrid';
import { validateDataset, generateErrorReport, ValidationError } from '../../lib/validation';

// ... (keep existing interfaces and systemFields)

export function DataMapping({ file, onComplete, onCancel }: DataMappingProps) {
  const [fileData, setFileData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [editingRow, setEditingRow] = useState<number>();
  const [isProcessing, setIsProcessing] = useState(false);

  // ... (keep existing parseFile and readFileData functions)

  const handleMappingChange = (sourceColumn: string, targetField: string) => {
    const newMappings = {
      ...mappings,
      [sourceColumn]: targetField || '',
    };
    setMappings(newMappings);
    validateData(fileData, newMappings);
  };

  const validateData = (data: any[], mappings: Record<string, string>) => {
    const errors = validateDataset(data, mappings);
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleDataChange = (newData: Record<string, any>[]) => {
    setFileData(newData);
    setEditingRow(undefined);
    validateData(newData, mappings);
  };

  const downloadErrorReport = () => {
    const report = generateErrorReport(validationErrors);
    const blob = new Blob([report], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validation-errors.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleComplete = () => {
    if (validateData(fileData, mappings)) {
      const mappedData = fileData.map(row => {
        const newRow: Record<string, any> = {};
        Object.entries(mappings).forEach(([sourceColumn, targetField]) => {
          if (targetField) {
            newRow[targetField] = row[sourceColumn];
          }
        });
        return newRow;
      });
      onComplete(mappedData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Table className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Map and Validate Data
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isProcessing || validationErrors.length > 0}
          >
            Complete Import
          </Button>
        </div>
      </div>

      {/* Column Mappings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Column Mappings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {columns.map((column) => (
            <div
              key={column}
              className="flex items-center space-x-4"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {column}
                  </span>
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                          <HelpCircle className="h-4 w-4" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm max-w-xs"
                          sideOffset={5}
                        >
                          Sample values: {fileData.slice(0, 3).map(row => 
                            row[column]
                          ).join(', ')}
                          <Tooltip.Arrow className="fill-white dark:fill-gray-800" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <Select
                  value={mappings[column] || ''}
                  onChange={(value) => handleMappingChange(column, value)}
                  options={[
                    { value: '', label: 'Select field...' },
                    ...systemFields.map(field => ({
                      value: field.name,
                      label: field.name + (field.required ? ' *' : ''),
                    }))
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <ValidationSummary
          errors={validationErrors}
          onDownloadReport={downloadErrorReport}
          onEditRow={setEditingRow}
        />
      )}

      {/* Data Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Data Preview
          </h3>
          <EditableDataGrid
            data={fileData}
            columns={columns}
            mappings={mappings}
            onDataChange={handleDataChange}
            editingRow={editingRow}
          />
        </div>
      </div>
    </div>
  );
}