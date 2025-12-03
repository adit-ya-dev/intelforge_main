"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Trash2,
  Edit2,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ScheduledRun {
  id: string;
  name: string;
  technology: string;
  model: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  nextRun: string;
  lastRun?: string;
  status: "active" | "paused" | "error";
  config: {
    scenario: string;
    timeHorizon: string;
    includeUncertainty: boolean;
    autoExport: boolean;
  };
  notifications: {
    email: boolean;
    slack: boolean;
  };
  history: {
    date: string;
    status: "success" | "failed" | "partial";
    duration: number;
  }[];
}

interface ScheduledRunsManagerProps {
  onCreateSchedule?: () => void;
}

export default function ScheduledRunsManager({
  onCreateSchedule,
}: ScheduledRunsManagerProps) {
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data
  const [scheduledRuns, setScheduledRuns] = useState<ScheduledRun[]>([
    {
      id: "1",
      name: "Weekly Quantum Computing Update",
      technology: "Quantum Computing",
      model: "TechGrowth Pro",
      frequency: "weekly",
      nextRun: "2025-11-27T09:00:00",
      lastRun: "2025-11-20T09:00:00",
      status: "active",
      config: {
        scenario: "baseline",
        timeHorizon: "10-year",
        includeUncertainty: true,
        autoExport: true,
      },
      notifications: {
        email: true,
        slack: true,
      },
      history: [
        { date: "2025-11-20T09:00:00", status: "success", duration: 245 },
        { date: "2025-11-13T09:00:00", status: "success", duration: 238 },
        { date: "2025-11-06T09:00:00", status: "success", duration: 251 },
      ],
    },
    {
      id: "2",
      name: "Monthly AI Market Analysis",
      technology: "Generative AI",
      model: "Bass Model Enhanced",
      frequency: "monthly",
      nextRun: "2025-12-01T10:00:00",
      lastRun: "2025-11-01T10:00:00",
      status: "active",
      config: {
        scenario: "optimistic",
        timeHorizon: "5-year",
        includeUncertainty: true,
        autoExport: false,
      },
      notifications: {
        email: true,
        slack: false,
      },
      history: [
        { date: "2025-11-01T10:00:00", status: "success", duration: 312 },
        { date: "2025-10-01T10:00:00", status: "partial", duration: 298 },
      ],
    },
    {
      id: "3",
      name: "Daily Battery Tech Monitor",
      technology: "Solid-State Batteries",
      model: "S-Curve Predictor",
      frequency: "daily",
      nextRun: "2025-11-21T08:00:00",
      lastRun: "2025-11-20T08:00:00",
      status: "active",
      config: {
        scenario: "baseline",
        timeHorizon: "3-year",
        includeUncertainty: false,
        autoExport: true,
      },
      notifications: {
        email: false,
        slack: true,
      },
      history: [
        { date: "2025-11-20T08:00:00", status: "success", duration: 142 },
        { date: "2025-11-19T08:00:00", status: "success", duration: 138 },
        { date: "2025-11-18T08:00:00", status: "failed", duration: 0 },
      ],
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />;
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

  const getFrequencyLabel = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  const toggleRunStatus = (runId: string) => {
    setScheduledRuns((prev) =>
      prev.map((run) =>
        run.id === runId
          ? {
              ...run,
              status: run.status === "active" ? "paused" : "active",
            }
          : run
      )
    );
  };

  const deleteRun = (runId: string) => {
    setScheduledRuns((prev) => prev.filter((run) => run.id !== runId));
  };

  const runNow = (runId: string) => {
    alert(`Running forecast: ${runId}`);
    // In production, trigger the forecast run
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTimeUntilNext = (nextRun: string) => {
    const now = new Date();
    const next = new Date(nextRun);
    const diff = next.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `in ${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? "s" : ""}`;
    return "soon";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Runs</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Automate forecast generation and stay updated on technology trends
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
          New Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Schedules</div>
          <div className="text-2xl font-bold">{scheduledRuns.length}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Active</div>
          <div className="text-2xl font-bold text-green-500">
            {scheduledRuns.filter((r) => r.status === "active").length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Paused</div>
          <div className="text-2xl font-bold text-yellow-500">
            {scheduledRuns.filter((r) => r.status === "paused").length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Errors</div>
          <div className="text-2xl font-bold text-red-500">
            {scheduledRuns.filter((r) => r.status === "error").length}
          </div>
        </div>
      </div>

      {/* Scheduled Runs List */}
      <div className="space-y-4">
        {scheduledRuns.map((run) => (
          <div key={run.id} className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Run Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(run.status)}
                    <h3 className="text-lg font-semibold">{run.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                        run.status
                      )}`}
                    >
                      {run.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{run.technology}</span>
                    <span>•</span>
                    <span>{run.model}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      {getFrequencyLabel(run.frequency)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runNow(run.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Run now"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleRunStatus(run.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title={run.status === "active" ? "Pause" : "Resume"}
                  >
                    {run.status === "active" ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteRun(run.id)}
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setExpandedRun(expandedRun === run.id ? null : run.id)
                    }
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {expandedRun === run.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Next Run</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm font-medium">{formatDate(run.nextRun)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getTimeUntilNext(run.nextRun)}
                  </div>
                </div>

                {run.lastRun && (
                  <div className="p-3 bg-muted/50 rounded">
                    <div className="text-xs text-muted-foreground mb-1">Last Run</div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm font-medium">
                        {formatDate(run.lastRun)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {run.history[0]?.duration}s duration
                    </div>
                  </div>
                )}

                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Notifications</div>
                  <div className="flex gap-2 mt-1">
                    {run.notifications.email && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                        Email
                      </span>
                    )}
                    {run.notifications.slack && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                        Slack
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                  <div className="text-sm font-medium">
                    {run.history.filter((h) => h.status === "success").length}/
                    {run.history.length} runs
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(
                      (run.history.filter((h) => h.status === "success").length /
                        run.history.length) *
                      100
                    ).toFixed(0)}
                    % success
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRun === run.id && (
              <div className="border-t border-border p-4 bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Configuration */}
                  <div>
                    <h4 className="font-semibold mb-3">Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Scenario:</span>
                        <span className="font-medium capitalize">
                          {run.config.scenario}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Horizon:</span>
                        <span className="font-medium">{run.config.timeHorizon}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uncertainty Bands:</span>
                        <span className="font-medium">
                          {run.config.includeUncertainty ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Auto Export:</span>
                        <span className="font-medium">
                          {run.config.autoExport ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent History */}
                  <div>
                    <h4 className="font-semibold mb-3">Recent History</h4>
                    <div className="space-y-2">
                      {run.history.slice(0, 3).map((record, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-card rounded"
                        >
                          <div className="flex items-center gap-2">
                            {record.status === "success" && (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            )}
                            {record.status === "failed" && (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            {record.status === "partial" && (
                              <AlertCircle className="h-3 w-3 text-yellow-500" />
                            )}
                            <span className="text-sm">{formatDate(record.date)}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {record.duration}s
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {scheduledRuns.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Scheduled Runs</h3>
          <p className="text-muted-foreground mb-4">
            Create your first scheduled forecast to automate technology monitoring
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