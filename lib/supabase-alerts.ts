// lib/supabase-alerts.ts
import { createClient } from '@supabase/supabase-js';



const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions matching database schema
export interface Alert {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  state: 'active' | 'muted' | 'paused';
  trigger_type: 'query' | 'threshold' | 'entity' | 'signal';
  conditions: any[];
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  delivery_channels: any[];
  dedup_rules: {
    enabled: boolean;
    window: number;
    field: string;
  };
  throttle: {
    enabled: boolean;
    suppressionWindow: number;
    maxEventsPerWindow: number;
  };
  team_subscriptions: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  last_triggered: string | null;
  trigger_count: number;
  estimated_noise: number;
}

export interface TriggeredEvent {
  id: string;
  alert_id: string;
  alert_name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  triggered_at: string;
  matched_documents: any[];
  evidence_snapshot: any;
  actions_performed: any[];
  delivery_status: any[];
  created_at: string;
}

export interface WatchedTechnology {
  id: string;
  technology_id: string;
  name: string;
  domain: string;
  added_at: string;
  last_update: string;
  update_count: number;
  alerts_enabled: boolean;
  recent_changes: any[];
  created_at: string;
  updated_at: string;
}

export interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  category: 'technology' | 'market' | 'competitor' | 'custom';
  trigger_type: 'query' | 'threshold' | 'entity' | 'signal';
  default_conditions: any[];
  recommended_frequency: string;
  icon: string;
  popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  enable_in_app: boolean;
  enable_email: boolean;
  enable_slack: boolean;
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  severity_filters: {
    critical: boolean;
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  digest_mode: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AlertMetrics {
  total_alerts: number;
  active_alerts: number;
  muted_alerts: number;
  triggers_last_24h: number;
  triggers_last_7d: number;
  avg_response_time: number;
  success_rate: number;
  signal_to_noise_ratio: number;
}
