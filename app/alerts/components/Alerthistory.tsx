// app/alerts/components/AlertHistory.tsx
'use client';

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Mail,
  MessageSquare,
  X,
  XCircle,
} from 'lucide-react';
import { TriggeredEvent, DeliveryChannel } from '@/types/alerts';

interface AlertHistoryProps {
  alertId: string;
  alertName: string;
  events: TriggeredEvent[];
  onClose: () => void;
}

export default function AlertHistory({
  alertId,
  alertName,
  events,
  onClose,
}: AlertHistoryProps) {
  const [selectedEvent, setSelectedEvent] = useState<TriggeredEvent | null>(null);

  const filteredEvents = events.filter((e) => e.alertId === alertId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold">Alert History</h2>
            <p className="text-sm text-muted-foreground mt-1">{alertName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-88px)]">
          {/* Events Timeline */}
          <div className="w-1/2 border-r border-border overflow-y-auto">
            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">No History Yet</h3>
                <p className="text-sm text-muted-foreground">
                  This alert hasn't been triggered yet
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isSelected={selectedEvent?.id === event.id}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedEvent ? (
              <EventDetails event={selectedEvent} />
            ) : (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">Select an Event</h3>
                <p className="text-sm text-muted-foreground">
                  Click on an event to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventCardProps {
  event: TriggeredEvent;
  isSelected: boolean;
  onClick: () => void;
}

function EventCard({ event, isSelected, onClick }: EventCardProps) {
  const severityColors = {
    critical: 'border-red-500/20 bg-red-500/5',
    high: 'border-orange-500/20 bg-orange-500/5',
    medium: 'border-yellow-500/20 bg-yellow-500/5',
    low: 'border-blue-500/20 bg-blue-500/5',
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border text-left transition-all ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-md'
          : `${severityColors[event.severity]} hover:border-primary/50`
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium text-sm">{formatTime(event.triggeredAt)}</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
            event.severity === 'critical'
              ? 'bg-red-500/20 text-red-400'
              : event.severity === 'high'
              ? 'bg-orange-500/20 text-orange-400'
              : event.severity === 'medium'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-blue-500/20 text-blue-400'
          }`}
        >
          {event.severity}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        {event.matchedDocuments.length} document{event.matchedDocuments.length !== 1 ? 's' : ''} matched
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {event.deliveryStatus.map((status) => (
          <DeliveryBadge key={status.channel} status={status.status} channel={status.channel} />
        ))}
      </div>
    </button>
  );
}

function EventDetails({ event }: { event: TriggeredEvent }) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Event Info */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Event Details</h3>
        <div className="space-y-3 text-sm">
          <DetailRow label="Triggered At" value={formatTime(event.triggeredAt)} />
          <DetailRow label="Event ID" value={event.id} mono />
          <DetailRow label="Total Matches" value={event.evidenceSnapshot.totalMatches} />
        </div>
      </div>

      {/* Matched Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Matched Documents</h3>
        <div className="space-y-3">
          {event.matchedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-medium text-sm line-clamp-2">{doc.title}</h4>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium whitespace-nowrap">
                  {(doc.matchScore * 100).toFixed(0)}% match
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {doc.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{doc.source}</span>
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Status */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Delivery Status</h3>
        <div className="space-y-2">
          {event.deliveryStatus.map((status) => (
            <div
              key={status.channel}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <ChannelIcon channel={status.channel} />
                <div>
                  <p className="text-sm font-medium capitalize">
                    {status.channel.replace('-', ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(status.timestamp)}
                  </p>
                </div>
              </div>
              <StatusBadge status={status.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Actions Performed */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Actions Timeline</h3>
        <div className="space-y-2">
          {event.actionsPerformed.map((action) => (
            <div
              key={action.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border"
            >
              <div className="flex-shrink-0 mt-0.5">
                {action.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium capitalize">{action.action}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(action.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{action.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className={`font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}

function ChannelIcon({ channel }: { channel: DeliveryChannel }) {
  const icons = {
    'in-app': <Bell className="h-4 w-4" />,
    email: <Mail className="h-4 w-4" />,
    slack: <MessageSquare className="h-4 w-4" />,
    webhook: <ExternalLink className="h-4 w-4" />,
  };
  return <div className="text-muted-foreground">{icons[channel]}</div>;
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    throttled: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium capitalize border ${
        colors[status as keyof typeof colors] || colors.pending
      }`}
    >
      {status}
    </span>
  );
}

function DeliveryBadge({ status, channel }: { status: string; channel: DeliveryChannel }) {
  if (status === 'delivered') {
    return (
      <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-medium uppercase">
        {channel}
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-medium uppercase">
        {channel}
      </span>
    );
  }
  return null;
}