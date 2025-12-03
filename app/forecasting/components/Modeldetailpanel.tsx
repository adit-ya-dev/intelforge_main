"use client";

import { useState } from "react";
import {
  Calendar,
  Code,
  GitCommit,
  TrendingUp,
  Clock,
  Database,
  Settings,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { ModelDetail } from "@/types/forecasting";

interface ModelDetailPanelProps {
  model: ModelDetail;
}

export default function ModelDetailPanel({ model }: ModelDetailPanelProps) {
  const [showTraining, setShowTraining] = useState(true);
  const [showPerformance, setShowPerformance] = useState(true);
  const [showProvenance, setShowProvenance] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "training":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Model Header */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">{model.name}</h2>
            <p className="text-sm text-muted-foreground">Version {model.version}</p>
          </div>
          {getStatusIcon(model.status)}
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{model.longDescription}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded p-3">
            <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-green-500">{model.performance.accuracy}%</div>
          </div>
          <div className="bg-muted/50 rounded p-3">
            <div className="text-xs text-muted-foreground mb-1">Usage</div>
            <div className="text-2xl font-bold text-foreground">{model.metadata.usageCount}</div>
          </div>
        </div>
      </div>

      {/* Training Information */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => setShowTraining(!showTraining)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Training Details</span>
          </div>
          {showTraining ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showTraining && (
          <div className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Last Trained:</span>
                <div className="font-medium text-foreground">
                  {new Date(model.training.lastTrained).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <div className="font-medium text-foreground">{model.training.trainingDuration}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Dataset Size:</span>
                <div className="font-medium text-foreground">
                  {model.training.datasetSize.toLocaleString()} samples
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Avg Run Time:</span>
                <div className="font-medium text-foreground">{model.metadata.avgRunTime}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">Data Sources:</div>
              <div className="space-y-1">
                {model.training.dataSources.map((source, idx) => (
                  <div key={idx} className="text-xs bg-muted/50 px-2 py-1 rounded">
                    {source}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">Features ({model.training.features.length}):</div>
              <div className="flex flex-wrap gap-1">
                {model.training.features.slice(0, 6).map((feature, idx) => (
                  <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {feature}
                  </span>
                ))}
                {model.training.features.length > 6 && (
                  <span className="text-xs text-muted-foreground px-2 py-0.5">
                    +{model.training.features.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => setShowPerformance(!showPerformance)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Performance Metrics</span>
          </div>
          {showPerformance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showPerformance && (
          <div className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded p-3">
                <div className="text-xs text-muted-foreground mb-1">MAE</div>
                <div className="text-lg font-bold text-foreground">{model.performance.mae}</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-xs text-muted-foreground mb-1">RMSE</div>
                <div className="text-lg font-bold text-foreground">{model.performance.rmse}</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-xs text-muted-foreground mb-1">R² Score</div>
                <div className="text-lg font-bold text-foreground">{model.performance.r2Score}</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-xs text-muted-foreground mb-1">Samples</div>
                <div className="text-lg font-bold text-foreground">
                  {model.performance.validationSamples.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
              <div className="text-xs text-blue-400 mb-1">Confidence Interval (95%)</div>
              <div className="text-sm font-medium text-foreground">
                {model.performance.confidenceInterval[0]}% - {model.performance.confidenceInterval[1]}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Provenance */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => setShowProvenance(!showProvenance)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Provenance & Governance</span>
          </div>
          {showProvenance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showProvenance && (
          <div className="px-4 pb-4 space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Repository:</span>
              <div className="font-mono text-xs bg-muted/50 px-2 py-1 rounded mt-1">
                {model.provenance.repository}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Commit:</span>
              <div className="font-mono text-xs bg-muted/50 px-2 py-1 rounded mt-1">
                {model.provenance.commit}
              </div>
            </div>

            {model.metadata.approvedBy && (
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-green-500">Approved for Production</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  By {model.metadata.approvedBy} on{" "}
                  {new Date(model.metadata.approvalDate!).toLocaleDateString()}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs text-muted-foreground mb-2">Dependencies:</div>
              <div className="space-y-1">
                {Object.entries(model.provenance.dependencies).map(([pkg, version]) => (
                  <div key={pkg} className="flex justify-between text-xs bg-muted/50 px-2 py-1 rounded">
                    <span>{pkg}</span>
                    <span className="text-muted-foreground">{version}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Changelog */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => setShowChangelog(!showChangelog)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Changelog</span>
          </div>
          {showChangelog ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showChangelog && (
          <div className="px-4 pb-4 space-y-3">
            {model.changelog.map((entry) => (
              <div key={entry.version} className="border-l-2 border-primary pl-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">v{entry.version}</span>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {entry.changes.map((change, idx) => (
                    <li key={idx}>• {change}</li>
                  ))}
                </ul>
                <div className="text-xs text-muted-foreground mt-1">by {entry.author}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}