import { useState } from 'react';
import { GrantSelectionPanel } from '../components/grant-writing/GrantSelectionPanel';
import { PreWritingChecklist } from '../components/grant-writing/PreWritingChecklist';
import { ApplicationQuestionsPanel } from '../components/grant-writing/ApplicationQuestionsPanel';
import { ProposalTemplateLibrary } from '../components/grant-writing/ProposalTemplateLibrary';
import { ProposalAssembly } from '../components/grant-writing/ProposalAssembly';
import { GrantHeader } from '../components/grant-writing/GrantHeader';

export function GrantWriting() {
  const [selectedGrantId, setSelectedGrantId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <GrantHeader />
      
      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GrantSelectionPanel
              selectedGrantId={selectedGrantId}
              onSelectGrant={setSelectedGrantId}
            />
          </div>
          <div className="lg:col-span-1">
            <PreWritingChecklist grantId={selectedGrantId} />
          </div>
        </div>

        {selectedGrantId && !selectedTemplate && (
          <div className="mt-6">
            <ProposalTemplateLibrary
              onSelectTemplate={setSelectedTemplate}
            />
          </div>
        )}

        {selectedGrantId && selectedTemplate && (
          <div className="mt-6">
            <ProposalAssembly template={selectedTemplate} />
          </div>
        )}
      </div>
    </div>
  );
}