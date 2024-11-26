import { useState } from 'react';
import { FileText, ArrowRight, Tag, DollarSign, Target, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface TemplateSection {
  id: string;
  title: string;
  description: string;
  wordLimit?: number;
  required: boolean;
}

interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fundingRange: string;
  sections: TemplateSection[];
  tags: string[];
}

const templates: ProposalTemplate[] = [
  {
    id: 'innovation-grant',
    name: 'Innovation Grant Proposal',
    description: 'Template for technology and innovation-focused grant applications with emphasis on market impact and scalability.',
    category: 'Technology & Innovation',
    fundingRange: '$50,000 - $250,000',
    tags: ['Technology', 'Innovation', 'R&D'],
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        description: 'Brief overview of the innovation project and its potential impact.',
        wordLimit: 300,
        required: true,
      },
      {
        id: 'tech-overview',
        title: 'Technical Overview',
        description: 'Detailed description of the technology and innovation aspects.',
        wordLimit: 500,
        required: true,
      },
      {
        id: 'market-impact',
        title: 'Market Impact',
        description: 'Analysis of market potential and commercial viability.',
        wordLimit: 400,
        required: true,
      },
      {
        id: 'implementation',
        title: 'Implementation Plan',
        description: 'Timeline and methodology for project execution.',
        wordLimit: 600,
        required: true,
      },
      {
        id: 'budget',
        title: 'Budget Breakdown',
        description: 'Detailed cost structure and resource allocation.',
        required: true,
      },
    ],
  },
  {
    id: 'research-grant',
    name: 'Research Funding Proposal',
    description: 'Comprehensive template for research-focused grants with emphasis on methodology and outcomes.',
    category: 'Research & Development',
    fundingRange: '$100,000 - $500,000',
    tags: ['Research', 'Academic', 'Development'],
    sections: [
      {
        id: 'abstract',
        title: 'Research Abstract',
        description: 'Concise summary of research objectives and methodology.',
        wordLimit: 250,
        required: true,
      },
      {
        id: 'background',
        title: 'Background & Significance',
        description: 'Context and importance of the research.',
        wordLimit: 600,
        required: true,
      },
      {
        id: 'methodology',
        title: 'Research Methodology',
        description: 'Detailed research approach and methods.',
        wordLimit: 800,
        required: true,
      },
      {
        id: 'timeline',
        title: 'Project Timeline',
        description: 'Research phases and milestones.',
        wordLimit: 400,
        required: true,
      },
      {
        id: 'budget',
        title: 'Budget & Resources',
        description: 'Detailed breakdown of funding requirements.',
        required: true,
      },
    ],
  },
  {
    id: 'community-impact',
    name: 'Community Impact Grant',
    description: 'Template focused on social impact and community development initiatives.',
    category: 'Social Impact',
    fundingRange: '$25,000 - $150,000',
    tags: ['Community', 'Social Impact', 'Development'],
    sections: [
      {
        id: 'summary',
        title: 'Project Summary',
        description: 'Overview of the community initiative and its goals.',
        wordLimit: 300,
        required: true,
      },
      {
        id: 'need',
        title: 'Community Need',
        description: 'Assessment of community needs and gaps.',
        wordLimit: 500,
        required: true,
      },
      {
        id: 'impact',
        title: 'Impact Assessment',
        description: 'Expected outcomes and community benefits.',
        wordLimit: 600,
        required: true,
      },
      {
        id: 'sustainability',
        title: 'Sustainability Plan',
        description: 'Long-term sustainability and community engagement.',
        wordLimit: 400,
        required: true,
      },
      {
        id: 'budget',
        title: 'Budget & Resources',
        description: 'Cost breakdown and resource allocation.',
        required: true,
      },
    ],
  },
];

interface ProposalTemplateLibraryProps {
  onSelectTemplate: (template: ProposalTemplate) => void;
}

export function ProposalTemplateLibrary({ onSelectTemplate }: ProposalTemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = selectedCategory
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  const handleTemplateClick = (template: ProposalTemplate) => {
    if (expandedTemplateId === template.id) {
      onSelectTemplate(template);
    } else {
      setExpandedTemplateId(template.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Proposal Templates
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select a template to start your proposal
        </p>
      </div>

      <div className="p-6">
        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "border rounded-lg overflow-hidden transition-all duration-200",
                expandedTemplateId === template.id
                  ? "border-fundspoke-500 dark:border-fundspoke-400"
                  : "border-gray-200 dark:border-gray-700"
              )}
            >
              <button
                onClick={() => handleTemplateClick(template)}
                className="w-full text-left"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-fundspoke-100 dark:bg-fundspoke-900 rounded-lg">
                        <FileText className="h-6 w-6 text-fundspoke-600 dark:text-fundspoke-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className={cn(
                      "h-5 w-5 text-gray-400 transition-transform duration-200",
                      expandedTemplateId === template.id && "transform rotate-90"
                    )} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Tag className="h-4 w-4 mr-1" />
                      {template.category}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {template.fundingRange}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fundspoke-100 text-fundspoke-800 dark:bg-fundspoke-900 dark:text-fundspoke-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedTemplateId === template.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Template Sections
                  </h4>
                  <div className="space-y-4">
                    {template.sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="p-1 bg-white dark:bg-gray-800 rounded">
                          {section.id === 'exec-summary' && <Target className="h-4 w-4 text-blue-500" />}
                          {section.id === 'budget' && <DollarSign className="h-4 w-4 text-green-500" />}
                          {section.id === 'impact' && <Users className="h-4 w-4 text-purple-500" />}
                          {!['exec-summary', 'budget', 'impact'].includes(section.id) && (
                            <FileText className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {section.title}
                            {section.required && (
                              <span className="ml-1 text-red-500">*</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {section.description}
                            {section.wordLimit && (
                              <span className="ml-1">
                                ({section.wordLimit} words)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => onSelectTemplate(template)}
                      className="w-full"
                    >
                      Use This Template
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}