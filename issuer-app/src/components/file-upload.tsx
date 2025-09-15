"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFileUpload, FilePreview } from "@/components/hooks/use-file-upload";
import { 
  ImagePlus, 
  X, 
  Upload, 
  Trash2, 
  FileText, 
  FileImage, 
  File,
  Eye,
  Download
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "../lib/utils";

function getFileIcon(type: string) {
  switch (type) {
    case "image":
      return FileImage;
    case "pdf":
    case "document":
      return FileText;
    default:
      return File;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function FilePreviewCard({ file, onRemove }: { file: FilePreview; onRemove: (id: string) => void }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const Icon = getFileIcon(file.type);

  return (
    <div className="relative group border rounded-lg p-4 bg-card">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {file.type === "image" && file.url ? (
            <div className="w-12 h-12 relative rounded overflow-hidden">
              <Image
                src={file.url}
                alt={file.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{file.name}</h4>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)} • {file.mime}
          </p>
          
          {file.type === "text" && file.textSample && (
            <div className="mt-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                {showPreview ? "Hide" : "Show"} preview
              </button>
              {showPreview && (
                <div className="mt-2 p-2 bg-muted rounded text-xs max-h-20 overflow-auto">
                  {file.textSample}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {file.type === "image" && file.url && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowImagePreview(true)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {file.type === "pdf" && file.url && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPreview(true)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(file.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {file.type === "image" && file.url && showImagePreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">{file.name}</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(file.url!, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Open in new tab
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowImagePreview(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="relative w-full h-full max-w-5xl max-h-[calc(90vh-120px)]">
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {file.type === "pdf" && file.url && showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">{file.name}</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(file.url!, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Open in new tab
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPreview(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={file.url}
                className="w-full h-full border rounded"
                title={`PDF Preview: ${file.name}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FileUpload() {
  const {
    files,
    isDragging,
    fileInputRef,
    handleClick,
    handleFileChange,
    removeFile,
    clearAll,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    acceptedTypes,
  } = useFileUpload({
    onUpload: (files) => console.log("Uploaded files:", files),
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: [
      "image/*",
      "application/pdf",
      ".doc",
      ".docx",
      ".txt",
      ".csv",
      ".xlsx",
      ".xls",
      ".ppt",
      ".pptx"
    ],
  });

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">File Upload</h3>
        <p className="text-muted-foreground">
          Upload images, PDFs, documents, and text files. Drag & drop or click to select.
        </p>
        <p className="text-sm text-muted-foreground">
          Supported: Images, PDF, DOC/DOCX, TXT, CSV, XLSX, PPT/PPTX (Max 10MB each, up to 10 files)
        </p>
      </div>

      <Input
        type="file"
        accept={acceptedTypes}
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
      />

      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex h-48 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
          isDragging && "border-primary/50 bg-primary/5",
        )}
      >
        <div className="rounded-full bg-background p-3 shadow-sm">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">
            {isDragging ? "Drop files here" : "Click to select files"}
          </p>
          <p className="text-sm text-muted-foreground">
            or drag and drop multiple files here
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">
              Uploaded Files ({files.length})
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={clearAll}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
          
          <div className="grid gap-3">
            {files.map((file) => (
              <FilePreviewCard
                key={file.id}
                file={file}
                onRemove={removeFile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {files.length > 0 && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <h5 className="font-medium mb-2">Upload Summary</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Files:</span>
              <span className="ml-2 font-medium">{files.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Size:</span>
              <span className="ml-2 font-medium">
                {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Images:</span>
              <span className="ml-2 font-medium">
                {files.filter(f => f.type === "image").length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Documents:</span>
              <span className="ml-2 font-medium">
                {files.filter(f => f.type === "pdf" || f.type === "document").length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
