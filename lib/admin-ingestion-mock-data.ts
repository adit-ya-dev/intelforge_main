// lib/admin-ingestion-mock-data.ts

import {
  DataConnector,
  PipelineRun,
  PipelineMetrics,
  IngestionLog,
  DocumentUpload,
  IndexOperation,
  ApiSecret,
  ThroughputData,
  ConnectorTemplate
} from '@/types/admin-ingestion';

export const mockConnectors: DataConnector[] = [
  {
    id: 'conn-001',
    name: 'USPTO Patents',
    type: 'patent',
    provider: 'USPTO',
    status: 'active',
    apiEndpoint: 'https://api.uspto.gov/patents/v2',
    description: 'United States Patent and Trademark Office patent database',
    icon: '🏛️',
    requiresAuth: true,
    authType: 'api_key',
    pollingInterval: 60,
    lastSync: new Date('2024-01-15T10:30:00'),
    nextSync: new Date('2024-01-15T11:30:00'),
    totalDocuments: 1250000,
    documentsToday: 3420,
    errorCount: 2,
    config: {
      apiKey: 'masked_key_123',
      rateLimit: 100,
      batchSize: 50,
      backfillEnabled: true,
      backfillStartDate: new Date('2020-01-01')
    },
    capabilities: ['full_text', 'citations', 'classifications', 'images'],
    healthScore: 98
  },
  {
    id: 'conn-002',
    name: 'CrossRef Research',
    type: 'research',
    provider: 'CrossRef',
    status: 'active',
    apiEndpoint: 'https://api.crossref.org/works',
    description: 'Academic publications and research papers metadata',
    icon: '📚',
    requiresAuth: false,
    pollingInterval: 120,
    lastSync: new Date('2024-01-15T09:15:00'),
    nextSync: new Date('2024-01-15T11:15:00'),
    totalDocuments: 890000,
    documentsToday: 1856,
    errorCount: 0,
    config: {
      rateLimit: 50,
      batchSize: 100,
      backfillEnabled: false
    },
    capabilities: ['abstracts', 'citations', 'doi', 'authors'],
    healthScore: 100
  },
  {
    id: 'conn-003',
    name: 'arXiv Preprints',
    type: 'research',
    provider: 'arXiv',
    status: 'active',
    apiEndpoint: 'https://export.arxiv.org/api/query',
    description: 'Open-access archive for scientific papers',
    icon: '🔬',
    requiresAuth: false,
    pollingInterval: 180,
    lastSync: new Date('2024-01-15T08:00:00'),
    nextSync: new Date('2024-01-15T11:00:00'),
    totalDocuments: 450000,
    documentsToday: 892,
    errorCount: 5,
    config: {
      rateLimit: 30,
      batchSize: 50,
      backfillEnabled: true,
      backfillStartDate: new Date('2022-01-01')
    },
    capabilities: ['full_text', 'latex', 'categories', 'versions'],
    healthScore: 94
  },
  {
    id: 'conn-004',
    name: 'Crunchbase Funding',
    type: 'funding',
    provider: 'Crunchbase',
    status: 'error',
    apiEndpoint: 'https://api.crunchbase.com/v4',
    description: 'Startup funding rounds and investor data',
    icon: '💰',
    requiresAuth: true,
    authType: 'api_key',
    pollingInterval: 360,
    lastSync: new Date('2024-01-14T22:00:00'),
    nextSync: null,
    totalDocuments: 125000,
    documentsToday: 0,
    errorCount: 15,
    config: {
      apiKey: 'masked_key_456',
      rateLimit: 20,
      batchSize: 25
    },
    capabilities: ['funding_rounds', 'investors', 'valuations', 'acquisitions'],
    healthScore: 45
  },
  {
    id: 'conn-005',
    name: 'Tech News RSS',
    type: 'news',
    provider: 'Custom RSS',
    status: 'paused',
    apiEndpoint: 'https://feeds.techcrunch.com',
    description: 'Technology news from multiple RSS feeds',
    icon: '📰',
    requiresAuth: false,
    pollingInterval: 30,
    lastSync: new Date('2024-01-15T07:00:00'),
    nextSync: null,
    totalDocuments: 78000,
    documentsToday: 0,
    errorCount: 0,
    config: {
      rateLimit: 100,
      batchSize: 50
    },
    capabilities: ['articles', 'summaries', 'categories'],
    healthScore: 75
  }
];

