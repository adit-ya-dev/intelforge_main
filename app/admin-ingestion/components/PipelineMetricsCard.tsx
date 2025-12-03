// app/admin-ingestion/components/PipelineMetricsCard.tsx

"use client";

import { mockPipelineMetrics } from '@/lib/admin-ingestion-mock-data';

export default function PipelineMetricsCard() {
  const metrics = mockPipelineMetrics;

  const successRate = ((metrics.successfulRuns / metrics.totalRuns) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Total Documents</span>
          <span className="text-2xl">📄</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {(metrics.totalDocumentsProcessed / 1000000).toFixed(1)}M
        </p>
        <p className="text-xs text-green-400 mt-2">
          +{metrics.processingRate.toLocaleString()}/hour
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Success Rate</span>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-2xl font-bold text-white">{successRate}%</p>
        <p className="text-xs text-muted-foreground mt-2">
          {metrics.successfulRuns}/{metrics.totalRuns} runs
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Queue Depth</span>
          <span className="text-2xl">⏳</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {metrics.queueDepth.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {metrics.activeJobs} active jobs
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Error Rate</span>
          <span className="text-2xl">⚠️</span>
        </div>
        <p className={`text-2xl font-bold ${metrics.errorRate > 5 ? 'text-red-400' : 'text-white'}`}>
          {metrics.errorRate.toFixed(1)}%
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {metrics.failedRuns} failed runs
        </p>
      </div>
    </div>
  );
}