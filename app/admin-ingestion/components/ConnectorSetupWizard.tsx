// app/admin-ingestion/components/ConnectorSetupWizard.tsx

"use client";

import { useState } from 'react';
import { mockConnectorTemplates } from '@/lib/admin-ingestion-mock-data';
import { ConnectorTemplate } from '@/types/admin-ingestion';

interface ConnectorSetupWizardProps {
  templateId: string | null;
  onClose: () => void;
}

function InfoIconSmall() {
  return (
    <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function ConnectorSetupWizard({ templateId, onClose }: ConnectorSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ConnectorTemplate | null>(
    templateId ? mockConnectorTemplates.find(t => t.id === templateId) || null : null
  );
  const [config, setConfig] = useState<Record<string, any>>({});

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    console.log('Creating connector with config:', config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Add New Connector</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Step {step} of 4: {
                  step === 1 ? 'Select Template' :
                  step === 2 ? 'Configure Connection' :
                  step === 3 ? 'Set Schedule' :
                  'Review & Create'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  i <= step ? 'bg-blue-500' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Select a Connector Template</h3>
              <div className="grid gap-4">
                {mockConnectorTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`bg-background border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-border hover:border-blue-500/50'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">Type: {template.type}</span>
                          <span className="text-xs text-muted-foreground">Provider: {template.provider}</span>
                        </div>
                      </div>
                      {template.popular && (
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && selectedTemplate && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Configure Connection</h3>
              
              {/* Required Fields */}
              {selectedTemplate.requiredFields.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white">Required Fields</h4>
                  {selectedTemplate.requiredFields.map((field) => (
                    <div key={field}>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type={field.includes('key') || field.includes('secret') ? 'password' : 'text'}
                        value={config[field] || ''}
                        onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Optional Fields */}
              {selectedTemplate.optionalFields.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white">Optional Fields</h4>
                  {selectedTemplate.optionalFields.map((field) => (
                    <div key={field}>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type={field.includes('limit') || field.includes('size') ? 'number' : 'text'}
                        value={config[field] || ''}
                        onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${field} (optional)`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Test Connection Button */}
              <button className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-600/30 transition-colors">
                Test Connection
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Set Schedule</h3>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Polling Interval (minutes)
                </label>
                <select
                  value={config.pollingInterval || 60}
                  onChange={(e) => setConfig({ ...config, pollingInterval: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Every hour</option>
                  <option value={120}>Every 2 hours</option>
                  <option value={360}>Every 6 hours</option>
                  <option value={720}>Every 12 hours</option>
                  <option value={1440}>Daily</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="backfill"
                  checked={config.backfillEnabled || false}
                  onChange={(e) => setConfig({ ...config, backfillEnabled: e.target.checked })}
                  className="w-4 h-4 bg-background border border-border rounded text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="backfill" className="text-sm text-white">
                  Enable backfill for historical data
                </label>
              </div>

              {config.backfillEnabled && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Backfill Start Date
                  </label>
                  <input
                    type="date"
                    value={config.backfillStartDate || ''}
                    onChange={(e) => setConfig({ ...config, backfillStartDate: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}

          {step === 4 && selectedTemplate && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Review & Create</h3>
              
              <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Template</p>
                  <p className="text-white">{selectedTemplate.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-white">{selectedTemplate.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Provider</p>
                  <p className="text-white">{selectedTemplate.provider}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Polling Interval</p>
                  <p className="text-white">{config.pollingInterval || 60} minutes</p>
                </div>
                {config.backfillEnabled && (
                  <div>
                    <p className="text-xs text-muted-foreground">Backfill</p>
                    <p className="text-white">Enabled from {config.backfillStartDate}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start">
                <InfoIconSmall />
                <p className="text-sm text-blue-400">
                  The connector will start syncing data immediately after creation
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-4 py-2 border border-border rounded-lg transition-colors ${
                step === 1
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-white hover:bg-background'
              }`}
            >
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!selectedTemplate}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedTemplate
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Connector
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
