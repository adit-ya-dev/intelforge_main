// lib/supabase-dashboard.ts
import { createClient } from '@supabase/supabase-js';




const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions matching database schema
export interface DashboardKPI {
  id: string;
  metric_key: string;
  label: string;
  value: string;
  change_value: number;
  change_label: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  updated_at: string;
  created_at: string;
}

export interface Signal {
  id: string;
  type: 'patent' | 'funding' | 'publication' | 'breakthrough';
  title: string;
  tech: string;
  importance: 'high' | 'medium' | 'low';
  date: string;
  value: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  tech: string;
  link: string | null;
  timestamp: string;
  created_at: string;
}

export interface PatentAnalytic {
  id: string;
  date: string;
  filings: number;
  citations: number;
  week_number: number;
  year: number;
  created_at: string;
}

export interface FundingAnalytic {
  id: string;
  month: string;
  year: number;
  amount: number;
  deal_count: number;
  created_at: string;
}

export interface TRLDistribution {
  id: string;
  trl_level: string;
  name: string;
  value: number;
  color: string;
  percentage: number;
  updated_at: string;
}
