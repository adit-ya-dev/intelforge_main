// app/reports/components/ScheduleManager.tsx
'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Mail,
  MoreVertical,
  Pause,
  Play,
  Trash2,
  X,
} from 'lucide-react';
import type { ScheduledReport } from '@/types/reports';

interface ScheduleManagerProps {
  schedules: ScheduledReport[];
  onToggle: (scheduleId: string) => void;
  onEdit: (schedule: ScheduledReport) => void;
  onDelete: (scheduleId: string) => void;
  onClose: () => void;
}

export default function ScheduleManager({
  schedules,
  onToggle,
  onEdit,
  onDelete,
  onClose,
}: ScheduleManagerProps) {
  const activeSchedules = schedules.filter((s) => s.enabled);
  const pausedSchedules = schedules.filter((s) => !s.enabled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold">Scheduled Reports</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage automated report generation and delivery
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {schedules.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-accent/20 p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Scheduled Reports</h3>
              <p className="text-sm text-muted-foreground">
                Set up automated report generation and delivery
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Schedules */}
              {activeSchedules.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Active ({activeSchedules.length})
                  </h3>
                  <div className="space-y-3">
                    {activeSchedules.map((schedule) => (
                      <ScheduleCard
                        key={schedule.id}
                        schedule={schedule}
                        onToggle={() => onToggle(schedule.id)}
                        onEdit={() => onEdit(schedule)}
                        onDelete={() => onDelete(schedule.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Paused Schedules */}
              {pausedSchedules.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Paused ({pausedSchedules.length})
                  </h3>
                  <div className="space-y-3">
                    {pausedSchedules.map((schedule) => (
                      <ScheduleCard
                        key={schedule.id}
                        schedule={schedule}
                        onToggle={() => onToggle(schedule.id)}
                        onEdit={() => onEdit(schedule)}
                        onDelete={() => onDelete(schedule.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ScheduleCardProps {
  schedule: ScheduledReport;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ScheduleCard({ schedule, onToggle, onEdit, onDelete }: ScheduleCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getRecurrenceText = () => {
    switch (schedule.recurrence) {
      case 'daily':
        return `Daily at ${schedule.schedule.time}`;
      case 'weekly':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `Weekly on ${days[schedule.schedule.dayOfWeek || 0]} at ${
          schedule.schedule.time
        }`;
      case 'monthly':
        return `Monthly on day ${schedule.schedule.dayOfMonth} at ${schedule.schedule.time}`;
      case 'quarterly':
        return `Quarterly on day ${schedule.schedule.dayOfMonth} at ${schedule.schedule.time}`;
      default:
        return schedule.recurrence;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        schedule.enabled
          ? 'border-border bg-card hover:bg-accent/50'
          : 'border-dashed border-border bg-accent/20'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold truncate">{schedule.reportName}</h4>
            {schedule.enabled ? (
              <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20">
                Paused
              </span>
            )}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{getRecurrenceText()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Next run: {formatDate(schedule.nextRun)} • Last run:{' '}
                {formatDate(schedule.lastRun)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{schedule.recipients.length} recipient(s)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            {schedule.deliveryChannels
              .filter((c) => c.enabled)
              .map((channel) => (
                <span
                  key={channel.channel}
                  className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-medium uppercase"
                >
                  {channel.channel}
                </span>
              ))}
            <span className="px-2 py-0.5 rounded text-xs bg-accent text-xs font-medium uppercase">
              {schedule.exportFormat}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            title={schedule.enabled ? 'Pause schedule' : 'Resume schedule'}
          >
            {schedule.enabled ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 z-10 w-48 rounded-lg border border-border bg-card shadow-lg">
                <div className="p-1">
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm text-left"
                  >
                    <Calendar className="h-4 w-4" />
                    Edit Schedule
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-500/10 text-red-400 text-sm text-left"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Schedule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}