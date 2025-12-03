// app/alerts/components/WatchedTechnologies.tsx
'use client';

import { useState } from 'react';
import {
  Bell,
  BellOff,
  ExternalLink,
  Eye,
  Plus,
  TrendingUp,
  X,
} from 'lucide-react';
import { WatchedTechnology, TechUpdate } from '@/types/alerts';

interface WatchedTechnologiesProps {
  technologies: WatchedTechnology[];
  onToggleAlerts: (techId: string) => void;
  onRemove: (techId: string) => void;
  onAddNew: () => void;
}

export default function WatchedTechnologies({
  technologies,
  onToggleAlerts,
  onRemove,
  onAddNew,
}: WatchedTechnologiesProps) {
  const [expandedTech, setExpandedTech] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Watched Technologies</h3>
          <p className="text-sm text-muted-foreground">
            Track updates for technologies you're monitoring
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Technology</span>
        </button>
      </div>

      {/* Technologies List */}
      {technologies.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Watched Technologies</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start watching technologies to receive automatic updates
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Technology
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {technologies.map((tech) => (
            <TechnologyCard
              key={tech.id}
              technology={tech}
              isExpanded={expandedTech === tech.id}
              onToggleExpand={() =>
                setExpandedTech(expandedTech === tech.id ? null : tech.id)
              }
              onToggleAlerts={() => onToggleAlerts(tech.id)}
              onRemove={() => onRemove(tech.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TechnologyCardProps {
  technology: WatchedTechnology;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleAlerts: () => void;
  onRemove: () => void;
}

function TechnologyCard({
  technology,
  isExpanded,
  onToggleExpand,
  onToggleAlerts,
  onRemove,
}: TechnologyCardProps) {
  const getTimeSince = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className="rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold mb-1 truncate">{technology.name}</h4>
            <p className="text-xs text-muted-foreground">{technology.domain}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleAlerts}
              className={`p-2 rounded-lg transition-colors ${
                technology.alertsEnabled
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'hover:bg-accent'
              }`}
              title={technology.alertsEnabled ? 'Alerts enabled' : 'Alerts disabled'}
            >
              {technology.alertsEnabled ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={onRemove}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
              title="Remove from watchlist"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{technology.updateCount} updates</span>
          </div>
          <div>Last: {getTimeSince(technology.lastUpdate)}</div>
        </div>

        {/* Recent Changes Preview */}
        {technology.recentChanges.length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Latest Update:
            </div>
            <UpdatePreview update={technology.recentChanges[0]} />
          </div>
        )}

        {/* Expand Button */}
        {technology.recentChanges.length > 1 && (
          <button
            onClick={onToggleExpand}
            className="w-full text-xs text-primary hover:underline text-center py-2"
          >
            {isExpanded ? 'Show Less' : `View All ${technology.recentChanges.length} Updates`}
          </button>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && technology.recentChanges.length > 1 && (
        <div className="border-t border-border p-4 space-y-3 bg-accent/20">
          {technology.recentChanges.slice(1).map((update) => (
            <UpdatePreview key={update.id} update={update} />
          ))}
        </div>
      )}
    </div>
  );
}

function UpdatePreview({ update }: { update: TechUpdate }) {
  const typeIcons = {
    patent: '⚖️',
    publication: '📄',
    funding: '💰',
    news: '📰',
    signal: '📡',
  };

  const severityColors = {
    critical: 'border-red-500/20 bg-red-500/5 text-red-400',
    high: 'border-orange-500/20 bg-orange-500/5 text-orange-400',
    medium: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400',
    low: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`p-3 rounded-lg border ${severityColors[update.severity]}`}>
      <div className="flex items-start gap-2 mb-1">
        <span className="text-base">{typeIcons[update.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h5 className="text-sm font-medium line-clamp-1">{update.title}</h5>
            <span className="text-[10px] opacity-70 whitespace-nowrap">
              {formatTime(update.timestamp)}
            </span>
          </div>
          <p className="text-xs opacity-90 line-clamp-2 mb-2">
            {update.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-medium opacity-70">
              {update.type}
            </span>
            {update.url && (
              <a
                href={update.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}