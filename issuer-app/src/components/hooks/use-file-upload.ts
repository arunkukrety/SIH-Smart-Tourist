"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type FileType = "image" | "pdf" | "document" | "text" | "unknown";

export interface FilePreview {
  id: string;
  file: File;
  url: string | null;
  type: FileType;
  name: string;
  size: number;
  mime: string;
  textSample?: string;
}

interface UseMultiFileUploadProps {
  onUpload?: (files: FilePreview[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  readTextSampleBytes?: number;
}

export function useFileUpload({
  onUpload,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ["image/*", "application/pdf", ".doc", ".docx", ".txt", ".csv"],
  readTextSampleBytes = 1024,
}: UseMultiFileUploadProps = {}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const detectFileType = (file: File): FileType => {
    const mime = file.type.toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (mime.startsWith("image/")) return "image";
    if (mime === "application/pdf") return "pdf";
    if (mime.includes("document") || mime.includes("word") || 
        extension === "doc" || extension === "docx") return "document";
    if (mime.startsWith("text/") || extension === "txt" || extension === "csv") return "text";
    return "unknown";
  };

  const readTextSample = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      const blob = file.slice(0, readTextSampleBytes);
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsText(blob);
    });

  const createFilePreview = async (file: File): Promise<FilePreview> => {
    const type = detectFileType(file);
    const url = type === "image" || type === "pdf" ? URL.createObjectURL(file) : null;
    
    let textSample: string | undefined;
    if (type === "text") {
      try {
        textSample = await readTextSample(file);
      } catch {
        textSample = undefined;
      }
    }

    return {
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      url,
      type,
      name: file.name,
      size: file.size,
      mime: file.type,
      textSample,
    };
  };

  const handleFileChange = useCallback(async (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      console.warn(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = newFiles.filter(file => {
      if (file.size > maxFileSize) {
        console.warn(`File ${file.name} is too large (max ${maxFileSize / 1024 / 1024}MB)`);
        return false;
      }
      return true;
    });

    const filePreviews = await Promise.all(
      validFiles.map(file => createFilePreview(file))
    );

    setFiles(prev => {
      const updated = [...prev, ...filePreviews];
      onUpload?.(updated);
      return updated;
    });
  }, [files.length, maxFiles, maxFileSize, onUpload, readTextSampleBytes]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      onUpload?.(updated);
      return updated;
    });
  }, [onUpload]);

  const clearAll = useCallback(() => {
    setFiles([]);
    onUpload?.([]);
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileChange(droppedFiles);
  }, [handleFileChange]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [files]);

  return {
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
    acceptedTypes: acceptedTypes.join(","),
  };
}
