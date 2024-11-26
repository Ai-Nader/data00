import { User, Mail, Phone, Linkedin, Upload } from 'lucide-react';
import { ValidatedInput } from '../../ui/ValidatedInput';
import { SectionWrapper } from './SectionWrapper';
import { validateField, contactSchema, fieldDescriptions, formatters } from '../../../lib/validation';

interface ContactData {
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  contactLinkedin: string;
}

interface ContactSectionProps {
  data: ContactData;
  onChange: <K extends keyof ContactData>(field: K, value: ContactData[K]) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onNext?: () => void;
}

export function ContactSection({
  data,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onNext,
}: ContactSectionProps) {
  const validateContactField = (field: keyof ContactData, value: string) => {
    return validateField(contactSchema.shape[field], value);
  };

  const getSectionStatus = () => {
    const requiredFields = [
      data.contactName,
      data.contactPosition,
      data.contactEmail,
      data.contactPhone,
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
      title="Main Contact Information"
      icon={<User className="h-5 w-5" />}
      status={getSectionStatus()}
      isExpanded={true}
      onToggle={() => {}}
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onNext={onNext}
      supportingDocs={true}
      colorTheme="sky"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValidatedInput
          label="Contact Name"
          value={data.contactName}
          onChange={(value) => onChange('contactName', value)}
          validate={(value) => validateContactField('contactName', value)}
          icon={<User className="h-4 w-4" />}
          description={fieldDescriptions.contact.name}
          required
          disabled={!isEditing}
          placeholder="Enter contact name"
        />

        <ValidatedInput
          label="Position"
          value={data.contactPosition}
          onChange={(value) => onChange('contactPosition', value)}
          validate={(value) => validateContactField('contactPosition', value)}
          icon={<User className="h-4 w-4" />}
          description={fieldDescriptions.contact.position}
          required
          disabled={!isEditing}
          placeholder="Enter position"
        />

        <ValidatedInput
          label="Email Address"
          type="email"
          value={data.contactEmail}
          onChange={(value) => onChange('contactEmail', value)}
          validate={(value) => validateContactField('contactEmail', value)}
          icon={<Mail className="h-4 w-4" />}
          description={fieldDescriptions.contact.email}
          required
          disabled={!isEditing}
          placeholder="Enter email address"
        />

        <ValidatedInput
          label="Phone Number"
          type="tel"
          value={data.contactPhone}
          onChange={(value) => onChange('contactPhone', value)}
          validate={(value) => validateContactField('contactPhone', value)}
          format={formatters.phone}
          icon={<Phone className="h-4 w-4" />}
          description={fieldDescriptions.contact.phone}
          required
          disabled={!isEditing}
          placeholder="Enter phone number"
        />

        <ValidatedInput
          label="LinkedIn Profile"
          type="url"
          value={data.contactLinkedin}
          onChange={(value) => onChange('contactLinkedin', value)}
          validate={(value) => validateContactField('contactLinkedin', value)}
          icon={<Linkedin className="h-4 w-4" />}
          description={fieldDescriptions.contact.linkedin}
          disabled={!isEditing}
          placeholder="Enter LinkedIn profile URL"
          className="col-span-2"
        />
      </div>
    </SectionWrapper>
  );
}