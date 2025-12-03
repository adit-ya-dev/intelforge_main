// app/reports/components/ReportsHeader.tsx
'use client';

import { Calendar, Download, FileText, Plus, TrendingUp } from 'lucide-react';
import type { ReportMetrics } from '@/types/reports';

interface ReportsHeaderProps {
  metrics: ReportMetrics;
  onCreateReport: () => void;
  onViewSchedules: () => void;
}

export default function ReportsHeader({
  metrics,
  onCreateReport,
  onViewSchedules,
}: ReportsHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Package insights for meetings and distribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewSchedules}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedules</span>
          </button>
          <button
            onClick={onCreateReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<FileText className="h-5 w-5" />}
          label="Total Reports"
          value={metrics.totalReports}
          subValue={`${metrics.activeSchedules} scheduled`}
          trend="neutral"
        />
        <MetricCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Generated This Month"
          value={metrics.generatedThisMonth}
          subValue={`${metrics.avgGenerationTime}s avg time`}
          trend="positive"
        />
        <MetricCard
          icon={<Download className="h-5 w-5" />}
          label="Total Downloads"
          value={metrics.totalDownloads}
          subValue="This month"
          trend="up"
        />
        <MetricCard
          icon={<FileText className="h-5 w-5" />}
          label="Storage Used"
          value={`${metrics.storageUsed.toFixed(1)} MB`}
          subValue="Cloud storage"
          trend="neutral"
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