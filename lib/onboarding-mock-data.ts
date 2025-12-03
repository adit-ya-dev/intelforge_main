// lib/onboarding-mock-data.ts

import {
  OnboardingStep,
  Domain,
  WatchlistItem,
  ConnectorPreset,
  SampleSearch,
  TeamConfiguration,
  OnboardingChecklist,
  TourStep
} from '@/types/onboarding';

export const mockOnboardingSteps: OnboardingStep[] = [
  {
    id: 'step-1',
    title: 'Welcome to IntelForge',
    description: 'Get a quick overview of the platform',
    completed: true,
    required: true,
    order: 1
  },
  {
    id: 'step-2',
    title: 'Select Your Domains',
    description: 'Choose technology areas you want to monitor',
    completed: false,
    required: true,
    order: 2
  },
  {
    id: 'step-3',
    title: 'Configure Data Sources',
    description: 'Connect to patent, research, and funding databases',
    completed: false,
    required: true,
    order: 3
  },
  {
    id: 'step-4',
    title: 'Build Your Watchlist',
    description: 'Add technologies and organizations to track',
    completed: false,
    required: true,
    order: 4
  },
  {
    id: 'step-5',
    title: 'Set Up Alerts',
    description: 'Configure notifications for important changes',
    completed: false,
    required: false,
    order: 5
  },
  {
    id: 'step-6',
    title: 'Explore Sample Data',
    description: 'Learn how to interpret technology intelligence',
    completed: false,
    required: false,
    order: 6
  }
];

export const mockDomains: Domain[] = [
  {
    id: 'dom-1',
    name: 'Artificial Intelligence',
    category: 'Computing',
    description: 'Machine learning, neural networks, NLP, computer vision',
    icon: 'ai',
    selected: false,
    technologyCount: 1250
  },
  {
    id: 'dom-2',
    name: 'Quantum Computing',
    category: 'Computing',
    description: 'Quantum processors, algorithms, error correction',
    icon: 'quantum',
    selected: false,
    technologyCount: 450
  },
  {
    id: 'dom-3',
    name: 'Biotechnology',
    category: 'Life Sciences',
    description: 'Gene editing, synthetic biology, drug discovery',
    icon: 'biotech',
    selected: false,
    technologyCount: 890
  },
  {
    id: 'dom-4',
    name: 'Clean Energy',
    category: 'Energy',
    description: 'Solar, wind, batteries, hydrogen, carbon capture',
    icon: 'energy',
    selected: false,
    technologyCount: 780
  },
  {
    id: 'dom-5',
    name: 'Robotics',
    category: 'Engineering',
    description: 'Autonomous systems, industrial robots, drones',
    icon: 'robotics',
    selected: false,
    technologyCount: 620
  },
  {
    id: 'dom-6',
    name: 'Blockchain',
    category: 'Computing',
    description: 'Distributed ledgers, smart contracts, Web3',
    icon: 'blockchain',
    selected: false,
    technologyCount: 340
  },
  {
    id: 'dom-7',
    name: 'Advanced Materials',
    category: 'Materials Science',
    description: 'Graphene, metamaterials, nanocomposites',
    icon: 'materials',
    selected: false,
    technologyCount: 520
  },
  {
    id: 'dom-8',
    name: 'Space Technology',
    category: 'Aerospace',
    description: 'Satellites, launch systems, space exploration',
    icon: 'space',
    selected: false,
    technologyCount: 280
  }
];

export const mockWatchlistSuggestions: WatchlistItem[] = [
  {
    id: 'watch-1',
    name: 'GPT Language Models',
    type: 'technology',
    description: 'Large language models for text generation',
    addedAt: new Date(),
    lastActivity: new Date(),
    activityCount: 45
  },
  {
    id: 'watch-2',
    name: 'OpenAI',
    type: 'organization',
    description: 'Leading AI research organization',
    addedAt: new Date(),
    lastActivity: new Date(),
    activityCount: 128
  },
  {
    id: 'watch-3',
    name: 'CRISPR',
    type: 'technology',
    description: 'Gene editing technology',
    addedAt: new Date(),
    lastActivity: new Date(),
    activityCount: 67
  },
  {
    id: 'watch-4',
    name: 'quantum supremacy',
    type: 'keyword',
    description: 'Quantum computing milestone',
    addedAt: new Date(),
    lastActivity: new Date(),
    activityCount: 23
  }
];

export const mockConnectorPresets: ConnectorPreset[] = [
  {
    id: 'conn-preset-1',
    name: 'USPTO Patents',
    provider: 'USPTO',
    description: 'US patent database with full-text search',
    category: 'Patents',
    recommended: true,
    requiresAuth: true,
    enabled: false
  },
  {
    id: 'conn-preset-2',
    name: 'arXiv Research',
    provider: 'arXiv',
    description: 'Open-access scientific papers',
    category: 'Research',
    recommended: true,
    requiresAuth: false,
    enabled: false
  },
  {
    id: 'conn-preset-3',
    name: 'Crunchbase',
    provider: 'Crunchbase',
    description: 'Startup funding and investor data',
    category: 'Funding',
    recommended: true,
    requiresAuth: true,
    enabled: false
  },
  {
    id: 'conn-preset-4',
    name: 'PubMed',
    provider: 'NIH',
    description: 'Biomedical research literature',
    category: 'Research',
    recommended: false,
    requiresAuth: false,
    enabled: false
  },
  {
    id: 'conn-preset-5',
    name: 'European Patents',
    provider: 'EPO',
    description: 'European patent database',
    category: 'Patents',
    recommended: false,
    requiresAuth: true,
    enabled: false
  }
];

