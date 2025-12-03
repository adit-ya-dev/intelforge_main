// app/reports/page.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  mockReports,
  mockReportTemplates,
  mockReportMetrics,
  mockGeneratedReports,
  mockScheduledReports,
} from '@/lib/reports-mock-data';
import type {
  Report,
  ReportTemplate,
  ExportFormat,
  ExportOptions,
  ScheduledReport,
} from '@/types/reports';

// Dynamic imports to avoid module loading issues
const ReportsHeader = dynamic(() => import('./components/ReportsHeader'), {
  ssr: false,
});

const TemplateGallery = dynamic(() => import('./components/TemplateGallery'), {
  ssr: false,
});

const ReportsList = dynamic(() => import('./components/ReportsList'), {
  ssr: false,
});

const ScheduleManager = dynamic(() => import('./components/ScheduleManager'), {
  ssr: false,
});

const ExportDialog = dynamic(() => import('./components/ExportDialog'), {
  ssr: false,
});

const GeneratedReportsList = dynamic(() => import('./components/GeneratedReportsList'), {
  ssr: false,
});

const ScheduleEditor = dynamic(() => import('./components/ScheduleEditor'), {
  ssr: false,
});

const ReportPreview = dynamic(() => import('./components/ReportPreview'), {
  ssr: false,
});

