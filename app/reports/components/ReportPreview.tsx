// app/reports/components/ReportPreview.tsx
'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { Report } from '@/types/reports';

interface ReportPreviewProps {
  report: Report;
  onClose: () => void;
  onExport: () => void;
}

export default function ReportPreview({
  report,
  onClose,
  onExport,
}: ReportPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);

  // Mock total pages - in real app this would come from rendered report
  const totalPages = Math.max(1, Math.ceil(report.widgets.length / 2));

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div
        className={`${
          fullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-[90vh]'
        } overflow-hidden rounded-lg border border-border bg-card shadow-xl flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{report.name}</h2>
            <p className="text-sm text-muted-foreground">Preview</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-background">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-1 rounded hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-1 rounded hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>

            {/* Export */}
            <button
              onClick={onExport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-accent/20 p-8">
          <div
            className="mx-auto bg-white shadow-2xl"
            style={{
              width: `${(8.5 * zoom) / 100}in`,
              minHeight: `${(11 * zoom) / 100}in`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Report Content Preview */}
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="border-b-2 border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-900">{report.name}</h1>
                {report.description && (
                  <p className="text-gray-600 mt-2">{report.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span>•</span>
                  <span>Generated: {new Date().toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="capitalize">{report.type.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Widgets Preview (Mock) */}
              <div className="space-y-6">
                {report.widgets
                  .slice((currentPage - 1) * 2, currentPage * 2)
                  .map((widget) => (
                    <div
                      key={widget.id}
                      className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {widget.title}
                      </h3>
                      <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <p className="font-medium capitalize">{widget.type} Widget</p>
                          <p className="text-sm mt-1">Preview not available</p>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Empty state */}
                {report.widgets.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-lg font-medium">No widgets added</p>
                    <p className="text-sm mt-1">Add widgets to see them in the preview</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {report.styling.footer && (
                <div className="border-t-2 border-gray-200 pt-4 mt-8 text-sm text-gray-500 text-center">
                  {report.styling.footer}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-between border-t border-border p-4">
          <div className="text-sm text-muted-foreground">
            {report.widgets.length} widget{report.widgets.length !== 1 ? 's' : ''} •{' '}
            {totalPages} page{totalPages !== 1 ? 's' : ''}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <div className="px-4 py-2 rounded-lg bg-accent font-medium text-sm">
              Page {currentPage} / {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="w-32" /> {/* Spacer for alignment */}
        </div>
      </div>
    </div>
  );
}