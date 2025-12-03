// app/reports/components/WidgetLibrary.tsx
'use client';

import {
  BarChart3,
  FileText,
  Grid3x3,
  LineChart,
  ListChecks,
  MapPin,
  PieChart,
  Table2,
  TrendingUp,
} from 'lucide-react';

export interface WidgetType {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'text' | 'techlist' | 'map';
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'charts' | 'data' | 'content';
  defaultSize: {
    width: number;
    height: number;
  };
}

interface WidgetLibraryProps {
  onDragStart: (widget: WidgetType) => void;
}

export default function WidgetLibrary({ onDragStart }: WidgetLibraryProps) {
  const widgets: WidgetType[] = [
    // Charts
    {
      id: 'line-chart',
      type: 'chart',
      name: 'Line Chart',
      description: 'Show trends over time',
      icon: <LineChart className="h-5 w-5" />,
      category: 'charts',
      defaultSize: { width: 6, height: 4 },
    },
    {
      id: 'bar-chart',
      type: 'chart',
      name: 'Bar Chart',
      description: 'Compare categories',
      icon: <BarChart3 className="h-5 w-5" />,
      category: 'charts',
      defaultSize: { width: 6, height: 4 },
    },
    {
      id: 'pie-chart',
      type: 'chart',
      name: 'Pie Chart',
      description: 'Show proportions',
      icon: <PieChart className="h-5 w-5" />,
      category: 'charts',
      defaultSize: { width: 4, height: 4 },
    },
    {
      id: 'area-chart',
      type: 'chart',
      name: 'Area Chart',
      description: 'Filled line chart',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'charts',
      defaultSize: { width: 6, height: 4 },
    },

    // Data
    {
      id: 'data-table',
      type: 'table',
      name: 'Data Table',
      description: 'Tabular data display',
      icon: <Table2 className="h-5 w-5" />,
      category: 'data',
      defaultSize: { width: 12, height: 6 },
    },
    {
      id: 'metric-card',
      type: 'metric',
      name: 'Metric Card',
      description: 'Key performance indicator',
      icon: <Grid3x3 className="h-5 w-5" />,
      category: 'data',
      defaultSize: { width: 3, height: 2 },
    },
    {
      id: 'tech-list',
      type: 'techlist',
      name: 'Technology List',
      description: 'List of technologies',
      icon: <ListChecks className="h-5 w-5" />,
      category: 'data',
      defaultSize: { width: 6, height: 6 },
    },

    // Content
    {
      id: 'text-block',
      type: 'text',
      name: 'Text Block',
      description: 'Rich text content',
      icon: <FileText className="h-5 w-5" />,
      category: 'content',
      defaultSize: { width: 12, height: 3 },
    },
    {
      id: 'map-view',
      type: 'map',
      name: 'Map View',
      description: 'Geographic visualization',
      icon: <MapPin className="h-5 w-5" />,
      category: 'content',
      defaultSize: { width: 12, height: 6 },
    },
  ];

  const categories = {
    charts: { label: 'Charts', widgets: widgets.filter((w) => w.category === 'charts') },
    data: { label: 'Data', widgets: widgets.filter((w) => w.category === 'data') },
    content: { label: 'Content', widgets: widgets.filter((w) => w.category === 'content') },
  };

  return (
    <div className="h-full overflow-y-auto space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Widget Library</h3>
        <p className="text-sm text-muted-foreground">
          Drag widgets to the canvas to build your report
        </p>
      </div>

      {Object.entries(categories).map(([key, category]) => (
        <div key={key}>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            {category.label}
          </h4>
          <div className="space-y-2">
            {category.widgets.map((widget) => (
              <div
                key={widget.id}
                draggable
                onDragStart={() => onDragStart(widget)}
                className="p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary cursor-move transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {widget.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm mb-0.5">{widget.name}</h5>
                    <p className="text-xs text-muted-foreground">{widget.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Usage Hint */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
        <p className="text-xs">
          <strong>Tip:</strong> Drag widgets onto the canvas to add them to your report. 
          You can resize and reposition them after adding.
        </p>
      </div>
    </div>
  );
}