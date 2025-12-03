// app/reports/components/ScheduleEditor.tsx
'use client';

import { useState } from 'react';
import { Calendar, Check, Mail, X } from 'lucide-react';
import type { ScheduledReport, RecurrenceType, DeliveryChannel, ExportFormat } from '@/types/reports';

interface ScheduleEditorProps {
  reportId: string;
  reportName: string;
  existingSchedule?: ScheduledReport;
  onSave: (schedule: Partial<ScheduledReport>) => void;
  onClose: () => void;
}

export default function ScheduleEditor({
  reportId,
  reportName,
  existingSchedule,
  onSave,
  onClose,
}: ScheduleEditorProps) {
  const [recurrence, setRecurrence] = useState<RecurrenceType>(
    existingSchedule?.recurrence || 'weekly'
  );
  const [dayOfWeek, setDayOfWeek] = useState(
    existingSchedule?.schedule.dayOfWeek || 1
  );
  const [dayOfMonth, setDayOfMonth] = useState(
    existingSchedule?.schedule.dayOfMonth || 1
  );
  const [time, setTime] = useState(existingSchedule?.schedule.time || '09:00');
  const [timezone, setTimezone] = useState(
    existingSchedule?.schedule.timezone || 'America/New_York'
  );
  const [recipients, setRecipients] = useState<string[]>(
    existingSchedule?.recipients || []
  );
  const [newRecipient, setNewRecipient] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>(
    existingSchedule?.exportFormat || 'pdf'
  );
  const [enabledChannels, setEnabledChannels] = useState<DeliveryChannel[]>(
    existingSchedule?.deliveryChannels
      .filter((c) => c.enabled)
      .map((c) => c.channel) || ['email']
  );

  const handleAddRecipient = () => {
    if (newRecipient.trim() && !recipients.includes(newRecipient.trim())) {
      setRecipients([...recipients, newRecipient.trim()]);
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const toggleChannel = (channel: DeliveryChannel) => {
    if (enabledChannels.includes(channel)) {
      setEnabledChannels(enabledChannels.filter((c) => c !== channel));
    } else {
      setEnabledChannels([...enabledChannels, channel]);
    }
  };

  const handleSave = () => {
    const schedule: Partial<ScheduledReport> = {
      reportId,
      reportName,
      enabled: true,
      recurrence,
      schedule: {
        dayOfWeek: recurrence === 'weekly' ? dayOfWeek : undefined,
        dayOfMonth: recurrence === 'monthly' || recurrence === 'quarterly' ? dayOfMonth : undefined,
        time,
        timezone,
      },
      recipients,
      exportFormat,
      deliveryChannels: enabledChannels.map((channel) => ({
        channel,
        enabled: true,
        config: {},
      })),
    };

    onSave(schedule);
    onClose();
  };

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold">
              {existingSchedule ? 'Edit Schedule' : 'Create Schedule'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{reportName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Recurrence */}
          <div>
            <label className="block text-sm font-medium mb-3">Recurrence</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['daily', 'weekly', 'monthly', 'quarterly'] as RecurrenceType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setRecurrence(type)}
                  className={`p-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                    recurrence === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Day Selection */}
          {recurrence === 'weekly' && (
            <div>
              <label className="block text-sm font-medium mb-3">Day of Week</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {weekDays.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(recurrence === 'monthly' || recurrence === 'quarterly') && (
            <div>
              <label className="block text-sm font-medium mb-3">Day of Month</label>
              <input
                type="number"
                min="1"
                max="31"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter 1-31. If day doesn't exist in month, last day will be used.
              </p>
            </div>
          )}

          {/* Time and Timezone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-3">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium mb-3">Recipients</label>
            <div className="flex gap-2 mb-3">
              <input
                type="email"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddRecipient}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>
            {recipients.length > 0 ? (
              <div className="space-y-2">
                {recipients.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-accent/50"
                  >
                    <span className="text-sm">{email}</span>
                    <button
                      onClick={() => handleRemoveRecipient(email)}
                      className="p-1 rounded hover:bg-red-500/10 text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recipients added yet</p>
            )}
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="block text-sm font-medium mb-3">Delivery Channels</label>
            <div className="grid grid-cols-2 gap-3">
              {(['email', 's3', 'sharepoint'] as DeliveryChannel[]).map((channel) => (
                <button
                  key={channel}
                  onClick={() => toggleChannel(channel)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    enabledChannels.includes(channel)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{channel}</span>
                    <div
                      className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                        enabledChannels.includes(channel)
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}
                    >
                      {enabledChannels.includes(channel) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {channel === 'email' && 'Send via email'}
                    {channel === 's3' && 'Upload to S3 bucket'}
                    {channel === 'sharepoint' && 'Save to SharePoint'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium mb-3">Export Format</label>
            <div className="grid grid-cols-4 gap-2">
              {(['pdf', 'pptx', 'csv', 'json'] as ExportFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`p-3 rounded-lg border text-center text-sm font-medium uppercase transition-colors ${
                    exportFormat === format
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <div className="flex gap-3">
              <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Schedule Summary</p>
                <p className="opacity-90">
                  This report will be generated{' '}
                  <strong className="text-blue-300">
                    {recurrence === 'daily' && 'every day'}
                    {recurrence === 'weekly' && `every ${weekDays[dayOfWeek]}`}
                    {recurrence === 'monthly' && `on day ${dayOfMonth} of each month`}
                    {recurrence === 'quarterly' && `on day ${dayOfMonth} every quarter`}
                  </strong>{' '}
                  at <strong className="text-blue-300">{time}</strong> ({timezone}) and sent to{' '}
                  <strong className="text-blue-300">{recipients.length} recipient(s)</strong> via{' '}
                  <strong className="text-blue-300">
                    {enabledChannels.join(', ') || 'no channels'}
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>
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
            onClick={handleSave}
            disabled={recipients.length === 0 || enabledChannels.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4" />
            {existingSchedule ? 'Update Schedule' : 'Create Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
}