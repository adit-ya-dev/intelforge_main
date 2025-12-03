// types/onboarding.ts

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  order: number;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  isComplete: boolean;
  skipped: boolean;
}

export interface Domain {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  selected: boolean;
  technologyCount: number;
}

export interface WatchlistItem {
  id: string;
  name: string;
  type: 'technology' | 'organization' | 'keyword' | 'domain';
  description: string;
  addedAt: Date;
  lastActivity: Date;
  activityCount: number;
}

export interface ConnectorPreset {
  id: string;
  name: string;
  provider: string;
  description: string;
  category: string;
  recommended: boolean;
  requiresAuth: boolean;
  enabled: boolean;
}

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface SampleSearch {
  id: string;
  query: string;
  category: string;
  description: string;
  resultCount: number;
  tags: string[];
}

export interface TeamConfiguration {
  id: string;
  name: string;
  type: 'research' | 'enterprise' | 'startup' | 'academic';
  size: string;
  focusAreas: string[];
  recommendedFeatures: string[];
}

export interface OnboardingChecklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  progress: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  optional: boolean;
  helpText?: string;
  action?: string;
}