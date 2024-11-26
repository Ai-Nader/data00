import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { ClientSelect } from '../components/data-entry/ClientSelect';
import { ValidationScore } from '../components/validation/ValidationScore';
import { EligibilityCriteria } from '../components/validation/EligibilityCriteria';
import { FundingOpportunities } from '../components/validation/FundingOpportunities';
import { SuccessProbability } from '../components/validation/SuccessProbability';
import { Recommendations } from '../components/validation/Recommendations';
import { ExportDialog } from '../components/validation/ExportDialog';

interface Client {
  id: string;
  name: string;
  company: string;
}

export function ValidationDashboard() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [validationScore, setValidationScore] = useState<number>(0);
  const [opportunities, setOpportunities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Client Validation & Funding Eligibility
          </h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600 dark:text-gray-400">
            Analyze client eligibility for funding opportunities
          </p>
        </div>
        {selectedClient && (
          <div className="self-start sm:self-center">
            <ExportDialog
              clientName={selectedClient.name}
              validationScore={validationScore}
              opportunities={opportunities}
              recommendations={recommendations}
            />
          </div>
        )}
      </div>

      {/* Client Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Client
        </label>
        <ClientSelect
          selectedClient={selectedClient}
          onSelect={setSelectedClient}
        />
      </div>

      {selectedClient ? (
        <div className="space-y-6">
          {/* Top Stats - Stack on mobile, grid on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-1">
              <ValidationScore 
                clientId={selectedClient.id} 
                score={validationScore}
              />
            </div>
            <div className="lg:col-span-2">
              <EligibilityCriteria 
                clientId={selectedClient.id}
                onCriteriaUpdate={(criteria) => {
                  const score = Math.round(
                    (criteria.filter(c => c.status === 'met').length / criteria.length) * 100
                  );
                  setValidationScore(score);
                }}
              />
            </div>
          </div>

          {/* Funding Opportunities and Success Probability */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <FundingOpportunities 
              clientId={selectedClient.id}
              onOpportunitiesChange={setOpportunities}
            />
            <SuccessProbability 
              clientId={selectedClient.id}
              score={validationScore}
            />
          </div>

          {/* Recommendations - Full width */}
          <Recommendations 
            clientId={selectedClient.id}
            onRecommendationsChange={setRecommendations}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No client selected
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a client to view their validation dashboard
          </p>
        </div>
      )}
    </div>
  );
}