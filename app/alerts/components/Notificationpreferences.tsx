// app/alerts/components/NotificationPreferences.tsx
'use client';

import { Bell, Clock, Mail, MessageSquare, Moon, Shield, X } from 'lucide-react';
import { NotificationPreference } from '@/types/alerts';

interface NotificationPreferencesProps {
  preferences: NotificationPreference;
  onUpdate: (preferences: NotificationPreference) => void;
  onClose: () => void;
}

export default function NotificationPreferences({
  preferences,
  onUpdate,
  onClose,
}: NotificationPreferencesProps) {
  const handleUpdate = (updates: Partial<NotificationPreference>) => {
    onUpdate({ ...preferences, ...updates });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Customize how you receive alerts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-6">
          {/* Delivery Channels */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Delivery Channels
            </h3>
            <div className="space-y-3">
              <ToggleOption
                icon={<Bell className="h-5 w-5" />}
                label="In-App Notifications"
                description="Receive notifications within the application"
                enabled={preferences.enableInApp}
                onChange={(enabled) => handleUpdate({ enableInApp: enabled })}
              />
              <ToggleOption
                icon={<Mail className="h-5 w-5" />}
                label="Email Notifications"
                description="Get alerts delivered to your email inbox"
                enabled={preferences.enableEmail}
                onChange={(enabled) => handleUpdate({ enableEmail: enabled })}
              />
              <ToggleOption
                icon={<MessageSquare className="h-5 w-5" />}
                label="Slack Notifications"
                description="Post alerts to your connected Slack channels"
                enabled={preferences.enableSlack}
                onChange={(enabled) => handleUpdate({ enableSlack: enabled })}
              />
            </div>
          </section>

          {/* Severity Filters */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Severity Filters
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which severity levels you want to receive
            </p>
            <div className="space-y-2">
              <SeverityToggle
                level="critical"
                enabled={preferences.severityFilters.critical}
                onChange={(enabled) =>
                  handleUpdate({
                    severityFilters: {
                      ...preferences.severityFilters,
                      critical: enabled,
                    },
                  })
                }
              />
              <SeverityToggle
                level="high"
                enabled={preferences.severityFilters.high}
                onChange={(enabled) =>
                  handleUpdate({
                    severityFilters: {
                      ...preferences.severityFilters,
                      high: enabled,
                    },
                  })
                }
              />
              <SeverityToggle
                level="medium"
                enabled={preferences.severityFilters.medium}
                onChange={(enabled) =>
                  handleUpdate({
                    severityFilters: {
                      ...preferences.severityFilters,
                      medium: enabled,
                    },
                  })
                }
              />
              <SeverityToggle
                level="low"
                enabled={preferences.severityFilters.low}
                onChange={(enabled) =>
                  handleUpdate({
                    severityFilters: {
                      ...preferences.severityFilters,
                      low: enabled,
                    },
                  })
                }
              />
            </div>
          </section>

          {/* Quiet Hours */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Quiet Hours
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pause non-critical notifications during specific hours
            </p>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.quietHours.enabled}
                  onChange={(e) =>
                    handleUpdate({
                      quietHours: {
                        ...preferences.quietHours,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Enable quiet hours</span>
              </label>

              {preferences.quietHours.enabled && (
                <div className="p-4 rounded-lg border border-border space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={preferences.quietHours.start}
                        onChange={(e) =>
                          handleUpdate({
                            quietHours: {
                              ...preferences.quietHours,
                              start: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={preferences.quietHours.end}
                        onChange={(e) =>
                          handleUpdate({
                            quietHours: {
                              ...preferences.quietHours,
                              end: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Timezone
                    </label>
                    <select
                      value={preferences.quietHours.timezone}
                      onChange={(e) =>
                        handleUpdate({
                          quietHours: {
                            ...preferences.quietHours,
                            timezone: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="America/Los_Angeles">Los Angeles (PST)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Australia/Sydney">Sydney (AEDT)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Digest Mode */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Digest Mode
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Receive a summary of alerts instead of individual notifications
            </p>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.digestMode.enabled}
                  onChange={(e) =>
                    handleUpdate({
                      digestMode: {
                        ...preferences.digestMode,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">Enable digest mode</span>
              </label>

              {preferences.digestMode.enabled && (
                <div className="p-4 rounded-lg border border-border space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Frequency
                      </label>
                      <select
                        value={preferences.digestMode.frequency}
                        onChange={(e) =>
                          handleUpdate({
                            digestMode: {
                              ...preferences.digestMode,
                              frequency: e.target.value as 'daily' | 'weekly',
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Delivery Time
                      </label>
                      <input
                        type="time"
                        value={preferences.digestMode.time}
                        onChange={(e) =>
                          handleUpdate({
                            digestMode: {
                              ...preferences.digestMode,
                              time: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border p-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToggleOptionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleOption({
  icon,
  label,
  description,
  enabled,
  onChange,
}: ToggleOptionProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-muted-foreground mt-0.5">{icon}</div>
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

interface SeverityToggleProps {
  level: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function SeverityToggle({ level, enabled, onChange }: SeverityToggleProps) {
  const colors = {
    critical: 'border-red-500/20 bg-red-500/5',
    high: 'border-orange-500/20 bg-orange-500/5',
    medium: 'border-yellow-500/20 bg-yellow-500/5',
    low: 'border-blue-500/20 bg-blue-500/5',
  };

  const textColors = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-blue-400',
  };

  return (
    <label
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
        enabled ? colors[level] : 'border-border hover:bg-accent/50'
      }`}
    >
      <span className={`font-medium capitalize ${enabled ? textColors[level] : ''}`}>
        {level}
      </span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-border"
      />
    </label>
  );
}