// lib/supabase-admin-ingestion.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions matching our database schema
export interface DataConnector {
  id: string;
  name: string;
  type: 'patent' | 'research' | 'funding' | 'news' | 'custom';
  provider: string;
  status: 'active' | 'paused' | 'error' | 'configuring';
  api_endpoint: string;
  description: string | null;
  icon: string;
  requires_auth: boolean;
  auth_type: 'api_key' | 'oauth' | 'basic' | null;
  polling_interval: number;
  last_sync: string | null;
  next_sync: string | null;
  total_documents: number;
  documents_today: number;
  error_count: number;
  config: Record<string, any>;
  capabilities: string[];
  health_score: number;
  created_at: string;
  updated_at: string;
}

export interface PipelineRun {
  id: string;
  connector_id: string;
  connector_name: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  start_time: string;
  end_time: string | null;
  duration: number | null;
  documents_processed: number;
  documents_queued: number;
  documents_failed: number;
  error_messages: string[];
  throughput: number;
  memory_usage: number;
  cpu_usage: number;
  created_at: string;
  updated_at: string;
}

export interface IngestionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  connector_id: string;
  message: string;
  details: any;
  document_id: string | null;
  retryable: boolean;
  retry_count: number;
  max_retries: number;
  created_at: string;
}

export interface DocumentUpload {
  id: string;
  file_name: string;
  file_type: 'pdf' | 'csv' | 'json' | 'xml';
  file_size: number;
  upload_date: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  documents_extracted: number;
  mapping_template: string | null;
  errors: string[];
  created_at: string;
  updated_at: string;
}

export interface IndexOperation {
  id: string;
  type: 'reindex' | 'rebuild_embeddings' | 'purge' | 'optimize';
  status: 'pending' | 'running' | 'completed' | 'failed';
  start_time: string;
  end_time: string | null;
  affected_documents: number;
  progress: number;
  estimated_time_remaining: number | null;
  created_at: string;
  updated_at: string;
}

export interface ApiSecret {
  id: string;
  name: string;
  service: string;
  created_at: string;
  last_used: string | null;
  expires_at: string | null;
  status: 'active' | 'expired' | 'revoked';
  permissions: string[];
  masked: string;
  updated_at: string;
}

export interface ConnectorTemplate {
  id: string;
  name: string;
  type: string;
  provider: string;
  description: string | null;
  required_fields: string[];
  optional_fields: string[];
  default_config: Record<string, any>;
  documentation_url: string | null;
  popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface PipelineMetrics {
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  average_duration: number;
  total_documents_processed: number;
  avg_throughput: number;
  active_jobs: number;
  error_rate: number;
}

export interface ThroughputData {
  timestamp: string;
  documentsPerSecond: number;
  bytesPerSecond: number;
  activeConnectors: number;
}