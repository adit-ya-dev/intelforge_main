// app/reports/components/ReportsList.tsx
'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Edit2,
  FileText,
  MoreVertical,
  Play,
  Trash2,
} from 'lucide-react';
import type { Report, ReportStatus, ExportFormat } from '@/types/reports';

interface ReportsListProps {
  reports: Report[];
  onEdit: (report: Report) => void;
  onDelete: (reportId: string) => void;
  onExport: (reportId: string, format: ExportFormat) => void;
  onViewVersions: (reportId: string) => void;
  onGenerate: (reportId: string) => void;
}

export default function ReportsList({
  reports,
  onEdit,
  onDelete,
  onExport,
  onViewVersions,
  onGenerate,
}: ReportsListProps) {
  const [filter, setFilter] = useState<'all' | ReportStatus>('all');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'status'>('updated');

  const filteredReports = reports.filter(
    (report) => filter === 'all' || report.status === filter
  );

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    if (sortBy === 'updated') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            count={reports.length}
          >
            All Reports
          </FilterButton>
          <FilterButton
            active={filter === 'completed'}
            onClick={() => setFilter('completed')}
            count={reports.filter((r) => r.status === 'completed').length}
          >
            Completed
          </FilterButton>
          <FilterButton
            active={filter === 'scheduled'}
            onClick={() => setFilter('scheduled')}
            count={reports.filter((r) => r.status === 'scheduled').length}
          >
            Scheduled
          </FilterButton>
          <FilterButton
            active={filter === 'draft'}
            onClick={() => setFilter('draft')}
            count={reports.filter((r) => r.status === 'draft').length}
          >
            Draft
          </FilterButton>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="updated">Last Updated</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedReports.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-border bg-card p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'Create your first report to get started'
                : `No ${filter} reports`}
            </p>
          </div>
        ) : (
          sortedReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onEdit={() => onEdit(report)}
              onDelete={() => onDelete(report.id)}
              onExport={(format) => onExport(report.id, format)}
              onViewVersions={() => onViewVersions(report.id)}
              onGenerate={() => onGenerate(report.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, count, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-card border border-border hover:bg-accent'
      }`}
    >
      {children} <span className="ml-1.5 opacity-70">({count})</span>
    </button>
  );
}

interface ReportCardProps {
  report: Report;
  onEdit: () => void;
  onDelete: () => void;
  onExport: (format: ExportFormat) => void;
  onViewVersions: () => void;
  onGenerate: () => void;
}

function ReportCard({
  report,
  onEdit,
  onDelete,
  onExport,
  onViewVersions,
  onGenerate,
}: ReportCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusColors = {
    draft: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    generating: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    scheduled: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1 truncate">{report.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {report.description}
            </p>
          </div>
          <div className="relative ml-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 z-10 w-48 rounded-lg border border-border bg-card shadow-lg">
                <div className="p-1">
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm text-left"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Report
                  </button>
                  <button
                    onClick={() => {
                      onViewVersions();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm text-left"
                  >
                    <Clock className="h-4 w-4" />
                    View Versions
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-500/10 text-red-400 text-sm text-left"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded text-xs font-medium border capitalize ${
              statusColors[report.status]
            }`}
          >
            {report.status}
          </span>
          <span className="px-2 py-1 rounded text-xs bg-accent font-medium capitalize">
            {report.type.replace('-', ' ')}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>{report.widgets.length} widgets</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {report.lastGenerated
                ? formatDate(report.lastGenerated)
                : 'Not generated'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border p-4 bg-accent/20">
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerate}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors"
          >
            <Play className="h-3.5 w-3.5" />
            Generate
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent text-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </button>
          <button
            onClick={() => onExport('pptx')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent text-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            PPTX
          </button>
        </div>
      </div>
    </div>
  );
}