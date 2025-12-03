// types/admin-ingestion.ts

export interface DataConnector {
  id: string;
  name: string;
  type: 'patent' | 'research' | 'funding' | 'news' | 'custom';
  provider: string;
  status: 'active' | 'paused' | 'error' | 'configuring';
  apiEndpoint: string;
  description: string;
  icon: string;
  requiresAuth: boolean;
  authType?: 'api_key' | 'oauth' | 'basic';
  pollingInterval: number; // in minutes
  lastSync: Date | null;
  nextSync: Date | null;
  totalDocuments: number;
  documentsToday: number;
  errorCount: number;
  config: ConnectorConfig;
  capabilities: string[];
  healthScore: number; // 0-100
}

export interface ConnectorConfig {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  username?: string;
  password?: string;
  baseUrl?: string;
  rateLimit?: number;
  batchSize?: number;
  backfillEnabled?: boolean;
  backfillStartDate?: Date;
  customHeaders?: Record<string, string>;
  fieldMappings?: FieldMapping[];
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: 'none' | 'date' | 'lowercase' | 'uppercase' | 'number' | 'json';
  required: boolean;
}

export interface PipelineRun {
  id: string;
  connectorId: string;
  connectorName: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  documentsProcessed: number;
  documentsQueued: number;
  documentsFailed: number;
  errorMessages: string[];
  throughput: number; // docs per second
  memoryUsage: number; // in MB
  cpuUsage: number; // percentage
}

export interface PipelineMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageDuration: number;
  totalDocumentsProcessed: number;
  processingRate: number; // docs per hour
  queueDepth: number;
  activeJobs: number;
  errorRate: number; // percentage
}

export interface IngestionLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  connectorId: string;
  message: string;
  details?: any;
  documentId?: string;
  retryable: boolean;
  retryCount: number;
  maxRetries: number;
}

export interface DocumentUpload {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'csv' | 'json' | 'xml';
  fileSize: number; // in bytes
  uploadDate: Date;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  documentsExtracted: number;
  mappingTemplate?: string;
  errors?: string[];
}

export interface IndexOperation {
  id: string;
  type: 'reindex' | 'rebuild_embeddings' | 'purge' | 'optimize';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  affectedDocuments: number;
  progress: number;
  estimatedTimeRemaining?: number; // in seconds
}

export interface ApiSecret {
  id: string;
  name: string;
  service: string;
  createdAt: Date;
  lastUsed: Date | null;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'revoked';
  permissions: string[];
  masked: string; // e.g., "sk-...abc123"
}

export interface ThroughputData {
  timestamp: Date;
  documentsPerSecond: number;
  bytesPerSecond: number;
  activeConnectors: number;
}

export interface ConnectorTemplate {
  id: string;
  name: string;
  type: string;
  provider: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
  defaultConfig: Partial<ConnectorConfig>;
  documentationUrl: string;
  popular: boolean;
}