import { Building2, Calendar, Hash, MapPin } from 'lucide-react';
import { ValidatedInput } from '../../ui/ValidatedInput';
import { SectionWrapper } from './SectionWrapper';
import { validateField, companySchema, addressSchema, fieldDescriptions, formatters } from '../../../lib/validation';

interface Address {
  street: string;
  province: string;
  postalCode: string;
}

interface CompanyData {
  companyName: string;
  legalName: string;
  incorporationDate: string;
  corporationNumber: string;
  businessNumber: string;
  legalAddress: Address;
  businessAddress: Address;
}

interface CompanySectionProps {
  data: CompanyData;
  onChange: <K extends keyof CompanyData>(field: K, value: CompanyData[K]) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onNext?: () => void;
}

export function CompanySection({
  data,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onNext,
}: CompanySectionProps) {
  const handleAddressChange = (type: 'legal' | 'business', field: keyof Address, value: string) => {
    const addressField = type === 'legal' ? 'legalAddress' : 'businessAddress';
    onChange(addressField, {
      ...data[addressField],
      [field]: value,
    });
  };

  const validateCompanyField = (field: keyof CompanyData, value: string) => {
    return validateField(companySchema.shape[field], value);
  };

  const validateAddressField = (field: keyof Address, value: string) => {
    return validateField(addressSchema.shape[field], value);
  };

  const getSectionStatus = () => {
    const requiredFields = [
      data.companyName,
      data.legalName,
      data.incorporationDate,
      data.corporationNumber,
      data.businessNumber,
      data.legalAddress.street,
      data.legalAddress.province,
      data.legalAddress.postalCode,
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
      title="Company Information"
      icon={<Building2 className="h-5 w-5" />}
      status={getSectionStatus()}
      isExpanded={true}
      onToggle={() => {}}
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onNext={onNext}
      supportingDocs={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValidatedInput
          label="Company Name"
          value={data.companyName}
          onChange={(value) => onChange('companyName', value)}
          validate={(value) => validateCompanyField('companyName', value)}
          icon={<Building2 className="h-4 w-4" />}
          required
          disabled={!isEditing}
          placeholder="Enter company name"
        />

        <ValidatedInput
          label="Legal Name"
          value={data.legalName}
          onChange={(value) => onChange('legalName', value)}
          validate={(value) => validateCompanyField('legalName', value)}
          icon={<Building2 className="h-4 w-4" />}
          required
          disabled={!isEditing}
          placeholder="Enter legal name"
        />

        <ValidatedInput
          label="Incorporation Date"
          type="date"
          value={data.incorporationDate}
          onChange={(value) => onChange('incorporationDate', value)}
          validate={(value) => validateCompanyField('incorporationDate', value)}
          icon={<Calendar className="h-4 w-4" />}
          description={fieldDescriptions.incorporationDate}
          required
          disabled={!isEditing}
        />

        <ValidatedInput
          label="Corporation Number"
          value={data.corporationNumber}
          onChange={(value) => onChange('corporationNumber', value)}
          validate={(value) => validateCompanyField('corporationNumber', value)}
          format={formatters.corporationNumber}
          icon={<Hash className="h-4 w-4" />}
          description={fieldDescriptions.corporationNumber}
          required
          disabled={!isEditing}
          placeholder="Enter corporation number"
        />

        <ValidatedInput
          label="Business Number (CRA)"
          value={data.businessNumber}
          onChange={(value) => onChange('businessNumber', value)}
          validate={(value) => validateCompanyField('businessNumber', value)}
          format={formatters.businessNumber}
          icon={<Hash className="h-4 w-4" />}
          description={fieldDescriptions.businessNumber}
          required
          disabled={!isEditing}
          placeholder="Enter business number"
        />
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Legal Address
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ValidatedInput
              label="Street"
              value={data.legalAddress.street}
              onChange={(value) => handleAddressChange('legal', 'street', value)}
              validate={(value) => validateAddressField('street', value)}
              icon={<MapPin className="h-4 w-4" />}
              required
              disabled={!isEditing}
              placeholder="Enter street address"
              className="col-span-2"
            />
            <ValidatedInput
              label="Province"
              value={data.legalAddress.province}
              onChange={(value) => handleAddressChange('legal', 'province', value)}
              validate={(value) => validateAddressField('province', value)}
              required
              disabled={!isEditing}
              placeholder="Province"
            />
            <ValidatedInput
              label="Postal Code"
              value={data.legalAddress.postalCode}
              onChange={(value) => handleAddressChange('legal', 'postalCode', value)}
              validate={(value) => validateAddressField('postalCode', value)}
              format={formatters.postalCode}
              description={fieldDescriptions.postalCode}
              required
              disabled={!isEditing}
              placeholder="A1A 1A1"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Business Address
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ValidatedInput
              label="Street"
              value={data.businessAddress.street}
              onChange={(value) => handleAddressChange('business', 'street', value)}
              validate={(value) => validateAddressField('street', value)}
              icon={<MapPin className="h-4 w-4" />}
              required
              disabled={!isEditing}
              placeholder="Enter street address"
              className="col-span-2"
            />
            <ValidatedInput
              label="Province"
              value={data.businessAddress.province}
              onChange={(value) => handleAddressChange('business', 'province', value)}
              validate={(value) => validateAddressField('province', value)}
              required
              disabled={!isEditing}
              placeholder="Province"
            />
            <ValidatedInput
              label="Postal Code"
              value={data.businessAddress.postalCode}
              onChange={(value) => handleAddressChange('business', 'postalCode', value)}
              validate={(value) => validateAddressField('postalCode', value)}
              format={formatters.postalCode}
              description={fieldDescriptions.postalCode}
              required
              disabled={!isEditing}
              placeholder="A1A 1A1"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}