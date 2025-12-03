// lib/reports-mock-data.ts

import {
  Report,
  ReportTemplate,
  ScheduledReport,
  GeneratedReport,
  ReportMetrics,
  ReportWidget,
} from '@/types/reports';

export const mockReportWidgets: ReportWidget[] = [
  {
    id: 'widget-1',
    type: 'metric',
    title: 'Total Technologies',
    config: {
      label: 'Technologies Tracked',
      value: 247,
      trend: { direction: 'up', value: 12, period: 'vs last month' },
      icon: 'TrendingUp',
      color: 'blue',
    },
    position: { x: 0, y: 0, width: 3, height: 2 },
  },
  {
    id: 'widget-2',
    type: 'chart',
    title: 'TRL Distribution',
    config: {
      type: 'bar',
      dataSource: 'technologies',
      xAxis: 'trl',
      yAxis: 'count',
      colors: ['#3b82f6'],
      legend: true,
    },
    position: { x: 3, y: 0, width: 6, height: 4 },
  },
  {
    id: 'widget-3',
    type: 'table',
    title: 'Top Technologies',
    config: {
      dataSource: 'technologies',
      columns: [
        { key: 'name', label: 'Technology', width: '40%' },
        { key: 'domain', label: 'Domain', width: '30%' },
        { key: 'trl', label: 'TRL', width: '15%', align: 'center' },
        { key: 'signals', label: 'Signals', width: '15%', align: 'right' },
      ],
      sortable: true,
      pagination: true,
      rowsPerPage: 10,
    },
    position: { x: 0, y: 2, width: 9, height: 6 },
  },
];

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'template-1',
    name: 'Executive Brief',
    description: 'High-level overview with key metrics and trends',
    type: 'executive-brief',
    thumbnail: '/templates/executive-brief.png',
    category: 'standard',
    usageCount: 142,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T14:30:00Z',
    widgets: [
      {
        id: 'w1',
        type: 'metric',
        title: 'Total Technologies',
        config: { label: 'Technologies', value: 247 },
        position: { x: 0, y: 0, width: 3, height: 2 },
      },
      {
        id: 'w2',
        type: 'metric',
        title: 'Active Signals',
        config: { label: 'Signals This Month', value: 89 },
        position: { x: 3, y: 0, width: 3, height: 2 },
      },
      {
        id: 'w3',
        type: 'chart',
        title: 'Technology Growth',
        config: { type: 'line', dataSource: 'growth-over-time' },
        position: { x: 0, y: 2, width: 6, height: 4 },
      },
    ],
  },
  {
    id: 'template-2',
    name: 'Patent Snapshot',
    description: 'Patent analysis with citation networks and trends',
    type: 'patent-snapshot',
    thumbnail: '/templates/patent-snapshot.png',
    category: 'standard',
    usageCount: 98,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-10-15T16:20:00Z',
    widgets: [
      {
        id: 'w4',
        type: 'metric',
        title: 'Total Patents',
        config: { label: 'Patents Tracked', value: 1847 },
        position: { x: 0, y: 0, width: 3, height: 2 },
      },
      {
        id: 'w5',
        type: 'chart',
        title: 'Patent Filings Over Time',
        config: { type: 'area', dataSource: 'patent-timeline' },
        position: { x: 0, y: 2, width: 9, height: 4 },
      },
      {
        id: 'w6',
        type: 'table',
        title: 'Top Patent Holders',
        config: { dataSource: 'patent-holders' },
        position: { x: 0, y: 6, width: 9, height: 4 },
      },
    ],
  },
  {
    id: 'template-3',
    name: 'TRL Progress Report',
    description: 'Technology readiness level tracking and maturity analysis',
    type: 'trl-progress',
    thumbnail: '/templates/trl-progress.png',
    category: 'standard',
    usageCount: 76,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-11-05T09:15:00Z',
    widgets: [
      {
        id: 'w7',
        type: 'chart',
        title: 'TRL Distribution',
        config: { type: 'bar', dataSource: 'trl-distribution' },
        position: { x: 0, y: 0, width: 6, height: 4 },
      },
      {
        id: 'w8',
        type: 'chart',
        title: 'TRL Progress',
        config: { type: 'line', dataSource: 'trl-over-time' },
        position: { x: 6, y: 0, width: 6, height: 4 },
      },
    ],
  },
];

export const mockReports: Report[] = [
  {
    id: 'report-1',
    name: 'Q4 2024 Technology Overview',
    description: 'Quarterly summary of tracked technologies and emerging trends',
    type: 'executive-brief',
    templateId: 'template-1',
    widgets: mockReportWidgets,
    layout: { columns: 12, rows: 12 },
    filters: {
      dateRange: {
        start: '2024-10-01',
        end: '2024-12-31',
      },
      domains: ['Artificial Intelligence', 'Quantum Computing'],
    },
    styling: {
      theme: 'light',
      primaryColor: '#3b82f6',
      headerText: 'IntelForge Intelligence Report',
      footer: 'Confidential - Internal Use Only',
    },
    createdBy: 'user-1',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-15T14:30:00Z',
    status: 'completed',
    lastGenerated: '2024-11-20T09:00:00Z',
  },
  {
    id: 'report-2',
    name: 'Patent Analysis - November 2024',
    description: 'Monthly patent filing trends and citation analysis',
    type: 'patent-snapshot',
    templateId: 'template-2',
    widgets: mockReportTemplates[1].widgets,
    layout: { columns: 12, rows: 12 },
    filters: {
      dateRange: {
        start: '2024-11-01',
        end: '2024-11-30',
      },
    },
    styling: {
      theme: 'brand',
      primaryColor: '#6366f1',
      logo: '/logo.png',
    },
    createdBy: 'user-2',
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-11-18T16:20:00Z',
    status: 'completed',
    lastGenerated: '2024-11-19T10:30:00Z',
  },
  {
    id: 'report-3',
    name: 'Weekly Tech Brief',
    description: 'Weekly snapshot of technology signals and updates',
    type: 'custom',
    widgets: [mockReportWidgets[0], mockReportWidgets[1]],
    layout: { columns: 6, rows: 4 },
    filters: {},
    styling: {
      theme: 'light',
      primaryColor: '#10b981',
    },
    createdBy: 'user-1',
    createdAt: '2024-11-10T10:00:00Z',
    updatedAt: '2024-11-20T08:00:00Z',
    status: 'scheduled',
  },
];