export const mockSampleSearches: SampleSearch[] = [
  {
    id: 'search-1',
    query: 'quantum computing applications healthcare',
    category: 'Cross-Domain',
    description: 'Explore quantum computing use cases in medical research',
    resultCount: 234,
    tags: ['quantum', 'healthcare', 'emerging']
  },
  {
    id: 'search-2',
    query: 'battery technology TRL:7-9',
    category: 'Clean Energy',
    description: 'Market-ready battery innovations',
    resultCount: 567,
    tags: ['energy', 'batteries', 'mature']
  },
  {
    id: 'search-3',
    query: 'AI ethics governance framework',
    category: 'AI/ML',
    description: 'Regulatory and ethical frameworks for AI',
    resultCount: 189,
    tags: ['AI', 'governance', 'policy']
  },
  {
    id: 'search-4',
    query: 'CRISPR patents 2023-2024',
    category: 'Biotechnology',
    description: 'Recent CRISPR-related patent filings',
    resultCount: 78,
    tags: ['biotech', 'patents', 'recent']
  }
];

export const mockTeamConfigurations: TeamConfiguration[] = [
  {
    id: 'team-1',
    name: 'Research Lab',
    type: 'research',
    size: '5-20 members',
    focusAreas: ['Deep technical analysis', 'Patent landscapes', 'Publication tracking'],
    recommendedFeatures: ['Advanced search', 'Citation networks', 'Collaboration tools']
  },
  {
    id: 'team-2',
    name: 'Enterprise R&D',
    type: 'enterprise',
    size: '20-100 members',
    focusAreas: ['Competitive intelligence', 'Technology scouting', 'IP strategy'],
    recommendedFeatures: ['Automated reports', 'Alert system', 'API access']
  },
  {
    id: 'team-3',
    name: 'Startup/Scale-up',
    type: 'startup',
    size: '1-10 members',
    focusAreas: ['Market opportunities', 'Funding trends', 'Quick insights'],
    recommendedFeatures: ['Dashboard overview', 'Trending technologies', 'Investor tracking']
  },
  {
    id: 'team-4',
    name: 'Academic Institution',
    type: 'academic',
    size: '10-50 members',
    focusAreas: ['Research collaboration', 'Grant opportunities', 'Publication metrics'],
    recommendedFeatures: ['Multi-user access', 'Export tools', 'Citation management']
  }
];

export const mockChecklist: OnboardingChecklist = {
  id: 'checklist-1',
  title: 'Getting Started Checklist',
  progress: 25,
  items: [
    {
      id: 'check-1',
      label: 'Complete profile information',
      completed: true,
      optional: false,
      helpText: 'Add your name, role, and organization'
    },
    {
      id: 'check-2',
      label: 'Select at least 3 domains of interest',
      completed: false,
      optional: false,
      helpText: 'Choose technology areas to monitor',
      action: 'SELECT_DOMAINS'
    },
    {
      id: 'check-3',
      label: 'Enable recommended data connectors',
      completed: false,
      optional: false,
      helpText: 'Connect to patent and research databases',
      action: 'CONFIGURE_CONNECTORS'
    },
    {
      id: 'check-4',
      label: 'Add 5+ items to watchlist',
      completed: false,
      optional: false,
      helpText: 'Track specific technologies or organizations',
      action: 'BUILD_WATCHLIST'
    },
    {
      id: 'check-5',
      label: 'Set up your first alert',
      completed: false,
      optional: true,
      helpText: 'Get notified about important changes',
      action: 'CREATE_ALERT'
    },
    {
      id: 'check-6',
      label: 'Run a sample search',
      completed: false,
      optional: true,
      helpText: 'Try one of our recommended searches',
      action: 'RUN_SEARCH'
    },
    {
      id: 'check-7',
      label: 'Generate your first report',
      completed: false,
      optional: true,
      helpText: 'Create a technology intelligence report',
      action: 'CREATE_REPORT'
    },
    {
      id: 'check-8',
      label: 'Invite team members',
      completed: false,
      optional: true,
      helpText: 'Collaborate with your team',
      action: 'INVITE_TEAM'
    }
  ]
};

export const mockTourSteps: TourStep[] = [
  {
    id: 'tour-1',
    target: '.dashboard-kpi',
    title: 'Key Performance Indicators',
    content: 'Monitor important metrics at a glance. These KPIs update in real-time as new data flows in.',
    placement: 'bottom'
  },
  {
    id: 'tour-2',
    target: '.search-bar',
    title: 'Intelligent Search',
    content: 'Search across patents, research papers, and funding data using natural language or advanced filters.',
    placement: 'bottom'
  },
  {
    id: 'tour-3',
    target: '.tech-explorer',
    title: 'Technology Explorer',
    content: 'Discover emerging technologies and track their development over time.',
    placement: 'right'
  },
  {
    id: 'tour-4',
    target: '.watchlist-panel',
    title: 'Your Watchlist',
    content: 'Track specific technologies, organizations, or keywords. Get alerts when something important happens.',
    placement: 'left'
  },
  {
    id: 'tour-5',
    target: '.forecast-chart',
    title: 'Predictive Analytics',
    content: 'View S-curve projections and technology adoption forecasts based on our ML models.',
    placement: 'top'
  }
];