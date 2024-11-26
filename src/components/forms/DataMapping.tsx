import { useState, useEffect } from 'react';
import { Table, ArrowRight, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Column {
  name: string;
  required: boolean;
  description: string;
  type: 'string' | 'number' | 'date' | 'email';
}

interface MappingField {
  sourceColumn: string;
  targetField: string | null;
  isValid: boolean;
}

interface DataMappingProps {
  file: File;
  onComplete: (mappedData: any[]) => void;
  onCancel: () => void;
}

// System fields that can be mapped to
const systemFields: Column[] = [
  { name: 'clientName', required: true, description: 'Full name of the client', type: 'string' },
  { name: 'companyName', required: true, description: 'Name of the company', type: 'string' },
  { name: 'email', required: true, description: 'Primary email address', type: 'email' },
  { name: 'phone', required: true, description: 'Contact phone number', type: 'string' },
  { name: 'revenue', required: false, description: 'Annual revenue', type: 'number' },
  { name: 'employeeCount', required: false, description: 'Number of employees', type: 'number' },
  { name: 'incorporationDate', required: false, description: 'Date of incorporation', type: 'date' },
  { name: 'website', required: false, description: 'Company website', type: 'string' },
];

export function DataMapping({ file, onComplete, onCancel }: DataMappingProps) {
  const [fileData, setFileData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mappings, setMappings] = useState<MappingField[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    parseFile();
  }, [file]);

  const parseFile = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const data = await readFileData(file);
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        setColumns(headers);
        setFileData(data);
        setPreviewData(data.slice(0, 5));
        
        // Initialize mappings
        const initialMappings = headers.map(header => ({
          sourceColumn: header,
          targetField: findMatchingSystemField(header),
          isValid: true
        }));
        setMappings(initialMappings);
      } else {
        throw new Error('No data found in file');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileData = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Failed to parse file content'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  const findMatchingSystemField = (header: string): string | null => {
    const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
    const match = systemFields.find(field => 
      field.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedHeader
    );
    return match ? match.name : null;
  };

  const handleMappingChange = (sourceColumn: string, targetField: string) => {
    setMappings(prev => prev.map(mapping => 
      mapping.sourceColumn === sourceColumn
        ? { ...mapping, targetField: targetField || null }
        : mapping
    ));
  };

  const validateMappings = (): boolean => {
    const requiredFields = systemFields.filter(f => f.required).map(f => f.name);
    const mappedFields = mappings.map(m => m.targetField).filter(Boolean) as string[];
    
    const missingRequired = requiredFields.filter(field => !mappedFields.includes(field));
    const duplicateMappings = mappedFields.filter((field, index) => 
      mappedFields.indexOf(field) !== index
    );

    if (missingRequired.length > 0) {
      setError(`Missing required fields: ${missingRequired.join(', ')}`);
      return false;
    }

    if (duplicateMappings.length > 0) {
      setError(`Duplicate mappings found for: ${duplicateMappings.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleComplete = () => {
    if (!validateMappings()) return;

    const mappedData = fileData.map(row => {
      const newRow: Record<string, any> = {};
      mappings.forEach(mapping => {
        if (mapping.targetField) {
          newRow[mapping.targetField] = row[mapping.sourceColumn];
        }
      });
      return newRow;
    });

    onComplete(mappedData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Table className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Map File Columns
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isProcessing || !!error}
          >
            Complete Mapping
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            {/* Column Mappings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mappings.map((mapping) => (
                <div
                  key={mapping.sourceColumn}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {mapping.sourceColumn}
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
                              Sample values: {previewData.slice(0, 3).map(row => 
                                row[mapping.sourceColumn]
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
                      value={mapping.targetField || ''}
                      onChange={(value) => handleMappingChange(mapping.sourceColumn, value)}
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

            {/* Data Preview */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Data Preview
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {columns.map((column) => (
                          <td
                            key={column}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                          >
                            {row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length < fileData.length && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Showing {previewData.length} of {fileData.length} rows
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}