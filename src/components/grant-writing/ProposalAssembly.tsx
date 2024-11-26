import { useState, useEffect } from 'react';
import { FileText, MessageSquare, Edit2, Save, X, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { ProposalValidation } from './ProposalValidation';
import { ExportOptions } from './ExportOptions';
import { cn } from '../../lib/utils';

interface Section {
  id: string;
  title: string;
  content: string;
  description: string;
  wordLimit?: number;
  required: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string;
  sections: Section[];
}

interface ProposalAssemblyProps {
  template: Template;
}

export function ProposalAssembly({ template }: ProposalAssemblyProps) {
  const [sections, setSections] = useState<Record<string, Section>>(() => {
    return template.sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: {
        ...section,
        content: '',
      },
    }), {});
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  const handleEditContent = (sectionId: string, content: string) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        content,
      },
    }));
  };

  const handleGenerateContent = async (sectionId: string) => {
    setIsGenerating(prev => ({ ...prev, [sectionId]: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const placeholderContent = `Generated content for ${sections[sectionId].title}. This is a placeholder that would be replaced with actual AI-generated content based on the section requirements and context.`;
    
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        content: placeholderContent,
      },
    }));
    
    setIsGenerating(prev => ({ ...prev, [sectionId]: false }));
  };

  const validationSections = Object.values(sections).map(section => ({
    id: section.id,
    title: section.title,
    content: section.content,
    required: section.required,
    wordLimit: section.wordLimit,
  }));

  return (
    <div className="space-y-6">
      <ProposalValidation sections={validationSections} />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {template.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {template.description}
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {template.sections.map((section) => (
            <div key={section.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {section.title}
                    {section.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {section.description}
                    {section.wordLimit && (
                      <span className="ml-1">
                        (Limit: {section.wordLimit} words)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateContent(section.id)}
                    disabled={isGenerating[section.id]}
                    icon={<MessageSquare className="h-4 w-4" />}
                  >
                    {isGenerating[section.id] ? 'Generating...' : 'Generate Content'}
                  </Button>
                  {editingSection === section.id ? (
                    <Button
                      size="sm"
                      onClick={() => setEditingSection(null)}
                      icon={<Save className="h-4 w-4" />}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSection(section.id)}
                      icon={<Edit2 className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Textarea
                  value={sections[section.id].content}
                  onChange={(e) => handleEditContent(section.id, e.target.value)}
                  placeholder={`Enter content for ${section.title}...`}
                  rows={6}
                  disabled={editingSection !== section.id && !isGenerating[section.id]}
                  className={cn(
                    editingSection === section.id && "ring-2 ring-fundspoke-500"
                  )}
                />
                {section.wordLimit && (
                  <div className="mt-2 flex justify-end">
                    <span className={cn(
                      "text-sm",
                      sections[section.id].content.split(/\s+/).filter(Boolean).length > section.wordLimit
                        ? "text-red-500"
                        : "text-gray-500 dark:text-gray-400"
                    )}>
                      {sections[section.id].content.split(/\s+/).filter(Boolean).length} / {section.wordLimit} words
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExportOptions
        proposalName={template.name}
        sections={Object.values(sections)}
      />
    </div>
  );
}