export const mockPipelineRuns: PipelineRun[] = [
  {
    id: 'run-001',
    connectorId: 'conn-001',
    connectorName: 'USPTO Patents',
    status: 'running',
    startTime: new Date('2024-01-15T10:30:00'),
    documentsProcessed: 1250,
    documentsQueued: 750,
    documentsFailed: 2,
    errorMessages: [],
    throughput: 12.5,
    memoryUsage: 256,
    cpuUsage: 45
  },
  {
    id: 'run-002',
    connectorId: 'conn-002',
    connectorName: 'CrossRef Research',
    status: 'completed',
    startTime: new Date('2024-01-15T09:15:00'),
    endTime: new Date('2024-01-15T09:45:00'),
    duration: 1800,
    documentsProcessed: 1856,
    documentsQueued: 0,
    documentsFailed: 0,
    errorMessages: [],
    throughput: 1.03,
    memoryUsage: 128,
    cpuUsage: 25
  },
  {
    id: 'run-003',
    connectorId: 'conn-004',
    connectorName: 'Crunchbase Funding',
    status: 'failed',
    startTime: new Date('2024-01-14T22:00:00'),
    endTime: new Date('2024-01-14T22:05:00'),
    duration: 300,
    documentsProcessed: 0,
    documentsQueued: 450,
    documentsFailed: 15,
    errorMessages: [
      'API rate limit exceeded',
      'Authentication failed: Invalid API key'
    ],
    throughput: 0,
    memoryUsage: 64,
    cpuUsage: 10
  }
];

export const mockPipelineMetrics: PipelineMetrics = {
  totalRuns: 1247,
  successfulRuns: 1198,
  failedRuns: 49,
  averageDuration: 2400,
  totalDocumentsProcessed: 3568926,
  processingRate: 8500,
  queueDepth: 2450,
  activeJobs: 3,
  errorRate: 3.9
};

export const mockIngestionLogs: IngestionLog[] = [
  {
    id: 'log-001',
    timestamp: new Date('2024-01-15T10:35:42'),
    level: 'info',
    connectorId: 'conn-001',
    message: 'Successfully processed batch of 50 patents',
    documentId: 'US11234567B2',
    retryable: false,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: 'log-002',
    timestamp: new Date('2024-01-15T10:34:18'),
    level: 'warning',
    connectorId: 'conn-003',
    message: 'Rate limit approaching: 28/30 requests used',
    retryable: false,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: 'log-003',
    timestamp: new Date('2024-01-15T10:33:55'),
    level: 'error',
    connectorId: 'conn-004',
    message: 'Failed to parse funding round data',
    details: { error: 'Invalid JSON response', statusCode: 500 },
    documentId: 'funding-round-xyz',
    retryable: true,
    retryCount: 2,
    maxRetries: 3
  },
  {
    id: 'log-004',
    timestamp: new Date('2024-01-15T10:32:10'),
    level: 'info',
    connectorId: 'conn-002',
    message: 'Initiated backfill for date range 2023-12-01 to 2023-12-31',
    retryable: false,
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: 'log-005',
    timestamp: new Date('2024-01-15T10:30:00'),
    level: 'info',
    connectorId: 'conn-001',
    message: 'Pipeline run started',
    retryable: false,
    retryCount: 0,
    maxRetries: 3
  }
];