const ReportBuilder = dynamic(() => import('./components/ReportBuilder'), {
  ssr: false,
});

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [metrics, setMetrics] = useState(mockReportMetrics);
  const [schedules, setSchedules] = useState(mockScheduledReports);
  const [generatedReports, setGeneratedReports] = useState(mockGeneratedReports);
  
  const [view, setView] = useState<'list' | 'templates'>('list');
  const [showSchedules, setShowSchedules] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledReport | null>(null);

  // Report CRUD Handlers
  const handleCreateReport = () => {
    setView('templates');
  };

  const handleSelectTemplate = (template: ReportTemplate) => {
    const newReport: Report = {
      id: `report-${Date.now()}`,
      name: `New ${template.name}`,
      description: template.description,
      type: template.type,
      templateId: template.id,
      widgets: template.widgets,
      layout: { columns: 12, rows: 12 },
      filters: {},
      styling: {
        theme: 'light',
        primaryColor: '#3b82f6',
      },
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };

    setReports([...reports, newReport]);
    setMetrics({
      ...metrics,
      totalReports: metrics.totalReports + 1,
    });
    
    // Open builder
    setSelectedReport(newReport);
    setShowBuilder(true);
    setView('list');
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setShowBuilder(true);
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter((r) => r.id !== reportId));
      setMetrics({
        ...metrics,
        totalReports: metrics.totalReports - 1,
      });
    }
  };

  const handleSaveReport = (updatedReport: Report) => {
    setReports(
      reports.map((r) => (r.id === updatedReport.id ? updatedReport : r))
    );
    setShowBuilder(false);
    setSelectedReport(null);
  };

  // Export Handlers
  const handleExportReport = (reportId: string, format: ExportFormat) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setShowExportDialog(true);
    }
  };

  const handleExportWithOptions = (options: ExportOptions) => {
    if (selectedReport) {
      // Simulate adding to generated reports
      const newGenerated = {
        id: `generated-${Date.now()}`,
        reportId: selectedReport.id,
        reportName: selectedReport.name,
        version: generatedReports.filter((g) => g.reportId === selectedReport.id).length + 1,
        format: options.format,
        status: 'completed' as const,
        fileUrl: `/reports/${selectedReport.id}-v${Date.now()}.${options.format}`,
        fileSize: Math.floor(Math.random() * 5000000) + 1000000,
        generatedAt: new Date().toISOString(),
        generatedBy: 'user-1',
        downloadCount: 0,
        comments: [],
        metadata: {
          pageCount: Math.floor(Math.random() * 30) + 10,
          dataPoints: Math.floor(Math.random() * 500) + 100,
          technologies: Math.floor(Math.random() * 100) + 50,
        },
      };

      setGeneratedReports([newGenerated, ...generatedReports]);
      setMetrics({
        ...metrics,
        generatedThisMonth: metrics.generatedThisMonth + 1,
      });

      alert(`Report exported successfully as ${options.format.toUpperCase()}!
File: ${newGenerated.fileUrl}
In production, this would download the file.`);
    }
  };

  const handleGenerateReport = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setShowExportDialog(true);
    }
  };

  // Preview Handler
  const handlePreviewReport = (report?: Report) => {
    if (report) {
      setSelectedReport(report);
    }
    setShowPreview(true);
  };

  // Version Handlers
  const handleViewVersions = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setShowVersions(true);
    }
  };

  const handleDownloadReport = (reportId: string) => {
    alert(`Downloading report...
In production, this would download the file.`);

    setGeneratedReports(
      generatedReports.map((r) =>
        r.id === reportId ? { ...r, downloadCount: r.downloadCount + 1 } : r
      )
    );
    setMetrics({
      ...metrics,
      totalDownloads: metrics.totalDownloads + 1,
    });
  };

  const handleDeleteGenerated = (reportId: string) => {
    if (confirm('Are you sure you want to delete this generated report?')) {
      setGeneratedReports(generatedReports.filter((r) => r.id !== reportId));
    }
  };

  const handleAddComment = (reportId: string, comment: string) => {
    setGeneratedReports(
      generatedReports.map((r) =>
        r.id === reportId
          ? {
              ...r,
              comments: [
                ...r.comments,
                {
                  id: `comment-${Date.now()}`,
                  userId: 'user-1',
                  userName: 'Current User',
                  text: comment,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : r
      )
    );
  };

  // Schedule Handlers
  const handleToggleSchedule = (scheduleId: string) => {
    setSchedules(
      schedules.map((s) =>
        s.id === scheduleId ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  const handleEditSchedule = (schedule: ScheduledReport) => {
    setSelectedSchedule(schedule);
    setShowScheduleEditor(true);
  };

  const handleCreateSchedule = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setSelectedSchedule(null);
      setShowScheduleEditor(true);
    }
  };

  const handleSaveSchedule = (scheduleData: Partial<ScheduledReport>) => {
    if (selectedSchedule) {
      // Update existing schedule
      setSchedules(
        schedules.map((s) =>
          s.id === selectedSchedule.id
            ? { ...s, ...scheduleData, updatedAt: new Date().toISOString() }
            : s
        )
      );
    } else {
      // Create new schedule
      const newSchedule: ScheduledReport = {
        id: `schedule-${Date.now()}`,
        reportId: scheduleData.reportId!,
        reportName: scheduleData.reportName!,
        enabled: true,
        recurrence: scheduleData.recurrence!,
        schedule: scheduleData.schedule!,
        recipients: scheduleData.recipients!,
        deliveryChannels: scheduleData.deliveryChannels!,
        exportFormat: scheduleData.exportFormat!,
        nextRun: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSchedules([...schedules, newSchedule]);
      setMetrics({
        ...metrics,
        activeSchedules: metrics.activeSchedules + 1,
      });

      alert('Schedule created successfully!');
    }
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter((s) => s.id !== scheduleId));
      setMetrics({
        ...metrics,
        activeSchedules: metrics.activeSchedules - 1,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <ReportsHeader
          metrics={metrics}
          onCreateReport={handleCreateReport}
          onViewSchedules={() => setShowSchedules(true)}
        />

        {/* View Switcher */}
        <div className="flex items-center gap-2 border-b border-border">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              view === 'list'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            My Reports ({reports.length})
          </button>
          <button
            onClick={() => setView('templates')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              view === 'templates'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Templates ({mockReportTemplates.length})
          </button>
        </div>

        {/* Content */}
        {view === 'list' ? (
          <ReportsList
            reports={reports}
            onEdit={handleEditReport}
            onDelete={handleDeleteReport}
            onExport={handleExportReport}
            onViewVersions={handleViewVersions}
            onGenerate={handleGenerateReport}
          />
        ) : (
          <TemplateGallery
            templates={mockReportTemplates}
            onSelectTemplate={handleSelectTemplate}
          />
        )}
      </div>

      {/* Modals */}
      {showSchedules && (
        <ScheduleManager
          schedules={schedules}
          onToggle={handleToggleSchedule}
          onEdit={handleEditSchedule}
          onDelete={handleDeleteSchedule}
          onClose={() => setShowSchedules(false)}
        />
      )}

      {showExportDialog && selectedReport && (
        <ExportDialog
          reportName={selectedReport.name}
          onExport={handleExportWithOptions}
          onClose={() => {
            setShowExportDialog(false);
            setSelectedReport(null);
          }}
        />
      )}

      {showVersions && selectedReport && (
        <GeneratedReportsList
          reportName={selectedReport.name}
          reports={generatedReports.filter((r) => r.reportId === selectedReport.id)}
          onDownload={handleDownloadReport}
          onDelete={handleDeleteGenerated}
          onAddComment={handleAddComment}
          onClose={() => {
            setShowVersions(false);
            setSelectedReport(null);
          }}
        />
      )}

      {showScheduleEditor && (
        <ScheduleEditor
          reportId={selectedReport?.id || ''}
          reportName={selectedReport?.name || ''}
          existingSchedule={selectedSchedule || undefined}
          onSave={handleSaveSchedule}
          onClose={() => {
            setShowScheduleEditor(false);
            setSelectedReport(null);
            setSelectedSchedule(null);
          }}
        />
      )}

      {showPreview && selectedReport && (
        <ReportPreview
          report={selectedReport}
          onClose={() => {
            setShowPreview(false);
            if (!showBuilder) {
              setSelectedReport(null);
            }
          }}
          onExport={() => {
            setShowPreview(false);
            setShowExportDialog(true);
          }}
        />
      )}

      {showBuilder && selectedReport && (
        <ReportBuilder
          report={selectedReport}
          onSave={handleSaveReport}
          onPreview={() => handlePreviewReport(selectedReport)}
          onClose={() => {
            setShowBuilder(false);
            setSelectedReport(null);
          }}
        />
      )}
    </div>
  );
}