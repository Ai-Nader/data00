import { PenTool, FileText, CheckSquare } from 'lucide-react';

export function GrantHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <PenTool className="h-6 w-6 text-fundspoke-600 dark:text-fundspoke-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Grant Writing Workspace
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Active Proposals
              </h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <CheckSquare className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Completed This Month
              </h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <PenTool className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Success Rate
              </h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">75%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}