import { useState } from 'react';
import { FileText, Download, FileDown, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ExportOptionsProps {
  proposalName: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    description: string;
  }>;
}

export function ExportOptions({ proposalName, sections }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState<'pdf' | 'word' | null>(null);

  const handleExport = async (format: 'pdf' | 'word') => {
    setIsExporting(format);

    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real implementation, this would use proper export libraries
      const filename = `${proposalName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
      
      // Simulate file download
      const element = document.createElement('a');
      element.setAttribute('href', '#');
      element.setAttribute('download', `${filename}.${format === 'pdf' ? 'pdf' : 'docx'}`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Export Proposal
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Download your proposal in different formats
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PDF Export */}
          <div className="relative group">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting !== null}
              className={cn(
                "w-full p-4 rounded-lg border-2 border-dashed",
                "transition-colors duration-200",
                "hover:border-fundspoke-500 hover:bg-fundspoke-50",
                "dark:hover:border-fundspoke-400 dark:hover:bg-fundspoke-900/20",
                isExporting === 'pdf'
                  ? "border-fundspoke-500 dark:border-fundspoke-400"
                  : "border-gray-300 dark:border-gray-600"
              )}
            >
              <div className="flex flex-col items-center justify-center">
                {isExporting === 'pdf' ? (
                  <Loader2 className="h-8 w-8 text-fundspoke-500 dark:text-fundspoke-400 animate-spin" />
                ) : (
                  <FileDown className="h-8 w-8 text-gray-400 group-hover:text-fundspoke-500 dark:group-hover:text-fundspoke-400" />
                )}
                <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {isExporting === 'pdf' ? 'Preparing PDF...' : 'Export as PDF'}
                </span>
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Best for sharing and printing
                </span>
              </div>
            </button>
          </div>

          {/* Word Export */}
          <div className="relative group">
            <button
              onClick={() => handleExport('word')}
              disabled={isExporting !== null}
              className={cn(
                "w-full p-4 rounded-lg border-2 border-dashed",
                "transition-colors duration-200",
                "hover:border-fundspoke-500 hover:bg-fundspoke-50",
                "dark:hover:border-fundspoke-400 dark:hover:bg-fundspoke-900/20",
                isExporting === 'word'
                  ? "border-fundspoke-500 dark:border-fundspoke-400"
                  : "border-gray-300 dark:border-gray-600"
              )}
            >
              <div className="flex flex-col items-center justify-center">
                {isExporting === 'word' ? (
                  <Loader2 className="h-8 w-8 text-fundspoke-500 dark:text-fundspoke-400 animate-spin" />
                ) : (
                  <FileText className="h-8 w-8 text-gray-400 group-hover:text-fundspoke-500 dark:group-hover:text-fundspoke-400" />
                )}
                <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {isExporting === 'word' ? 'Preparing Document...' : 'Export as Word'}
                </span>
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Best for editing and collaboration
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Export Details
          </h3>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Includes Fundspoke branding and formatting
            </li>
            <li className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Preserves all section headings and content
            </li>
            <li className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Maintains proper document structure
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}