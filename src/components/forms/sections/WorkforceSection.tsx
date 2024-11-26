import { DollarSign, Users } from 'lucide-react';
import { ValidatedInput } from '../../ui/ValidatedInput';
import { SectionWrapper } from './SectionWrapper';
import { validateField, revenueSchema, employeesSchema, fieldDescriptions, formatters } from '../../../lib/validation';

interface Revenue {
  year2022: string;
  year2023: string;
  year2024: string;
}

interface Employees {
  fullTime: string;
  partTime: string;
  contractors: string;
}

interface WorkforceData {
  revenue: Revenue;
  employees: Employees;
}

interface WorkforceSectionProps {
  data: WorkforceData;
  onChange: <K extends keyof WorkforceData>(field: K, value: WorkforceData[K]) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onNext?: () => void;
}

export function WorkforceSection({
  data,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onNext,
}: WorkforceSectionProps) {
  const handleRevenueChange = (year: keyof Revenue, value: string) => {
    onChange('revenue', {
      ...data.revenue,
      [year]: value,
    });
  };

  const handleEmployeeChange = (type: keyof Employees, value: string) => {
    onChange('employees', {
      ...data.employees,
      [type]: value,
    });
  };

  const validateRevenueField = (field: keyof Revenue, value: string) => {
    return validateField(revenueSchema.shape[field], value);
  };

  const validateEmployeeField = (field: keyof Employees, value: string) => {
    return validateField(employeesSchema.shape[field], value);
  };

  const getTotalEmployees = () => {
    return Object.values(data.employees).reduce((sum, count) => sum + (parseInt(count) || 0), 0);
  };

  const getRevenueGrowth = () => {
    const rev2022 = parseInt(data.revenue.year2022) || 0;
    const rev2023 = parseInt(data.revenue.year2023) || 0;
    if (rev2022 && rev2023) {
      return ((rev2023 - rev2022) / rev2022 * 100).toFixed(1);
    }
    return null;
  };

  const getSectionStatus = () => {
    const requiredFields = [
      data.revenue.year2022,
      data.revenue.year2023,
      data.employees.fullTime,
      data.employees.partTime,
    ];

    if (requiredFields.every(field => field && field.trim() !== '')) {
      return 'complete';
    }
    if (requiredFields.some(field => field && field.trim() !== '')) {
      return 'in-progress';
    }
    return 'incomplete';
  };

  return (
    <SectionWrapper
      title="Workforce Metrics"
      icon={<Users className="h-5 w-5" />}
      status={getSectionStatus()}
      isExpanded={true}
      onToggle={() => {}}
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onNext={onNext}
      supportingDocs={true}
    >
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Annual Revenue
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ValidatedInput
            label="2022 Revenue"
            value={data.revenue.year2022}
            onChange={(value) => handleRevenueChange('year2022', value)}
            validate={(value) => validateRevenueField('year2022', value)}
            format={formatters.currency}
            icon={<DollarSign className="h-4 w-4" />}
            description={fieldDescriptions.revenue}
            required
            disabled={!isEditing}
            placeholder="Enter 2022 revenue"
          />
          <ValidatedInput
            label="2023 Revenue"
            value={data.revenue.year2023}
            onChange={(value) => handleRevenueChange('year2023', value)}
            validate={(value) => validateRevenueField('year2023', value)}
            format={formatters.currency}
            icon={<DollarSign className="h-4 w-4" />}
            description={fieldDescriptions.revenue}
            required
            disabled={!isEditing}
            placeholder="Enter 2023 revenue"
          />
          <ValidatedInput
            label="2024 Revenue (Projected)"
            value={data.revenue.year2024}
            onChange={(value) => handleRevenueChange('year2024', value)}
            validate={(value) => validateRevenueField('year2024', value)}
            format={formatters.currency}
            icon={<DollarSign className="h-4 w-4" />}
            description={fieldDescriptions.revenue}
            disabled={!isEditing}
            placeholder="Enter projected 2024 revenue"
          />
        </div>

        {getRevenueGrowth() !== null && (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Year-over-Year Revenue Growth (2022-2023):
              <span className={cn(
                "ml-2 font-medium",
                parseFloat(getRevenueGrowth()!) > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}>
                {getRevenueGrowth()}%
              </span>
            </p>
          </div>
        )}

        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Employee Count
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ValidatedInput
            label="Full-Time Employees"
            value={data.employees.fullTime}
            onChange={(value) => handleEmployeeChange('fullTime', value)}
            validate={(value) => validateEmployeeField('fullTime', value)}
            icon={<Users className="h-4 w-4" />}
            description={fieldDescriptions.employees.fullTime}
            required
            disabled={!isEditing}
            placeholder="Enter number of full-time employees"
          />
          <ValidatedInput
            label="Part-Time Employees"
            value={data.employees.partTime}
            onChange={(value) => handleEmployeeChange('partTime', value)}
            validate={(value) => validateEmployeeField('partTime', value)}
            icon={<Users className="h-4 w-4" />}
            description={fieldDescriptions.employees.partTime}
            required
            disabled={!isEditing}
            placeholder="Enter number of part-time employees"
          />
          <ValidatedInput
            label="Contract Workers"
            value={data.employees.contractors}
            onChange={(value) => handleEmployeeChange('contractors', value)}
            validate={(value) => validateEmployeeField('contractors', value)}
            icon={<Users className="h-4 w-4" />}
            description={fieldDescriptions.employees.contractors}
            disabled={!isEditing}
            placeholder="Enter number of contractors"
          />
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Workforce:
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {getTotalEmployees()} employees
            </span>
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}