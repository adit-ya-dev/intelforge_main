// app/alerts/components/AlertPreview.tsx
'use client';

import { AlertCircle, CheckCircle2, Info, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
import { Alert, AlertPreviewResult } from '@/types/alerts';
import { mockAlertPreviewResult } from '@/lib/alerts-mock-data';

interface AlertPreviewProps {
  alert: Partial<Alert>;
}

export default function AlertPreview({ alert }: AlertPreviewProps) {
  // In a real app, this would call an API to get preview results
  const previewResult: AlertPreviewResult = mockAlertPreviewResult;

  const noiseColors = {
    low: 'text-green-400 bg-green-500/10 border-green-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    high: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={<AlertCircle className="h-5 w-5" />}
          label="Estimated Matches"
          value={previewResult.estimatedMatches}
          description="Based on last 7 days"
        />
        <SummaryCard
          icon={
            previewResult.noiseLevel === 'low' ? (
              <TrendingDown className="h-5 w-5" />
            ) : (
              <TrendingUp className="h-5 w-5" />
            )
          }
          label="Noise Level"
          value={previewResult.noiseLevel}
          description="False positive rate"
          badge
          badgeColor={noiseColors[previewResult.noiseLevel]}
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Avg Daily Triggers"
          value={Math.round(
            previewResult.historicalTriggers.reduce((sum, day) => sum + day.count, 0) /
              previewResult.historicalTriggers.length
          )}
          description="Expected frequency"
        />
      </div>

      {/* Historical Triggers Chart */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="font-medium mb-4">Historical Triggers (Last 7 Days)</h4>
        <div className="flex items-end justify-between gap-2 h-32">
          {previewResult.historicalTriggers.map((day) => {
            const maxCount = Math.max(
              ...previewResult.historicalTriggers.map((d) => d.count)
            );
            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-full">
                  <div
                    className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                    style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                    title={`${day.count} triggers`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sample Documents */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="font-medium mb-4">Sample Matching Documents</h4>
        <div className="space-y-3">
          {previewResult.sampleDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h5 className="font-medium text-sm line-clamp-2">{doc.title}</h5>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium whitespace-nowrap">
                  {(doc.matchScore * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {doc.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{doc.source}</span>
                <span className="text-muted-foreground">
                  {new Date(doc.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-400 mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm text-blue-400/90">
              {previewResult.recommendations.map((rec, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-blue-400/50">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
  badge?: boolean;
  badgeColor?: string;
}

function SummaryCard({
  icon,
  label,
  value,
  description,
  badge,
  badgeColor,
}: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-3">{icon}</div>
      <div className="space-y-1">
        {badge ? (
          <div
            className={`inline-block px-2 py-1 rounded border text-sm font-semibold capitalize ${badgeColor}`}
          >
            {value}
          </div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}