export const mockScheduledReports: ScheduledReport[] = [
  {
    id: 'schedule-1',
    reportId: 'report-1',
    reportName: 'Q4 2024 Technology Overview',
    enabled: true,
    recurrence: 'quarterly',
    schedule: {
      dayOfMonth: 1,
      time: '09:00',
      timezone: 'America/New_York',
    },
    recipients: ['team@company.com', 'executives@company.com'],
    deliveryChannels: [
      {
        channel: 'email',
        enabled: true,
        config: {
          subject: 'Q4 Technology Intelligence Report',
          body: 'Please find attached the quarterly technology overview.',
        },
      },
      {
        channel: 's3',
        enabled: true,
        config: {
          bucket: 'company-reports',
          path: '/intelligence/quarterly/',
        },
      },
    ],
    exportFormat: 'pdf',
    nextRun: '2025-01-01T09:00:00Z',
    lastRun: '2024-10-01T09:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T14:00:00Z',
  },
  {
    id: 'schedule-2',
    reportId: 'report-3',
    reportName: 'Weekly Tech Brief',
    enabled: true,
    recurrence: 'weekly',
    schedule: {
      dayOfWeek: 1, // Monday
      time: '08:00',
      timezone: 'Asia/Kolkata',
    },
    recipients: ['research-team@company.com'],
    deliveryChannels: [
      {
        channel: 'email',
        enabled: true,
        config: {
          subject: 'Weekly Technology Brief',
          body: 'Your weekly technology intelligence update.',
        },
      },
    ],
    exportFormat: 'pdf',
    nextRun: '2024-11-25T08:00:00Z',
    lastRun: '2024-11-18T08:00:00Z',
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-11-15T09:00:00Z',
  },
];

export const mockGeneratedReports: GeneratedReport[] = [
  {
    id: 'generated-1',
    reportId: 'report-1',
    reportName: 'Q4 2024 Technology Overview',
    version: 3,
    format: 'pdf',
    status: 'completed',
    fileUrl: '/reports/q4-tech-overview-v3.pdf',
    fileSize: 2457600, // 2.4 MB
    generatedAt: '2024-11-20T09:00:00Z',
    generatedBy: 'user-1',
    downloadCount: 12,
    comments: [
      {
        id: 'comment-1',
        userId: 'user-3',
        userName: 'Sarah Johnson',
        text: 'Great insights on quantum computing trends!',
        createdAt: '2024-11-20T10:30:00Z',
      },
    ],
    metadata: {
      pageCount: 24,
      dataPoints: 247,
      technologies: 89,
    },
  },
  {
    id: 'generated-2',
    reportId: 'report-2',
    reportName: 'Patent Analysis - November 2024',
    version: 1,
    format: 'pptx',
    status: 'completed',
    fileUrl: '/reports/patent-analysis-nov-2024.pptx',
    fileSize: 5242880, // 5 MB
    generatedAt: '2024-11-19T10:30:00Z',
    generatedBy: 'user-2',
    downloadCount: 8,
    comments: [],
    metadata: {
      pageCount: 18,
      dataPoints: 1847,
      technologies: 156,
    },
  },
  {
    id: 'generated-3',
    reportId: 'report-3',
    reportName: 'Weekly Tech Brief',
    version: 47,
    format: 'pdf',
    status: 'completed',
    fileUrl: '/reports/weekly-brief-week47.pdf',
    fileSize: 1048576, // 1 MB
    generatedAt: '2024-11-18T08:00:00Z',
    generatedBy: 'system',
    downloadCount: 23,
    comments: [],
    metadata: {
      pageCount: 6,
      dataPoints: 45,
      technologies: 23,
    },
  },
  {
    id: 'generated-4',
    reportId: 'report-1',
    reportName: 'Q4 2024 Technology Overview',
    version: 2,
    format: 'pdf',
    status: 'completed',
    fileUrl: '/reports/q4-tech-overview-v2.pdf',
    fileSize: 2359296, // 2.25 MB
    generatedAt: '2024-11-15T14:30:00Z',
    generatedBy: 'user-1',
    downloadCount: 18,
    comments: [
      {
        id: 'comment-2',
        userId: 'user-4',
        userName: 'Mike Chen',
        text: 'Can we add more detail on the AI section?',
        createdAt: '2024-11-16T09:00:00Z',
      },
    ],
    metadata: {
      pageCount: 22,
      dataPoints: 247,
      technologies: 89,
    },
  },
];

export const mockReportMetrics: ReportMetrics = {
  totalReports: 12,
  activeSchedules: 4,
  generatedThisMonth: 28,
  totalDownloads: 156,
  avgGenerationTime: 12.4,
  storageUsed: 145.8,
};