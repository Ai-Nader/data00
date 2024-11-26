import { Globe, Linkedin, Twitter, Facebook } from 'lucide-react';
import { ValidatedInput } from '../../ui/ValidatedInput';
import { SectionWrapper } from './SectionWrapper';
import { validateField, onlinePresenceSchema, fieldDescriptions } from '../../../lib/validation';

interface OnlinePresenceData {
  website: string;
  linkedin: string;
  twitter: string;
  facebook: string;
}

interface OnlinePresenceSectionProps {
  data: OnlinePresenceData;
  onChange: <K extends keyof OnlinePresenceData>(field: K, value: OnlinePresenceData[K]) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onNext?: () => void;
}

export function OnlinePresenceSection({
  data,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onNext,
}: OnlinePresenceSectionProps) {
  const validateOnlineField = (field: keyof OnlinePresenceData, value: string) => {
    return validateField(onlinePresenceSchema.shape[field], value);
  };

  const getSectionStatus = () => {
    // Check if any field has a non-empty value
    const hasAnyField = Object.values(data).some(value => 
      typeof value === 'string' && value.trim() !== ''
    );

    // Validate all non-empty fields
    const allFieldsValid = Object.entries(data).every(([field, value]) => {
      if (typeof value !== 'string' || !value.trim()) return true;
      return validateOnlineField(field as keyof OnlinePresenceData, value).isValid;
    });

    if (hasAnyField && allFieldsValid) {
      return 'complete';
    }
    if (hasAnyField) {
      return 'in-progress';
    }
    return 'incomplete';
  };

  return (
    <SectionWrapper
      title="Online Presence"
      icon={<Globe className="h-5 w-5" />}
      status={getSectionStatus()}
      isExpanded={true}
      onToggle={() => {}}
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onNext={onNext}
      colorTheme="lavender"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValidatedInput
          label="Website URL"
          type="url"
          value={data.website}
          onChange={(value) => onChange('website', value)}
          validate={(value) => validateOnlineField('website', value)}
          icon={<Globe className="h-4 w-4" />}
          description={fieldDescriptions.online.website}
          disabled={!isEditing}
          placeholder="Enter website URL"
          className="col-span-2"
        />

        <ValidatedInput
          label="LinkedIn Company Page"
          type="url"
          value={data.linkedin}
          onChange={(value) => onChange('linkedin', value)}
          validate={(value) => validateOnlineField('linkedin', value)}
          icon={<Linkedin className="h-4 w-4" />}
          description={fieldDescriptions.online.linkedin}
          disabled={!isEditing}
          placeholder="Enter LinkedIn company page URL"
        />

        <ValidatedInput
          label="Twitter Profile"
          type="url"
          value={data.twitter}
          onChange={(value) => onChange('twitter', value)}
          validate={(value) => validateOnlineField('twitter', value)}
          icon={<Twitter className="h-4 w-4" />}
          description={fieldDescriptions.online.twitter}
          disabled={!isEditing}
          placeholder="Enter Twitter profile URL"
        />

        <ValidatedInput
          label="Facebook Page"
          type="url"
          value={data.facebook}
          onChange={(value) => onChange('facebook', value)}
          validate={(value) => validateOnlineField('facebook', value)}
          icon={<Facebook className="h-4 w-4" />}
          description={fieldDescriptions.online.facebook}
          disabled={!isEditing}
          placeholder="Enter Facebook page URL"
          className="col-span-2"
        />
      </div>
    </SectionWrapper>
  );
}