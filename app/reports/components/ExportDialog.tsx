// app/reports/components/ExportDialog.tsx
'use client';

import { useState } from 'react';
import { Check, Download, FileText, Presentation, Table, X } from 'lucide-react';
import type { ExportFormat, ExportOptions } from '@/types/reports';

interface ExportDialogProps {
  reportName: string;
  onExport: (options: ExportOptions) => void;
  onClose: () => void;
}

export default function ExportDialog({
  reportName,
  onExport,
  onClose,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeRawData: false,
    orientation: 'portrait',
    pageSize: 'A4',
    quality: 'high',
  });

  const handleExport = () => {
    onExport({ ...options, format: selectedFormat });
    onClose();
  };

  const formats = [
    {
      value: 'pdf' as ExportFormat,
      label: 'PDF Document',
      icon: <FileText className="h-6 w-6" />,
      description: 'Professional document format',
      features: ['Charts', 'Tables', 'Formatting'],
    },
    {
      value: 'pptx' as ExportFormat,
      label: 'PowerPoint',
      icon: <Presentation className="h-6 w-6" />,
      description: 'Presentation slides',
      features: ['One slide per widget', 'Editable'],
    },
    {
      value: 'csv' as ExportFormat,
      label: 'CSV Data',
      icon: <Table className="h-6 w-6" />,
      description: 'Raw data export',
      features: ['Data only', 'Excel compatible'],
    },
    {
      value: 'json' as ExportFormat,
      label: 'JSON Data',
      icon: <FileText className="h-6 w-6" />,
      description: 'Structured data format',
      features: ['Full data', 'API friendly'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold">Export Report</h2>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Format Selection */}
          <div>
            <h3 className="font-semibold mb-4">Select Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => {
                    setSelectedFormat(format.value);
                    setOptions({ ...options, format: format.value });
                  }}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedFormat === format.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        selectedFormat === format.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-muted-foreground'
                      }`}
                    >
                      {format.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{format.label}</h4>
                        {selectedFormat === format.value && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {format.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-0.5 rounded text-xs bg-accent"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options for PDF/PPTX */}
          {(selectedFormat === 'pdf' || selectedFormat === 'pptx') && (
            <>
              {/* Include Options */}
              <div>
                <h3 className="font-semibold mb-4">Include</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={options.includeCharts}
                      onChange={(e) =>
                        setOptions({ ...options, includeCharts: e.target.checked })
                      }
                      className="rounded border-border"
                    />
                    <div>
                      <p className="font-medium text-sm">Charts and Visualizations</p>
                      <p className="text-xs text-muted-foreground">
                        Include all charts and graphs
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={options.includeRawData}
                      onChange={(e) =>
                        setOptions({ ...options, includeRawData: e.target.checked })
                      }
                      className="rounded border-border"
                    />
                    <div>
                      <p className="font-medium text-sm">Raw Data Tables</p>
                      <p className="text-xs text-muted-foreground">
                        Append data tables at the end
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Page Settings */}
              {selectedFormat === 'pdf' && (
                <div>
                  <h3 className="font-semibold mb-4">Page Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Orientation
                      </label>
                      <select
                        value={options.orientation}
                        onChange={(e) =>
                          setOptions({
                            ...options,
                            orientation: e.target.value as 'portrait' | 'landscape',
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Page Size
                      </label>
                      <select
                        value={options.pageSize}
                        onChange={(e) =>
                          setOptions({
                            ...options,
                            pageSize: e.target.value as ExportOptions['pageSize'],
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="A4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Quality Settings */}
              <div>
                <h3 className="font-semibold mb-4">Quality</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setOptions({ ...options, quality })}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        options.quality === quality
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                      }`}
                    >
                      <p className="font-medium text-sm capitalize">{quality}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {quality === 'low' && 'Smaller file'}
                        {quality === 'medium' && 'Balanced'}
                        {quality === 'high' && 'Best quality'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Data Export Note */}
          {(selectedFormat === 'csv' || selectedFormat === 'json') && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <p className="text-sm">
                <strong>Note:</strong> This will export raw data only. Charts and
                formatting will not be included.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-6">
          <p className="text-sm text-muted-foreground">
            Estimated size: {selectedFormat === 'pdf' ? '2-5 MB' : selectedFormat === 'pptx' ? '3-8 MB' : '< 1 MB'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export {selectedFormat.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}