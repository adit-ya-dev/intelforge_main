// app/reports/components/GeneratedReportsList.tsx
'use client';

import { useState } from 'react';
import {
  Download,
  FileText,
  MessageSquare,
  MoreVertical,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import type { GeneratedReport } from '@/types/reports';

interface GeneratedReportsListProps {
  reportName: string;
  reports: GeneratedReport[];
  onDownload: (reportId: string) => void;
  onDelete: (reportId: string) => void;
  onAddComment: (reportId: string, comment: string) => void;
  onClose: () => void;
}

export default function GeneratedReportsList({
  reportName,
  reports,
  onDownload,
  onDelete,
  onAddComment,
  onClose,
}: GeneratedReportsListProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold">Report Versions</h2>
            <p className="text-sm text-muted-foreground mt-1">{reportName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {reports.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-accent/20 p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Generated Reports</h3>
              <p className="text-sm text-muted-foreground">
                Generate your first report to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportVersionCard
                  key={report.id}
                  report={report}
                  onDownload={() => onDownload(report.id)}
                  onDelete={() => onDelete(report.id)}
                  onAddComment={(comment) => onAddComment(report.id, comment)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReportVersionCardProps {
  report: GeneratedReport;
  onDownload: () => void;
  onDelete: () => void;
  onAddComment: (comment: string) => void;
}

function ReportVersionCard({
  report,
  onDownload,
  onDelete,
  onAddComment,
}: ReportVersionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const statusColors = {
    generating: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold">Version {report.version}</h4>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium border capitalize ${
                  statusColors[report.status]
                }`}
              >
                {report.status}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-accent font-medium uppercase">
                {report.format}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{formatDate(report.generatedAt)}</span>
              <span>by {report.generatedBy}</span>
              {report.fileSize && <span>{formatFileSize(report.fileSize)}</span>}
              <span>{report.downloadCount} downloads</span>
            </div>
          </div>

          <div className="relative">
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
                      alert('Share functionality');
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm text-left"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
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
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        {report.metadata && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            {report.metadata.pageCount && (
              <span>{report.metadata.pageCount} pages</span>
            )}
            {report.metadata.dataPoints && (
              <span>{report.metadata.dataPoints} data points</span>
            )}
            {report.metadata.technologies && (
              <span>{report.metadata.technologies} technologies</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDownload}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{report.comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-border p-4 bg-accent/20">
          <h5 className="font-medium text-sm mb-3">Comments</h5>
          
          {report.comments.length === 0 ? (
            <p className="text-sm text-muted-foreground mb-3">No comments yet</p>
          ) : (
            <div className="space-y-3 mb-3">
              {report.comments.map((comment) => (
                <div key={comment.id} className="p-3 rounded-lg bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}