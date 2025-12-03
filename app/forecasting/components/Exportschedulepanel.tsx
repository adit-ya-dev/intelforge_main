"use client";

import { useState } from "react";
import {
  Download,
  Calendar,
  FileText,
  Mail,
  Slack,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ExportSchedule {
  id: string;
  name: string;
  format: "pdf" | "excel" | "csv" | "json" | "powerpoint";
  frequency: "daily" | "weekly" | "monthly" | "after-run";
  destination: "email" | "slack" | "download" | "google-drive" | "s3";
  recipients?: string[];
  nextExport: string;
  lastExport?: string;
  status: "active" | "paused" | "error";
  includeCharts: boolean;
  includeRawData: boolean;
  template?: string;
  filters: {
    technologies?: string[];
    models?: string[];
    minConfidence?: number;
  };
}

interface ExportSchedulePanelProps {
  onCreateSchedule?: () => void;
}

export default function ExportSchedulePanel({
  onCreateSchedule,
}: ExportSchedulePanelProps) {
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data
  const [exportSchedules, setExportSchedules] = useState<ExportSchedule[]>([
    {
      id: "1",
      name: "Weekly Executive Report",
      format: "pdf",
      frequency: "weekly",
      destination: "email",
      recipients: ["exec-team@company.com", "board@company.com"],
      nextExport: "2025-11-27T08:00:00",
      lastExport: "2025-11-20T08:00:00",
      status: "active",
      includeCharts: true,
      includeRawData: false,
      template: "executive-summary",
      filters: {
        technologies: ["Quantum Computing", "AI"],
        minConfidence: 70,
      },
    },
    {
      id: "2",
      name: "Data Science Team Export",
      format: "excel",
      frequency: "daily",
      destination: "slack",
      nextExport: "2025-11-21T09:00:00",
      lastExport: "2025-11-20T09:00:00",
      status: "active",
      includeCharts: true,
      includeRawData: true,
      filters: {
        models: ["TechGrowth Pro", "Bass Model Enhanced"],
      },
    },
    {
      id: "3",
      name: "Monthly Stakeholder Update",
      format: "powerpoint",
      frequency: "monthly",
      destination: "email",
      recipients: ["stakeholders@company.com"],
      nextExport: "2025-12-01T10:00:00",
      lastExport: "2025-11-01T10:00:00",
      status: "active",
      includeCharts: true,
      includeRawData: false,
      template: "stakeholder-presentation",
      filters: {},
    },
    {
      id: "4",
      name: "API Data Export",
      format: "json",
      frequency: "after-run",
      destination: "s3",
      nextExport: "On forecast completion",
      status: "active",
      includeCharts: false,
      includeRawData: true,
      filters: {},
    },
  ]);

  const getFormatIcon = (format: string) => {
    return <FileText className="h-4 w-4" />;
  };

  const getDestinationIcon = (destination: string) => {
    switch (destination) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "slack":
        return <Slack className="h-4 w-4" />;
      case "download":
        return <Download className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "paused":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "paused":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "error":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "";
    }
  };

  const toggleScheduleStatus = (scheduleId: string) => {
    setExportSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              status: schedule.status === "active" ? "paused" : "active",
            }
          : schedule
      )
    );
  };

  const deleteSchedule = (scheduleId: string) => {
    setExportSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
  };

  const exportNow = (scheduleId: string) => {
    alert(`Exporting now: ${scheduleId}`);
    // In production, trigger the export
  };

  const formatDate = (dateString: string) => {
    if (dateString === "On forecast completion") return dateString;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Export Schedules</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Automate report generation and distribution to stakeholders
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateModal(true);
            onCreateSchedule?.();
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Export Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Schedules</div>
          <div className="text-2xl font-bold">{exportSchedules.length}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Active</div>
          <div className="text-2xl font-bold text-green-500">
            {exportSchedules.filter((s) => s.status === "active").length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">This Week</div>
          <div className="text-2xl font-bold">
            {
              exportSchedules.filter(
                (s) =>
                  s.frequency === "weekly" ||
                  s.frequency === "daily" ||
                  s.frequency === "after-run"
              ).length
            }
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Recipients</div>
          <div className="text-2xl font-bold">
            {exportSchedules.reduce(
              (acc, s) => acc + (s.recipients?.length || 0),
              0
            )}
          </div>
        </div>
      </div>

      {/* Export Schedules List */}
      <div className="space-y-4">
        {exportSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            {/* Schedule Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(schedule.status)}
                    <h3 className="text-lg font-semibold">{schedule.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                        schedule.status
                      )}`}
                    >
                      {schedule.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {getFormatIcon(schedule.format)}
                      {schedule.format.toUpperCase()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {getDestinationIcon(schedule.destination)}
                      {schedule.destination}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{schedule.frequency}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportNow(schedule.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Export now"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleScheduleStatus(schedule.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title={schedule.status === "active" ? "Pause" : "Resume"}
                  >
                    {schedule.status === "active" ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setExpandedSchedule(
                        expandedSchedule === schedule.id ? null : schedule.id
                      )
                    }
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {expandedSchedule === schedule.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Next Export</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm font-medium">
                      {formatDate(schedule.nextExport)}
                    </span>
                  </div>
                </div>

                {schedule.lastExport && (
                  <div className="p-3 bg-muted/50 rounded">
                    <div className="text-xs text-muted-foreground mb-1">Last Export</div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm font-medium">
                        {formatDate(schedule.lastExport)}
                      </span>
                    </div>
                  </div>
                )}

                {schedule.recipients && schedule.recipients.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded">
                    <div className="text-xs text-muted-foreground mb-1">
                      Recipients
                    </div>
                    <div className="text-sm font-medium">
                      {schedule.recipients.length} recipient
                      {schedule.recipients.length > 1 ? "s" : ""}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedSchedule === schedule.id && (
              <div className="border-t border-border p-4 bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Configuration */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Configuration
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Include Charts:</span>
                        <span className="font-medium">
                          {schedule.includeCharts ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Include Raw Data:</span>
                        <span className="font-medium">
                          {schedule.includeRawData ? "Yes" : "No"}
                        </span>
                      </div>
                      {schedule.template && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Template:</span>
                          <span className="font-medium capitalize">
                            {schedule.template.replace("-", " ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Filters & Recipients */}
                  <div>
                    <h4 className="font-semibold mb-3">Filters & Recipients</h4>
                    <div className="space-y-3">
                      {schedule.filters.technologies &&
                        schedule.filters.technologies.length > 0 && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Technologies:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {schedule.filters.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-1 bg-primary/20 text-primary text-xs rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {schedule.filters.models && schedule.filters.models.length > 0 && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Models:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {schedule.filters.models.map((model) => (
                              <span
                                key={model}
                                className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded"
                              >
                                {model}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {schedule.recipients && schedule.recipients.length > 0 && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Email Recipients:
                          </div>
                          <div className="space-y-1">
                            {schedule.recipients.map((recipient) => (
                              <div
                                key={recipient}
                                className="text-xs font-mono bg-card p-2 rounded"
                              >
                                {recipient}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {schedule.filters.minConfidence && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Min Confidence:
                          </div>
                          <div className="text-sm font-medium">
                            {schedule.filters.minConfidence}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {exportSchedules.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Export Schedules</h3>
          <p className="text-muted-foreground mb-4">
            Create your first export schedule to automate report distribution
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Schedule
          </button>
        </div>
      )}
    </div>
  );
}