export const mockDocumentUploads: DocumentUpload[] = [
  {
    id: 'upload-001',
    fileName: 'research_papers_2024.csv',
    fileType: 'csv',
    fileSize: 15728640,
    uploadDate: new Date('2024-01-15T09:00:00'),
    status: 'completed',
    progress: 100,
    documentsExtracted: 1250,
    mappingTemplate: 'research_paper_template'
  },
  {
    id: 'upload-002',
    fileName: 'patent_applications.pdf',
    fileType: 'pdf',
    fileSize: 8388608,
    uploadDate: new Date('2024-01-15T10:15:00'),
    status: 'processing',
    progress: 65,
    documentsExtracted: 32,
    errors: []
  }
];

export const mockIndexOperations: IndexOperation[] = [
  {
    id: 'idx-001',
    type: 'rebuild_embeddings',
    status: 'running',
    startTime: new Date('2024-01-15T10:00:00'),
    affectedDocuments: 50000,
    progress: 35,
    estimatedTimeRemaining: 1800
  },
  {
    id: 'idx-002',
    type: 'reindex',
    status: 'completed',
    startTime: new Date('2024-01-14T22:00:00'),
    endTime: new Date('2024-01-14T23:30:00'),
    affectedDocuments: 125000,
    progress: 100
  }
];

export const mockApiSecrets: ApiSecret[] = [
  {
    id: 'secret-001',
    name: 'USPTO API Key',
    service: 'USPTO',
    createdAt: new Date('2023-06-01'),
    lastUsed: new Date('2024-01-15T10:30:00'),
    expiresAt: new Date('2024-06-01'),
    status: 'active',
    permissions: ['read', 'search'],
    masked: 'sk-...abc123'
  },
  {
    id: 'secret-002',
    name: 'Crunchbase API Key',
    service: 'Crunchbase',
    createdAt: new Date('2023-08-15'),
    lastUsed: new Date('2024-01-14T22:00:00'),
    expiresAt: new Date('2024-02-15'),
    status: 'active',
    permissions: ['read'],
    masked: 'cb-...xyz789'
  },
  {
    id: 'secret-003',
    name: 'OpenAI API Key',
    service: 'OpenAI',
    createdAt: new Date('2023-09-01'),
    lastUsed: new Date('2024-01-15T10:00:00'),
    status: 'active',
    permissions: ['embeddings', 'completions'],
    masked: 'sk-...def456'
  }
];

export const mockThroughputData: ThroughputData[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 3600000),
  documentsPerSecond: Math.random() * 20 + 5,
  bytesPerSecond: Math.random() * 1000000 + 500000,
  activeConnectors: Math.floor(Math.random() * 3) + 2
}));

export const mockConnectorTemplates: ConnectorTemplate[] = [
  {
    id: 'template-001',
    name: 'USPTO Patents',
    type: 'patent',
    provider: 'USPTO',
    description: 'Connect to US Patent and Trademark Office database',
    requiredFields: ['apiKey'],
    optionalFields: ['rateLimit', 'batchSize', 'backfillStartDate'],
    defaultConfig: {
      rateLimit: 100,
      batchSize: 50,
      backfillEnabled: true
    },
    documentationUrl: 'https://developer.uspto.gov',
    popular: true
  },
  {
    id: 'template-002',
    name: 'European Patent Office',
    type: 'patent',
    provider: 'EPO',
    description: 'Access European patent documents and applications',
    requiredFields: ['clientId', 'clientSecret'],
    optionalFields: ['rateLimit', 'batchSize'],
    defaultConfig: {
      rateLimit: 50,
      batchSize: 25
    },
    documentationUrl: 'https://www.epo.org/apis',
    popular: true
  },
  {
    id: 'template-003',
    name: 'PubMed Central',
    type: 'research',
    provider: 'NIH',
    description: 'Biomedical and life science research articles',
    requiredFields: [],
    optionalFields: ['apiKey', 'rateLimit'],
    defaultConfig: {
      rateLimit: 30,
      batchSize: 100
    },
    documentationUrl: 'https://www.ncbi.nlm.nih.gov/pmc/tools/developers',
    popular: false
  }
];