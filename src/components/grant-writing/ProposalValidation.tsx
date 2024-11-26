import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ValidationIssue {
  id: string;
  type: 'error' | 'warning';
  message: string;
  section?: string;
  details?: string;
  action?: string;
}

interface ProposalValidationProps {
  sections: Array<{
    id: string;
    title: string;
    content: string;
    required: boolean;
    wordLimit?: number;
  }>;
}

export function ProposalValidation({ sections }: ProposalValidationProps) {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const validateProposal = () => {
    setIsValidating(true);
    const newIssues: ValidationIssue[] = [];

    sections.forEach(section => {
      // Check for empty required sections
      if (section.required && (!section.content || section.content.trim() === '')) {
        newIssues.push({
          id: `empty-${section.id}`,
          type: 'error',
          message: `${section.title} is required`,
          section: section.title,
          details: 'This section must be completed before submission',
          action: 'Add content to this section'
        });
      }

      // Check word limits
      if (section.wordLimit) {
        const wordCount = section.content.trim().split(/\s+/).length;
        if (wordCount > section.wordLimit) {
          newIssues.push({
            id: `wordlimit-${section.id}`,
            type: 'error',
            message: `${section.title} exceeds word limit`,
            section: section.title,
            details: `Current: ${wordCount} words / Limit: ${section.wordLimit} words`,
            action: `Remove ${wordCount - section.wordLimit} words`
          });
        } else if (wordCount < section.wordLimit * 0.8) {
          newIssues.push({
            id: `wordcount-${section.id}`,
            type: 'warning',
            message: `${section.title} may be too brief`,
            section: section.title,
            details: `Current: ${wordCount} words / Target: ${section.wordLimit} words`,
            action: 'Consider adding more detail'
          });
        }
      }

      // Check for formatting issues
      if (section.content) {
        // Check for consistent capitalization
        if (!/^[A-Z]/.test(section.content)) {
          newIssues.push({
            id: `format-caps-${section.id}`,
            type: 'warning',
            message: `${section.title} should start with a capital letter`,
            section: section.title,
            action: 'Capitalize the first letter'
          });
        }

        // Check for proper sentence endings
        if (!/[.!?]$/.test(section.content.trim())) {
          newIssues.push({
            id: `format-end-${section.id}`,
            type: 'warning',
            message: `${section.title} should end with proper punctuation`,
            section: section.title,
            action: 'Add appropriate ending punctuation'
          });
        }
      }
    });

    // Check for overall proposal completeness
    const completedSections = sections.filter(s => s.content && s.content.trim() !== '').length;
    const completionPercentage = (completedSections / sections.length) * 100;

    if (completionPercentage < 100) {
      newIssues.push({
        id: 'completion',
        type: 'warning',
        message: 'Proposal is incomplete',
        details: `${completionPercentage.toFixed(0)}% complete`,
        action: 'Complete all sections'
      });
    }

    setIssues(newIssues);
    setIsValidating(false);
  };

  useEffect(() => {
    validateProposal();
  }, [sections]);

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Proposal Validation
          </h2>
          <div className="flex items-center space-x-2">
            {errorCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {errorCount} {errorCount === 1 ? 'Error' : 'Errors'}
              </span>
            )}
            {warningCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                {warningCount} {warningCount === 1 ? 'Warning' : 'Warnings'}
              </span>
            )}
            {errorCount === 0 && warningCount === 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                All Checks Passed
              </span>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Checking proposal against submission requirements
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={validateProposal}
              disabled={isValidating}
            >
              {isValidating ? 'Validating...' : 'Revalidate'}
            </Button>
          </div>

          {issues.length > 0 ? (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className={cn(
                    "rounded-lg p-4",
                    issue.type === 'error'
                      ? "bg-red-50 dark:bg-red-900/20"
                      : "bg-yellow-50 dark:bg-yellow-900/20"
                  )}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {issue.type === 'error' ? (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className={cn(
                        "text-sm font-medium",
                        issue.type === 'error'
                          ? "text-red-800 dark:text-red-200"
                          : "text-yellow-800 dark:text-yellow-200"
                      )}>
                        {issue.message}
                      </h3>
                      {issue.section && (
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          Section: {issue.section}
                        </p>
                      )}
                      {issue.details && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {issue.details}
                        </p>
                      )}
                      {issue.action && (
                        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                          Action needed: {issue.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 text-center">
              <div>
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  All Validation Checks Passed
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your proposal meets all submission requirements
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}