// app/alerts/components/CreateAlertWizard.tsx
'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Alert,
  AlertCondition,
  AlertFrequency,
  AlertSeverity,
  AlertTemplate,
  DeliveryChannel,
  TriggerType,
} from '@/types/alerts';
import { mockAlertTemplates } from '@/lib/alerts-mock-data';

interface CreateAlertWizardProps {
  onClose: () => void;
  onSave: (alert: Partial<Alert>) => void;
  editingAlert?: Alert;
}

export default function CreateAlertWizard({
  onClose,
  onSave,
  editingAlert,
}: CreateAlertWizardProps) {
  const [step, setStep] = useState(1);
  const [alertData, setAlertData] = useState<Partial<Alert>>(
    editingAlert || {
      name: '',
      description: '',
      severity: 'medium',
      triggerType: 'query',
      conditions: [],
      frequency: 'daily',
      deliveryChannels: [],
      dedupRules: {
        enabled: true,
        window: 60,
        field: 'title',
      },
      throttle: {
        enabled: false,
        suppressionWindow: 30,
        maxEventsPerWindow: 5,
      },
      teamSubscriptions: [],
    }
  );

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = () => {
    onSave(alertData);
    onClose();
  };

  const canProceed = () => {
    if (step === 1) {
      return alertData.name && alertData.description;
    }
    if (step === 2) {
      return alertData.conditions && alertData.conditions.length > 0;
    }
    if (step === 3) {
      return alertData.deliveryChannels && alertData.deliveryChannels.length > 0;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold">
              {editingAlert ? 'Edit Alert' : 'Create New Alert'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {step} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {step === 1 && (
            <BasicInfoStep alertData={alertData} setAlertData={setAlertData} />
          )}
          {step === 2 && (
            <TriggerConditionsStep
              alertData={alertData}
              setAlertData={setAlertData}
            />
          )}
          {step === 3 && (
            <DeliverySettingsStep
              alertData={alertData}
              setAlertData={setAlertData}
            />
          )}
          {step === 4 && (
            <ReviewStep alertData={alertData} setAlertData={setAlertData} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Check className="h-4 w-4" />
                {editingAlert ? 'Update Alert' : 'Create Alert'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Basic Information
interface StepProps {
  alertData: Partial<Alert>;
  setAlertData: (data: Partial<Alert>) => void;
}

function BasicInfoStep({ alertData, setAlertData }: StepProps) {
  const [showTemplates, setShowTemplates] = useState(false);

  const applyTemplate = (template: AlertTemplate) => {
    setAlertData({
      ...alertData,
      name: template.name,
      description: template.description,
      triggerType: template.triggerType,
      conditions: template.defaultConditions,
      frequency: template.recommendedFrequency,
    });
    setShowTemplates(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <p className="text-sm text-muted-foreground">
          Start with a template or create from scratch
        </p>
      </div>

      {/* Templates */}
      {showTemplates ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Choose a Template</h4>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Start from scratch
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockAlertTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template)}
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-accent text-left transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium mb-1">{template.name}</h5>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowTemplates(true)}
          className="w-full p-4 rounded-lg border border-dashed border-border hover:border-primary hover:bg-accent transition-colors flex items-center justify-center gap-2 text-muted-foreground"
        >
          <Sparkles className="h-4 w-4" />
          Use a Template
        </button>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Alert Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={alertData.name || ''}
            onChange={(e) => setAlertData({ ...alertData, name: e.target.value })}
            placeholder="e.g., Quantum Computing Breakthroughs"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={alertData.description || ''}
            onChange={(e) =>
              setAlertData({ ...alertData, description: e.target.value })
            }
            placeholder="What should this alert monitor?"
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Severity</label>
            <select
              value={alertData.severity || 'medium'}
              onChange={(e) =>
                setAlertData({
                  ...alertData,
                  severity: e.target.value as AlertSeverity,
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <select
              value={alertData.frequency || 'daily'}
              onChange={(e) =>
                setAlertData({
                  ...alertData,
                  frequency: e.target.value as AlertFrequency,
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="real-time">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Trigger Conditions
function TriggerConditionsStep({ alertData, setAlertData }: StepProps) {
  const addCondition = () => {
    const newCondition: AlertCondition = {
      id: `cond-${Date.now()}`,
      field: 'domain',
      operator: 'equals',
      value: '',
    };
    setAlertData({
      ...alertData,
      conditions: [...(alertData.conditions || []), newCondition],
    });
  };

  const removeCondition = (id: string) => {
    setAlertData({
      ...alertData,
      conditions: alertData.conditions?.filter((c) => c.id !== id),
    });
  };

  const updateCondition = (id: string, updates: Partial<AlertCondition>) => {
    setAlertData({
      ...alertData,
      conditions: alertData.conditions?.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Trigger Conditions</h3>
        <p className="text-sm text-muted-foreground">
          Define when this alert should trigger
        </p>
      </div>

      {/* Trigger Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Trigger Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['query', 'threshold', 'entity', 'signal'] as TriggerType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setAlertData({ ...alertData, triggerType: type })}
                className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                  alertData.triggerType === type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                {type}
              </button>
            )
          )}
        </div>
      </div>

      {/* Conditions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Conditions</label>
          <button
            onClick={addCondition}
            className="text-sm text-primary hover:underline"
          >
            + Add Condition
          </button>
        </div>

        {alertData.conditions && alertData.conditions.length > 0 ? (
          alertData.conditions.map((condition, index) => (
            <div
              key={condition.id}
              className="p-4 rounded-lg border border-border space-y-3"
            >
              {index > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={condition.logic || 'AND'}
                    onChange={(e) =>
                      updateCondition(condition.id, { logic: e.target.value as 'AND' | 'OR' })
                    }
                    className="px-2 py-1 rounded border border-border bg-background text-sm"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={condition.field}
                  onChange={(e) =>
                    updateCondition(condition.id, { field: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="domain">Domain</option>
                  <option value="trl">TRL</option>
                  <option value="keywords">Keywords</option>
                  <option value="organization">Organization</option>
                  <option value="funding_amount">Funding Amount</option>
                  <option value="signal_strength">Signal Strength</option>
                </select>
                <select
                  value={condition.operator}
                  onChange={(e) =>
                    updateCondition(condition.id, {
                      operator: e.target.value as AlertCondition['operator'],
                    })
                  }
                  className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greater_than">Greater than</option>
                  <option value="less_than">Less than</option>
                </select>
                <input
                  type="text"
                  value={condition.value as string}
                  onChange={(e) =>
                    updateCondition(condition.id, { value: e.target.value })
                  }
                  placeholder="Value"
                  className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => removeCondition(condition.id)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conditions added yet</p>
          </div>
        )}
      </div>

      {/* Preview Info */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
        <div className="flex gap-3">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Preview Results</p>
            <p className="opacity-90">
              Based on historical data, this alert would have triggered
              approximately 12 times in the last 7 days with an estimated noise
              level of 15%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Delivery Settings
function DeliverySettingsStep({ alertData, setAlertData }: StepProps) {
  const toggleChannel = (channel: DeliveryChannel) => {
    const channels = alertData.deliveryChannels || [];
    const existingIndex = channels.findIndex((c) => c.channel === channel);

    if (existingIndex >= 0) {
      const updated = [...channels];
      updated[existingIndex] = {
        ...updated[existingIndex],
        enabled: !updated[existingIndex].enabled,
      };
      setAlertData({ ...alertData, deliveryChannels: updated });
    } else {
      setAlertData({
        ...alertData,
        deliveryChannels: [
          ...channels,
          { channel, enabled: true, config: {} },
        ],
      });
    }
  };

  const isChannelEnabled = (channel: DeliveryChannel) => {
    return alertData.deliveryChannels?.some(
      (c) => c.channel === channel && c.enabled
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Delivery Settings</h3>
        <p className="text-sm text-muted-foreground">
          Choose how you want to receive alerts
        </p>
      </div>

      {/* Delivery Channels */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Delivery Channels</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(['in-app', 'email', 'slack', 'webhook'] as DeliveryChannel[]).map(
            (channel) => (
              <button
                key={channel}
                onClick={() => toggleChannel(channel)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  isChannelEnabled(channel)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">
                    {channel.replace('-', ' ')}
                  </span>
                  <div
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                      isChannelEnabled(channel)
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}
                  >
                    {isChannelEnabled(channel) && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {channel === 'in-app' && 'Receive notifications in the app'}
                  {channel === 'email' && 'Get alerts via email'}
                  {channel === 'slack' && 'Post to Slack channel'}
                  {channel === 'webhook' && 'Send to custom endpoint'}
                </p>
              </button>
            )
          )}
        </div>
      </div>

      {/* Deduplication */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Deduplication</label>
        <div className="p-4 rounded-lg border border-border space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={alertData.dedupRules?.enabled || false}
              onChange={(e) =>
                setAlertData({
                  ...alertData,
                  dedupRules: {
                    ...alertData.dedupRules!,
                    enabled: e.target.checked,
                  },
                })
              }
              className="rounded border-border"
            />
            <span className="text-sm">Enable deduplication</span>
          </label>
          {alertData.dedupRules?.enabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Window (minutes)
                </label>
                <input
                  type="number"
                  value={alertData.dedupRules.window}
                  onChange={(e) =>
                    setAlertData({
                      ...alertData,
                      dedupRules: {
                        ...alertData.dedupRules!,
                        window: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Field
                </label>
                <select
                  value={alertData.dedupRules.field}
                  onChange={(e) =>
                    setAlertData({
                      ...alertData,
                      dedupRules: {
                        ...alertData.dedupRules!,
                        field: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="title">Title</option>
                  <option value="url">URL</option>
                  <option value="content_hash">Content Hash</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Throttling */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Throttling</label>
        <div className="p-4 rounded-lg border border-border space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={alertData.throttle?.enabled || false}
              onChange={(e) =>
                setAlertData({
                  ...alertData,
                  throttle: {
                    ...alertData.throttle!,
                    enabled: e.target.checked,
                  },
                })
              }
              className="rounded border-border"
            />
            <span className="text-sm">Enable throttling</span>
          </label>
          {alertData.throttle?.enabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Suppression Window (minutes)
                </label>
                <input
                  type="number"
                  value={alertData.throttle.suppressionWindow}
                  onChange={(e) =>
                    setAlertData({
                      ...alertData,
                      throttle: {
                        ...alertData.throttle!,
                        suppressionWindow: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Max Events
                </label>
                <input
                  type="number"
                  value={alertData.throttle.maxEventsPerWindow}
                  onChange={(e) =>
                    setAlertData({
                      ...alertData,
                      throttle: {
                        ...alertData.throttle!,
                        maxEventsPerWindow: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 4: Review
function ReviewStep({ alertData }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
        <p className="text-sm text-muted-foreground">
          Review your alert configuration before creating
        </p>
      </div>

      <div className="space-y-4">
        <ReviewSection title="Basic Information">
          <ReviewItem label="Name" value={alertData.name || 'N/A'} />
          <ReviewItem
            label="Description"
            value={alertData.description || 'N/A'}
          />
          <ReviewItem
            label="Severity"
            value={alertData.severity || 'N/A'}
            badge
          />
          <ReviewItem
            label="Frequency"
            value={alertData.frequency || 'N/A'}
            badge
          />
        </ReviewSection>

        <ReviewSection title="Trigger Conditions">
          <ReviewItem
            label="Type"
            value={alertData.triggerType || 'N/A'}
            badge
          />
          <div className="text-sm">
            <span className="text-muted-foreground">Conditions:</span>
            <div className="mt-2 space-y-2">
              {alertData.conditions?.map((condition, index) => (
                <div
                  key={condition.id}
                  className="p-2 rounded bg-accent/50 text-xs"
                >
                  {index > 0 && (
                    <span className="font-semibold text-primary mr-2">
                      {condition.logic}
                    </span>
                  )}
                  {condition.field} {condition.operator} {condition.value as string}
                </div>
              ))}
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Delivery Settings">
          <div className="text-sm">
            <span className="text-muted-foreground">Channels:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {alertData.deliveryChannels
                ?.filter((c) => c.enabled)
                .map((channel) => (
                  <span
                    key={channel.channel}
                    className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium uppercase"
                  >
                    {channel.channel}
                  </span>
                ))}
            </div>
          </div>
          {alertData.dedupRules?.enabled && (
            <ReviewItem
              label="Deduplication"
              value={`${alertData.dedupRules.window}m window on ${alertData.dedupRules.field}`}
            />
          )}
          {alertData.throttle?.enabled && (
            <ReviewItem
              label="Throttling"
              value={`Max ${alertData.throttle.maxEventsPerWindow} events per ${alertData.throttle.suppressionWindow}m`}
            />
          )}
        </ReviewSection>
      </div>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
        <div className="flex gap-3">
          <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Ready to create</p>
            <p className="opacity-90">
              Your alert is configured and ready. Click "Create Alert" to start
              monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-lg border border-border">
      <h4 className="font-medium mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewItem({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}:</span>
      {badge ? (
        <span className="px-2 py-0.5 rounded bg-accent text-xs font-medium capitalize">
          {value}
        </span>
      ) : (
        <span className="font-medium">{value}</span>
      )}
    </div>
  );
}