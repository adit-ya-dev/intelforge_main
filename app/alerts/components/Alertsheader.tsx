// app/alerts/components/AlertsHeader.tsx
'use client';

import { AlertCircle, Bell, BellOff, Plus, Settings } from 'lucide-react';
import { AlertMetrics } from '@/types/alerts';

interface AlertsHeaderProps {
  metrics: AlertMetrics;
  onCreateAlert: () => void;
  onOpenSettings: () => void;
}

export default function AlertsHeader({
  metrics,
  onCreateAlert,
  onOpenSettings,
}: AlertsHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Alerts & Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">
            Automated monitoring with flexible delivery
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button
            onClick={onCreateAlert}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Alert</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Bell className="h-5 w-5" />}
          label="Total Alerts"
          value={metrics.totalAlerts}
          subValue={`${metrics.activeAlerts} active`}
          trend="neutral"
        />
        <MetricCard
          icon={<AlertCircle className="h-5 w-5" />}
          label="Triggers (24h)"
          value={metrics.triggersLast24h}
          subValue={`${metrics.triggersLast7d} this week`}
          trend="up"
        />
        <MetricCard
          icon={<Bell className="h-5 w-5" />}
          label="Success Rate"
          value={`${metrics.successRate}%`}
          subValue={`${metrics.avgResponseTime}m avg response`}
          trend="positive"
        />
        <MetricCard
          icon={<BellOff className="h-5 w-5" />}
          label="Signal/Noise"
          value={`${(metrics.signalToNoiseRatio * 100).toFixed(0)}%`}
          subValue={`${metrics.mutedAlerts} muted`}
          trend="positive"
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue: string;
  trend: 'up' | 'down' | 'positive' | 'negative' | 'neutral';
}

function MetricCard({ icon, label, value, subValue, trend }: MetricCardProps) {
  const trendColors = {
    up: 'text-blue-400',
    down: 'text-orange-400',
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="text-muted-foreground">{icon}</div>
        <span className={`text-xs font-medium ${trendColors[trend]}`}>
          {subValue}
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}