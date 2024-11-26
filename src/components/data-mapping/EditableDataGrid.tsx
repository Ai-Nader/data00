import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateField } from '../../lib/validation';
import { cn } from '../../lib/utils';

interface EditableDataGridProps {
  data: Record<string, any>[];
  columns: string[];
  mappings: Record<string, string>;
  onDataChange: (newData: Record<string, any>[]) => void;
  editingRow?: number;
}

export function EditableDataGrid({
  data,
  columns,
  mappings,
  onDataChange,
  editingRow,
}: EditableDataGridProps) {
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [validationState, setValidationState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (editingRow !== undefined) {
      setEditedData(data[editingRow]);
      validateAllFields(data[editingRow]);
    } else {
      setEditedData({});
      setValidationState({});
    }
  }, [editingRow, data]);

  const validateAllFields = (rowData: Record<string, any>) => {
    const newValidationState: Record<string, boolean> = {};
    
    Object.entries(mappings).forEach(([sourceColumn, targetField]) => {
      if (!targetField) return;
      const { isValid } = validateField(targetField, rowData[sourceColumn]);
      newValidationState[sourceColumn] = isValid;
    });

    setValidationState(newValidationState);
  };

  const handleFieldChange = (column: string, value: string) => {
    const newData = { ...editedData, [column]: value };
    setEditedData(newData);

    // Validate the changed field
    const targetField = mappings[column];
    if (targetField) {
      const { isValid } = validateField(targetField, value);
      setValidationState(prev => ({ ...prev, [column]: isValid }));
    }
  };

  const handleSave = () => {
    if (editingRow === undefined) return;

    const newData = [...data];
    newData[editingRow] = editedData;
    onDataChange(newData);
  };

  const isRowValid = () => {
    return Object.values(validationState).every(Boolean);
  };

  return (
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
                {mappings[column] && (
                  <span className="ml-2 text-fundspoke-500">
                    → {mappings[column]}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                rowIndex === editingRow && "bg-fundspoke-50 dark:bg-fundspoke-900/20"
              )}
            >
              {columns.map((column) => (
                <td
                  key={column}
                  className="px-6 py-4 whitespace-nowrap text-sm"
                >
                  {rowIndex === editingRow ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editedData[column] || ''}
                        onChange={(e) => handleFieldChange(column, e.target.value)}
                        className={cn(
                          validationState[column] === false && "border-red-500"
                        )}
                      />
                      {mappings[column] && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center",
                            validationState[column]
                              ? "bg-green-100 text-green-500"
                              : "bg-red-100 text-red-500"
                          )}
                        >
                          {validationState[column] ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-900 dark:text-white">
                      {row[column]}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {editingRow !== undefined && (
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="outline"
            onClick={() => onDataChange(data)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isRowValid()}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}