import { useState } from 'react';
import { User, Mail, Phone, Globe, Linkedin, Twitter, Facebook, Building2, Calendar, Hash, Users, DollarSign, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { CompanySection } from './sections/CompanySection';
import { WorkforceSection } from './sections/WorkforceSection';
import { ContactSection } from './sections/ContactSection';
import { OnlinePresenceSection } from './sections/OnlinePresenceSection';

interface Address {
  street: string;
  province: string;
  postalCode: string;
}

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

interface ClientInfo {
  // Company Information
  companyName: string;
  legalName: string;
  incorporationDate: string;
  corporationNumber: string;
  businessNumber: string;
  legalAddress: Address;
  businessAddress: Address;
  
  // Workforce Metrics
  revenue: Revenue;
  employees: Employees;
  
  // Main Contact
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  contactLinkedin: string;
  
  // Social Media & Website
  website: string;
  linkedin: string;
  twitter: string;
  facebook: string;
}

interface ClientInfoFormProps {
  clientId: string;
  initialData?: Partial<ClientInfo>;
  onSave: (data: ClientInfo) => void;
}

interface Section {
  id: keyof typeof sectionTitles;
  title: string;
  icon: JSX.Element;
}

const sectionTitles = {
  company: 'Company Information',
  workforce: 'Workforce Metrics',
  contact: 'Main Contact Information',
  online: 'Online Presence',
} as const;

const sections: Section[] = [
  { id: 'company', title: sectionTitles.company, icon: <Building2 className="h-5 w-5" /> },
  { id: 'workforce', title: sectionTitles.workforce, icon: <Users className="h-5 w-5" /> },
  { id: 'contact', title: sectionTitles.contact, icon: <User className="h-5 w-5" /> },
  { id: 'online', title: sectionTitles.online, icon: <Globe className="h-5 w-5" /> },
];

const defaultAddress: Address = {
  street: '',
  province: '',
  postalCode: '',
};

const defaultRevenue: Revenue = {
  year2022: '',
  year2023: '',
  year2024: '',
};

const defaultEmployees: Employees = {
  fullTime: '',
  partTime: '',
  contractors: '',
};

export function ClientInfoForm({ clientId, initialData, onSave }: ClientInfoFormProps) {
  const [formData, setFormData] = useState<ClientInfo>({
    companyName: initialData?.companyName || '',
    legalName: initialData?.legalName || '',
    incorporationDate: initialData?.incorporationDate || '',
    corporationNumber: initialData?.corporationNumber || '',
    businessNumber: initialData?.businessNumber || '',
    legalAddress: initialData?.legalAddress || defaultAddress,
    businessAddress: initialData?.businessAddress || defaultAddress,
    revenue: initialData?.revenue || defaultRevenue,
    employees: initialData?.employees || defaultEmployees,
    contactName: initialData?.contactName || '',
    contactPosition: initialData?.contactPosition || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
    contactLinkedin: initialData?.contactLinkedin || '',
    website: initialData?.website || '',
    linkedin: initialData?.linkedin || '',
    twitter: initialData?.twitter || '',
    facebook: initialData?.facebook || '',
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['company']));
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = <T extends keyof ClientInfo>(field: T, value: ClientInfo[T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSection = (sectionId: string) => {
    setEditingSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
    // In a real application, you might want to save just this section to the backend
  };

  const handleEditSection = (sectionId: string) => {
    setEditingSections(prev => {
      const newSet = new Set(prev);
      newSet.add(sectionId);
      return newSet;
    });
  };

  const SectionHeader = ({ section }: { section: Section }) => (
    <button
      type="button"
      onClick={() => toggleSection(section.id)}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-lg",
        "transition-colors duration-200",
        "hover:bg-gray-50 dark:hover:bg-gray-700",
        expandedSections.has(section.id)
          ? "bg-gray-50 dark:bg-gray-700"
          : "bg-white dark:bg-gray-800"
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          expandedSections.has(section.id)
            ? "bg-fundspoke-100 dark:bg-fundspoke-900"
            : "bg-gray-100 dark:bg-gray-700"
        )}>
          {section.icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {section.title}
        </h3>
      </div>
      {expandedSections.has(section.id) ? (
        <ChevronUp className="h-5 w-5 text-gray-400" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="relative pb-20">
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <SectionHeader section={section} />
            
            <AnimatePresence>
              {expandedSections.has(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    {section.id === 'company' && (
                      <CompanySection
                        data={formData}
                        onChange={handleChange}
                        isEditing={editingSections.has('company')}
                        onEdit={() => handleEditSection('company')}
                        onSave={() => handleSaveSection('company')}
                      />
                    )}

                    {section.id === 'workforce' && (
                      <WorkforceSection
                        data={formData}
                        onChange={handleChange}
                        isEditing={editingSections.has('workforce')}
                        onEdit={() => handleEditSection('workforce')}
                        onSave={() => handleSaveSection('workforce')}
                      />
                    )}

                    {section.id === 'contact' && (
                      <ContactSection
                        data={formData}
                        onChange={handleChange}
                        isEditing={editingSections.has('contact')}
                        onEdit={() => handleEditSection('contact')}
                        onSave={() => handleSaveSection('contact')}
                      />
                    )}

                    {section.id === 'online' && (
                      <OnlinePresenceSection
                        data={formData}
                        onChange={handleChange}
                        isEditing={editingSections.has('online')}
                        onEdit={() => handleEditSection('online')}
                        onSave={() => handleSaveSection('online')}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 right-0 p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-10">
        <Button type="submit" size="lg">
          Save All Changes
        </Button>
      </div>
    </form>
  );
}