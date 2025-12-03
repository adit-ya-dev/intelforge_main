// app/reports/components/ReportBuilder.tsx
'use client';

import { useState } from 'react';
import { Eye, Save, Settings, X } from 'lucide-react';
import type { Report, ReportWidget } from '@/types/reports';
import WidgetLibrary, { type WidgetType } from './WidgetLibrary';

interface ReportBuilderProps {
  report: Report;
  onSave: (report: Report) => void;
  onPreview: () => void;
  onClose: () => void;
}

export default function ReportBuilder({
  report,
  onSave,
  onPreview,
  onClose,
}: ReportBuilderProps) {
  const [widgets, setWidgets] = useState<ReportWidget[]>(report.widgets);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<WidgetType | null>(null);

  const handleDragStart = (widget: WidgetType) => {
    setDraggedWidget(widget);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedWidget) return;

    // Calculate grid position from drop location
    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * 12);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * 12);

    const newWidget: ReportWidget = {
      id: `widget-${Date.now()}`,
      type: draggedWidget.type,
      title: draggedWidget.name,
      config: {},
      position: {
        x: Math.max(0, Math.min(x, 12 - draggedWidget.defaultSize.width)),
        y: Math.max(0, y),
        width: draggedWidget.defaultSize.width,
        height: draggedWidget.defaultSize.height,
      },
    };

    setWidgets([...widgets, newWidget]);
    setDraggedWidget(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleWidgetClick = (widgetId: string) => {
    setSelectedWidget(selectedWidget === widgetId ? null : widgetId);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter((w) => w.id !== widgetId));
    if (selectedWidget === widgetId) {
      setSelectedWidget(null);
    }
  };

  const handleSave = () => {
    onSave({ ...report, widgets, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between border-b border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">{report.name}</h2>
            <p className="text-sm text-muted-foreground">Report Builder</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full pt-20">
        {/* Widget Library Sidebar */}
        <div className="w-80 border-r border-border bg-card overflow-y-auto">
          <WidgetLibrary onDragStart={handleDragStart} />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-accent/20 p-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative mx-auto bg-white rounded-lg shadow-xl"
            style={{
              width: '8.5in',
              minHeight: '11in',
              padding: '1in',
            }}
          >
            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="grid grid-cols-12 h-full"
                style={{ gridAutoRows: '1fr' }}
              >
                {Array.from({ length: 12 * 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-100"
                  />
                ))}
              </div>
            </div>

            {/* Widgets */}
            {widgets.length === 0 ? (
              <div className="relative z-10 flex items-center justify-center h-full min-h-[500px]">
                <div className="text-center text-gray-400">
                  <p className="text-lg font-medium mb-2">Drop widgets here</p>
                  <p className="text-sm">Drag widgets from the library to build your report</p>
                </div>
              </div>
            ) : (
              <div className="relative z-10">
                {widgets.map((widget) => (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    isSelected={selectedWidget === widget.id}
                    onClick={() => handleWidgetClick(widget.id)}
                    onDelete={() => handleDeleteWidget(widget.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Drop Hint */}
          {draggedWidget && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg bg-primary text-primary-foreground shadow-lg">
              Drop to add {draggedWidget.name} to canvas
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedWidget && (
          <div className="w-80 border-l border-border bg-card overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Widget Properties</h3>
              <button
                onClick={() => setSelectedWidget(null)}
                className="p-1 rounded hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(() => {
              const widget = widgets.find((w) => w.id === selectedWidget);
              if (!widget) return null;

              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={widget.title}
                      onChange={(e) =>
                        setWidgets(
                          widgets.map((w) =>
                            w.id === widget.id ? { ...w, title: e.target.value } : w
                          )
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <div className="px-3 py-2 rounded-lg bg-accent capitalize">
                      {widget.type}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Width</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={widget.position.width}
                        onChange={(e) =>
                          setWidgets(
                            widgets.map((w) =>
                              w.id === widget.id
                                ? {
                                    ...w,
                                    position: {
                                      ...w.position,
                                      width: parseInt(e.target.value),
                                    },
                                  }
                                : w
                            )
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Height</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={widget.position.height}
                        onChange={(e) =>
                          setWidgets(
                            widgets.map((w) =>
                              w.id === widget.id
                                ? {
                                    ...w,
                                    position: {
                                      ...w.position,
                                      height: parseInt(e.target.value),
                                    },
                                  }
                                : w
                            )
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <button
                      onClick={() => handleDeleteWidget(widget.id)}
                      className="w-full px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      Delete Widget
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

interface WidgetCardProps {
  widget: ReportWidget;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

function WidgetCard({ widget, isSelected, onClick }: WidgetCardProps) {
  return (
    <div
      onClick={onClick}
      className={`absolute border-2 rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-md'
      }`}
      style={{
        left: `${(widget.position.x / 12) * 100}%`,
        top: `${widget.position.y * 50}px`,
        width: `${(widget.position.width / 12) * 100}%`,
        height: `${widget.position.height * 50}px`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm text-gray-900">{widget.title}</h4>
        <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 capitalize">
          {widget.type}
        </span>
      </div>
      <div className="h-[calc(100%-2rem)] bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center">
        <Settings className="h-8 w-8 text-gray-300" />
      </div>
    </div>
  );
}