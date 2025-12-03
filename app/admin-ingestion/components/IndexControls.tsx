// app/admin-ingestion/components/IndexControls.tsx

"use client";

import { useState } from 'react';
import { mockIndexOperations } from '@/lib/admin-ingestion-mock-data';
import { IndexOperation } from '@/types/admin-ingestion';

export default function IndexControls() {
  const [operations, setOperations] = useState<IndexOperation[]>(mockIndexOperations);
  const [selectedOperation, setSelectedOperation] = useState<string>('reindex');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<string | null>(null);

  const operationTypes = [
    {
      id: 'reindex',
      name: 'Reindex Documents',
      description: 'Rebuild search index for all documents',
      estimatedTime: '1-2 hours',
      impact: 'low'
    },
    {
      id: 'rebuild_embeddings',
      name: 'Rebuild Embeddings',
      description: 'Regenerate vector embeddings for semantic search',
      estimatedTime: '3-4 hours',
      impact: 'medium'
    },
    {
      id: 'purge',
      name: 'Purge Stale Data',
      description: 'Remove outdated or orphaned documents',
      estimatedTime: '30 minutes',
      impact: 'high'
    },
    {
      id: 'optimize',
      name: 'Optimize Index',
      description: 'Defragment and optimize search performance',
      estimatedTime: '15 minutes',
      impact: 'low'
    }
  ];

  const handleStartOperation = (operationType: string) => {
    setPendingOperation(operationType);
    setShowConfirmModal(true);
  };

  const confirmOperation = () => {
    if (!pendingOperation) return;

    const newOperation: IndexOperation = {
      id: `idx-${Date.now()}`,
      type: pendingOperation as any,
      status: 'pending',
      startTime: new Date(),
      affectedDocuments: 0,
      progress: 0
    };

    setOperations([newOperation, ...operations]);
    setShowConfirmModal(false);
    setPendingOperation(null);

    // Simulate operation progress
    simulateOperation(newOperation.id);
  };

  const simulateOperation = (operationId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setOperations(prev => prev.map(op => 
        op.id === operationId 
          ? { 
              ...op, 
              progress, 
              status: (progress >= 100 ? 'completed' : 'running') as any,
              affectedDocuments: Math.floor(progress * 500),
              estimatedTimeRemaining: Math.max(0, 1800 - (progress * 18))
            }
          : op
      ));
      if (progress >= 100) clearInterval(interval);
    }, 1000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  function renderIcon(opId: string) {
    // small, neutral-styled SVG icons (no emoji)
    switch (opId) {
      case 'reindex':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 12a9 9 0 10-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'rebuild_embeddings':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.4" />
            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.4" />
            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.4" />
            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        );
      case 'purge':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'optimize':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Operation Controls */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Index Operations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operationTypes.map((operation) => (
            <div
              key={operation.id}
              className="bg-background border border-border rounded-lg p-4 hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-muted/10 flex items-center justify-center text-white">
                    {renderIcon(operation.id)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{operation.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{operation.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">
                    Est. time: <span className="text-white">{operation.estimatedTime}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Impact: <span className={getImpactColor(operation.impact)}>{operation.impact}</span>
                  </span>
                </div>
                <button
                  onClick={() => handleStartOperation(operation.id)}
                  className="px-3 py-1 text-sm bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-600/30 transition-colors"
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Index Statistics */}
        <div className="mt-6 p-4 bg-background border border-border rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3">Index Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Documents</p>
              <p className="text-lg font-semibold text-white">3,568,926</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Index Size</p>
              <p className="text-lg font-semibold text-white">45.2 GB</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-lg font-semibold text-white">2 hours ago</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Query Time</p>
              <p className="text-lg font-semibold text-white">23ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Operations */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Active Operations</h2>
        
        {operations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active operations
          </div>
        ) : (
          <div className="space-y-3">
            {operations.map((operation) => (
              <div key={operation.id} className="bg-background border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-white capitalize">
                      {operation.type.replace(/_/g, ' ')}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(operation.status)}`}>
                      {operation.status}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Started {operation.startTime.toLocaleTimeString()}
                  </span>
                </div>

                {(operation.status === 'running' || operation.status === 'pending') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Documents: {operation.affectedDocuments.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        {operation.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-card rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${operation.progress}%` }}
                      />
                    </div>
                    {operation.estimatedTimeRemaining && (
                      <p className="text-xs text-muted-foreground">
                        Est. time remaining: {formatTime(operation.estimatedTimeRemaining)}
                      </p>
                    )}
                  </div>
                )}

                {operation.status === 'completed' && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-400">
                      ✓ Completed - {operation.affectedDocuments.toLocaleString()} documents processed
                    </p>
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      View Report →
                    </button>
                  </div>
                )}

                {operation.status === 'running' && (
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded hover:bg-yellow-500/30 transition-colors">
                      Pause
                    </button>
                    <button className="px-3 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && pendingOperation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Operation</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to start the {pendingOperation.replace(/_/g, ' ')} operation? 
              This may affect search performance temporarily.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmOperation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Operation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
