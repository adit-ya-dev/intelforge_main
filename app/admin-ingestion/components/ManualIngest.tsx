// app/admin-ingestion/components/ManualIngest.tsx

"use client";

import { useState } from 'react';
import { mockDocumentUploads } from '@/lib/admin-ingestion-mock-data';
import { DocumentUpload, FieldMapping } from '@/types/admin-ingestion';

export default function ManualIngest() {
  const [uploads, setUploads] = useState<DocumentUpload[]>(mockDocumentUploads);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mappingStep, setMappingStep] = useState(false);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    { sourceField: '', targetField: '', transformation: 'none', required: false }
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setMappingStep(true);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const newUpload: DocumentUpload = {
      id: `upload-${Date.now()}`,
      fileName: selectedFile.name,
      fileType: (selectedFile.name.split('.').pop() || '') as any,
      fileSize: selectedFile.size,
      uploadDate: new Date(),
      status: 'uploading',
      progress: 0,
      documentsExtracted: 0
    };

    setUploads([newUpload, ...uploads]);
    setMappingStep(false);
    setSelectedFile(null);

    // Simulate upload progress
    simulateUpload(newUpload.id);
  };

  const simulateUpload = (uploadId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploads(prev => prev.map(u => 
        u.id === uploadId 
          ? { ...u, progress, status: progress >= 100 ? 'completed' : 'processing' as any, documentsExtracted: Math.floor(progress * 12.5) }
          : u
      ));
      if (progress >= 100) clearInterval(interval);
    }, 500);
  };

  const addFieldMapping = () => {
    setFieldMappings([...fieldMappings, { sourceField: '', targetField: '', transformation: 'none', required: false }]);
  };

  const updateFieldMapping = (index: number, field: keyof FieldMapping, value: any) => {
    const updated = [...fieldMappings];
    updated[index] = { ...updated[index], [field]: value };
    setFieldMappings(updated);
  };

  const removeFieldMapping = (index: number) => {
    setFieldMappings(fieldMappings.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  function renderFileIcon(type: string | undefined) {
    switch ((type || '').toLowerCase()) {
      case 'pdf':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 7h6M7 11h6M7 15h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="17" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        );
      case 'csv':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7 8h10M7 12h10M7 16h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );
      case 'json':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M8 7l-3 5 3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 7l3 5-3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5v14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );
      case 'xml':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M8 7l-3 5 3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 7l3 5-3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5v14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 3v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M20 21H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M16 7l-4-4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  }

  function UploadIconLarge() {
    return (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M16 16v4H8v-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 16a4 4 0 00-4-4h-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12a4 4 0 00-4 4v0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  function RocketIconSmall() {
    return (
      <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2s4 1 6 3 3 6 3 6-3 1-6 3-6 1-6 1-1-4 1-6S12 2 12 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 17s-1 3-3 4l1-3 2-1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  function WarningInline() {
    return (
      <svg className="w-4 h-4 inline-block mr-2 text-red-400" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h17.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 9v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Manual Document Upload</h2>
        
        {!mappingStep ? (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-border'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl">
                <UploadIconLarge />
              </div>
              <div>
                <p className="text-lg font-medium text-white">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supported formats: PDF, CSV, JSON, XML
                </p>
              </div>
              <input
                type="file"
                accept=".pdf,.csv,.json,.xml"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Choose File
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected File Info */}
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-muted/10 flex items-center justify-center text-white">
                    {renderFileIcon(selectedFile?.name.split('.').pop())}
                  </div>
                  <div>
                    <p className="font-medium text-white">{selectedFile?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedFile && formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMappingStep(false);
                    setSelectedFile(null);
                  }}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  aria-label="Close file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Field Mapping */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Field Mappings</h3>
                <button
                  onClick={addFieldMapping}
                  className="px-3 py-1 text-sm bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-600/30 transition-colors"
                >
                  + Add Mapping
                </button>
              </div>

              <div className="space-y-3">
                {fieldMappings.map((mapping, index) => (
                  <div key={index} className="bg-background border border-border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Source Field</label>
                        <input
                          type="text"
                          value={mapping.sourceField}
                          onChange={(e) => updateFieldMapping(index, 'sourceField', e.target.value)}
                          placeholder="e.g., title"
                          className="w-full px-3 py-2 bg-card border border-border rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Target Field</label>
                        <input
                          type="text"
                          value={mapping.targetField}
                          onChange={(e) => updateFieldMapping(index, 'targetField', e.target.value)}
                          placeholder="e.g., document_title"
                          className="w-full px-3 py-2 bg-card border border-border rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Transformation</label>
                        <select
                          value={mapping.transformation}
                          onChange={(e) => updateFieldMapping(index, 'transformation', e.target.value)}
                          className="w-full px-3 py-2 bg-card border border-border rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="none">None</option>
                          <option value="lowercase">Lowercase</option>
                          <option value="uppercase">Uppercase</option>
                          <option value="date">Parse Date</option>
                          <option value="number">To Number</option>
                          <option value="json">Parse JSON</option>
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <label className="flex items-center gap-2 flex-1">
                          <input
                            type="checkbox"
                            checked={mapping.required}
                            onChange={(e) => updateFieldMapping(index, 'required', e.target.checked)}
                            className="w-4 h-4 bg-card border border-border rounded text-blue-500"
                          />
                          <span className="text-sm text-white">Required</span>
                        </label>
                        <button
                          onClick={() => removeFieldMapping(index)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          aria-label={`Remove mapping ${index + 1}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setMappingStep(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <RocketIconSmall />
                <span>Start Processing</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Uploads */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Uploads</h2>
        
        <div className="space-y-3">
          {uploads.map((upload) => (
            <div key={upload.id} className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-muted/10 flex items-center justify-center text-white">
                    {renderFileIcon(upload.fileType)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{upload.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(upload.fileSize)} • {upload.uploadDate.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  upload.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : upload.status === 'failed'
                    ? 'bg-red-500/20 text-red-400 border-red-500/50'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                }`}>
                  {upload.status}
                </span>
              </div>

              {(upload.status === 'uploading' || upload.status === 'processing') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Processing</span>
                    <span className="text-xs text-muted-foreground">{upload.progress}%</span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {upload.status === 'completed' && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-400">
                    ✓ {upload.documentsExtracted} documents extracted
                  </p>
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View Documents →
                  </button>
                </div>
              )}

              {upload.errors && upload.errors.length > 0 && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
                  {upload.errors.map((error, idx) => (
                    <p key={idx} className="text-xs text-red-400 flex items-center gap-2">
                      <WarningInline />
                      <span>{error}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
