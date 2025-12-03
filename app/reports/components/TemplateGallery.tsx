// app/reports/components/TemplateGallery.tsx
'use client';

import { FileText, TrendingUp, Users } from 'lucide-react';
import type { ReportTemplate } from '@/types/reports';

interface TemplateGalleryProps {
  templates: ReportTemplate[];
  onSelectTemplate: (template: ReportTemplate) => void;
}

export default function TemplateGallery({
  templates,
  onSelectTemplate,
}: TemplateGalleryProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'executive-brief':
        return <FileText className="h-6 w-6" />;
      case 'patent-snapshot':
        return <TrendingUp className="h-6 w-6" />;
      case 'trl-progress':
        return <Users className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Report Templates</h3>
        <p className="text-sm text-muted-foreground">
          Start with a pre-built template or create from scratch
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="p-6 rounded-lg border border-border hover:border-primary hover:bg-accent text-left transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {getIcon(template.type)}
              </div>
              <span className="px-2 py-1 rounded text-xs bg-accent font-medium">
                {template.usageCount} uses
              </span>
            </div>

            <h4 className="font-semibold mb-2">{template.name}</h4>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {template.description}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{template.widgets.length} widgets</span>
              <span className="capitalize">{template.category}</span>
            </div>
          </button>
        ))}

        {/* Custom Template Option */}
        <button
          onClick={() => onSelectTemplate({
            id: 'custom',
            name: 'Blank Report',
            description: 'Start from scratch',
            type: 'custom',
            thumbnail: '',
            widgets: [],
            category: 'custom',
            usageCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })}
          className="p-6 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-accent text-left transition-all"
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Plus className="h-12 w-12 text-muted-foreground mb-3" />
            <h4 className="font-semibold mb-2">Start from Scratch</h4>
            <p className="text-sm text-muted-foreground">
              Build a custom report with your own layout
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}