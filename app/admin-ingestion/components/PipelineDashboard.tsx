// app/admin-ingestion/components/PipelineDashboard.tsx

"use client";

import { useState } from 'react';
import { mockPipelineRuns, mockThroughputData } from '@/lib/admin-ingestion-mock-data';
import { PipelineRun, ThroughputData } from '@/types/admin-ingestion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

function WarningInline() {
  return (
    <svg className="w-4 h-4 inline-block mr-2 text-red-400" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h17.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PipelineDashboard() {
  const [runs] = useState<PipelineRun[]>(mockPipelineRuns);
  const [throughputData] = useState<ThroughputData[]>(mockThroughputData);
  const [selectedRun, setSelectedRun] = useState<PipelineRun | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Active Pipeline Runs */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Active Pipeline Runs</h2>
        
        <div className="space-y-4">
          {runs.map((run) => (
            <div
              key={run.id}
              className="bg-background border border-border rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer"
              onClick={() => setSelectedRun(run)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-white">{run.connectorName}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(run.status)}`}>
                    {run.status}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Started {run.startTime.toLocaleTimeString()}
                </span>
              </div>

              {/* Progress Bar */}
              {run.status === 'running' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs text-muted-foreground">
                      {run.documentsProcessed} / {run.documentsProcessed + run.documentsQueued}
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(run.documentsProcessed / (run.documentsProcessed + run.documentsQueued)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Processed</p>
                  <p className="text-sm font-medium text-white">{run.documentsProcessed.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Queued</p>
                  <p className="text-sm font-medium text-white">{run.documentsQueued.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Throughput</p>
                  <p className="text-sm font-medium text-white">{run.throughput} docs/s</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium text-white">
                    {run.duration ? formatDuration(run.duration) : 'In Progress'}
                  </p>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">CPU:</span>
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${run.cpuUsage > 80 ? 'bg-red-500' : run.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${run.cpuUsage}%` }}
                    />
                  </div>
                  <span className="text-xs text-white">{run.cpuUsage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Memory:</span>
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${run.memoryUsage > 400 ? 'bg-red-500' : run.memoryUsage > 300 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${(run.memoryUsage / 512) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-white">{run.memoryUsage}MB</span>
                </div>
              </div>

              {/* Error Messages */}
              {run.errorMessages.length > 0 && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                  {run.errorMessages.map((error, idx) => (
                    <p key={idx} className="text-xs text-red-400 flex items-center">
                      <WarningInline />
                      <span>{error}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Actions */}
              {run.status === 'running' && (
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded hover:bg-yellow-500/30 transition-colors">
                    Pause
                  </button>
                  <button className="px-3 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors">
                    Cancel
                  </button>
                </div>
              )}

              {run.status === 'failed' && (
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-500/30 transition-colors">
                    Retry
                  </button>
                  <button className="px-3 py-1 text-xs text-muted-foreground border border-border rounded hover:bg-background transition-colors">
                    View Logs
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Throughput Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Throughput (Last 24 Hours)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={throughputData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).getHours() + ':00'}
              stroke="#9CA3AF"
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={(value: number) => `${value.toFixed(2)}`}
            />
            <Area
              type="monotone"
              dataKey="documentsPerSecond"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.2}
              name="Docs/Second"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
