// app/admin-ingestion/components/IngestionLogs.tsx

"use client";

import { useState, useEffect } from 'react';
import { mockIngestionLogs } from '@/lib/admin-ingestion-mock-data';
import { IngestionLog } from '@/types/admin-ingestion';

interface IngestionLogsProps {
  limit?: number;
}

function renderLevelIcon(level: string) {
  switch (level) {
    case 'info':
      return (
        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11.25 10.5h1.5v5.25h-1.5zM12 8.25h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h17.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 9v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
          <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
  }
}

function RefreshIcon() {
  return (
    <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 12a8 8 0 10-15.5 3.5L3 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 15v6h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 5h3v14H6zM15 5h3v14h-3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function IngestionLogs({ limit }: IngestionLogsProps) {
  const [logs, setLogs] = useState<IngestionLog[]>(mockIngestionLogs);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time log updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const newLog: IngestionLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        level: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)] as any,
        connectorId: `conn-00${Math.floor(Math.random() * 5) + 1}`,
        message: [
          'Processing batch of documents',
          'Rate limit warning',
          'Successfully indexed documents',
          'Connection established',
          'Retrying failed request'
        ][Math.floor(Math.random() * 5)],
        retryable: Math.random() > 0.5,
        retryCount: 0,
        maxRetries: 3
      };

      setLogs(prev => [newLog, ...prev].slice(0, 100));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.connectorId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  }).slice(0, limit || logs.length);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleRetry = (logId: string) => {
    console.log('Retrying operation for log:', logId);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          {limit ? 'Recent Logs' : 'Ingestion Logs'}
        </h2>
        <div className="flex items-center gap-3">
          {!limit && (
            <>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 bg-background border border-border rounded text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-1 bg-background border border-border rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 text-sm border rounded transition-colors flex items-center ${
                  autoRefresh
                    ? 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30'
                }`}
                aria-pressed={autoRefresh}
                aria-label={autoRefresh ? 'Auto refresh enabled' : 'Auto refresh paused'}
              >
                {autoRefresh ? <RefreshIcon /> : <PauseIcon />}
                {autoRefresh ? 'Auto' : 'Paused'}
              </button>
            </>
          )}
          {limit && (
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View All →
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-background border border-border rounded-lg p-3 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <span className="mt-0.5">{renderLevelIcon(log.level)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs font-medium ${getLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {log.connectorId}
                    </span>
                  </div>
                  <p className="text-sm text-white">{log.message}</p>
                  
                  {log.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-white">
                        View Details
                      </summary>
                      <pre className="mt-2 p-2 bg-card rounded text-xs text-gray-300 overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}

                  {log.documentId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Document: {log.documentId}
                    </p>
                  )}
                </div>
              </div>

              {log.level === 'error' && log.retryable && log.retryCount < log.maxRetries && (
                <button
                  onClick={() => handleRetry(log.id)}
                  className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-500/30 transition-colors"
                >
                  Retry ({log.retryCount}/{log.maxRetries})
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!limit && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} logs
          </p>
          <button className="px-3 py-1 text-sm text-muted-foreground border border-border rounded hover:bg-background transition-colors">
            Export Logs
          </button>
        </div>
      )}
    </div>
  );
}
