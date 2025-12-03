// types/alerts.ts

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertState = 'active' | 'muted' | 'paused';
export type TriggerType = 'query' | 'threshold' | 'entity' | 'signal';
export type LogicOperator = 'AND' | 'OR';
export type DeliveryChannel = 'in-app' | 'email' | 'slack' | 'webhook';
export type AlertFrequency = 'real-time' | 'hourly' | 'daily' | 'weekly';

export interface AlertCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string | number | [number, number];
  logic?: LogicOperator;
}

export interface DeliveryConfig {
  channel: DeliveryChannel;
  enabled: boolean;
  config: {
    // Email
    to?: string[];
    subject?: string;
    template?: string;
    // Slack
    webhookUrl?: string;
    slackChannel?: string;
    // Webhook
    endpoint?: string;
    headers?: Record<string, string>;
    authToken?: string;
  };
}

export interface DedupRule {
  enabled: boolean;
  window: number; // minutes
  field: string; // field to check for duplicates
}

export interface ThrottleConfig {
  enabled: boolean;
  suppressionWindow: number; // minutes
  maxEventsPerWindow: number;
}

export interface Alert {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  state: AlertState;
  triggerType: TriggerType;
  conditions: AlertCondition[];
  frequency: AlertFrequency;
  deliveryChannels: DeliveryConfig[];
  dedupRules: DedupRule;
  throttle: ThrottleConfig;
  teamSubscriptions: string[]; // user IDs or team IDs
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastTriggered?: string;
  triggerCount: number;
  estimatedNoise: number; // 0-100 percentage
}

export interface TriggeredEvent {
  id: string;
  alertId: string;
  alertName: string;
  severity: AlertSeverity;
  triggeredAt: string;
  matchedDocuments: MatchedDocument[];
  evidenceSnapshot: EvidenceSnapshot;
  actionsPerformed: ActionPerformed[];
  deliveryStatus: DeliveryStatus[];
}

export interface MatchedDocument {
  id: string;
  title: string;
  source: string;
  url: string;
  excerpt: string;
  matchScore: number;
  publishedAt: string;
  metadata: Record<string, any>;
}

export interface EvidenceSnapshot {
  query: string;
  conditions: AlertCondition[];
  totalMatches: number;
  sampleDocuments: MatchedDocument[];
  capturedAt: string;
}

export interface ActionPerformed {
  id: string;
  action: 'delivered' | 'throttled' | 'deduped' | 'failed';
  channel?: DeliveryChannel;
  timestamp: string;
  details: string;
  success: boolean;
}

export interface DeliveryStatus {
  channel: DeliveryChannel;
  status: 'pending' | 'delivered' | 'failed' | 'throttled';
  timestamp: string;
  errorMessage?: string;
  retryCount: number;
}

export interface AlertMetrics {
  totalAlerts: number;
  activeAlerts: number;
  mutedAlerts: number;
  triggersLast24h: number;
  triggersLast7d: number;
  avgResponseTime: number; // minutes
  successRate: number; // percentage
  signalToNoiseRatio: number; // 0-1
}

export interface WatchedTechnology {
  id: string;
  technologyId: string;
  name: string;
  domain: string;
  addedAt: string;
  lastUpdate: string;
  updateCount: number;
  alertsEnabled: boolean;
  recentChanges: TechUpdate[];
}

export interface TechUpdate {
  id: string;
  type: 'patent' | 'publication' | 'funding' | 'news' | 'signal';
  title: string;
  description: string;
  timestamp: string;
  severity: AlertSeverity;
  source: string;
  url?: string;
}

export interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  category: 'technology' | 'market' | 'competitor' | 'custom';
  triggerType: TriggerType;
  defaultConditions: AlertCondition[];
  recommendedFrequency: AlertFrequency;
  icon: string;
}

export interface NotificationPreference {
  userId: string;
  enableInApp: boolean;
  enableEmail: boolean;
  enableSlack: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
    timezone: string;
  };
  severityFilters: {
    critical: boolean;
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  digestMode: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string; // HH:mm
  };
}

export interface AlertPreviewResult {
  estimatedMatches: number;
  sampleDocuments: MatchedDocument[];
  historicalTriggers: {
    date: string;
    count: number;
  }[];
  noiseLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}