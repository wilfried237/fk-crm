"use client"

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  FileUp, 
  FileCheck, 
  FileX, 
  Eye, 
  X, 
  Download, 
  FileText, 
  Image, 
  File,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Button } from './button';

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  error?: string;
  preview?: string;
  uploadProgress?: number;
}

interface DocumentUploadProps {
  type: string;
  label: string;
  files: UploadedFile[];
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
  required?: boolean;
  onUpload: (files: File[]) => void;
  onRemove: (fileId: string) => void;
  onView: (file: UploadedFile) => void;
  onRetry?: (fileId: string) => void;
  className?: string;
}

// File type configurations with better MIME type support
const FILE_CONFIGS = {
  pdf: { 
    icon: FileText, 
    color: 'text-red-500', 
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf']
  },
  doc: { 
    icon: FileText, 
    color: 'text-blue-500', 
    mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['.doc', '.docx']
  },
  image: { 
    icon: Image, 
    color: 'text-green-500', 
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  default: { 
    icon: File, 
    color: 'text-gray-500', 
    mimeTypes: [],
    extensions: []
  }
};

export function DocumentUpload({
  label,
  files,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  disabled = false,
  required = false,
  onUpload,
  onRemove,
  onView,
  onRetry,
  className = ''
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);


  // Enhanced file validation
  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Size validation
    if (file.size > maxFileSize * 1024 * 1024) {
      return {
        isValid: false,
        error: `File "${file.name}" exceeds ${maxFileSize}MB limit (${formatFileSize(file.size)})`
      };
    }

    // Type validation - check both extension and MIME type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isExtensionValid = acceptedTypes.includes(fileExtension);
    
    // Additional MIME type validation for better security
    const isMimeTypeValid = Object.values(FILE_CONFIGS).some(config =>
      config.mimeTypes.some(mimeType => mimeType === file.type)
    );

    if (!isExtensionValid && !isMimeTypeValid) {
      return {
        isValid: false,
        error: `File "${file.name}" type not supported. Accepted types: ${acceptedTypes.join(', ')}`
      };
    }

    // Check for duplicate files
    const isDuplicate = files.some(existingFile => 
      existingFile.file.name === file.name && 
      existingFile.file.size === file.size
    );

    if (isDuplicate) {
      return {
        isValid: false,
        error: `File "${file.name}" is already uploaded`
      };
    }

    return { isValid: true };
  }, [maxFileSize, acceptedTypes, files]);

  // Enhanced file processing with validation
  const validateAndUploadFiles = useCallback(async (selectedFiles: File[]) => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    // Check if adding these files would exceed the limit
    if (files.length + selectedFiles.length > maxFiles) {
      errors.push(`Cannot upload ${selectedFiles.length} files. Maximum ${maxFiles} files allowed (${files.length} already uploaded).`);
      setValidationErrors(errors);
      return;
    }

    // Validate each file
    for (const file of selectedFiles) {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(validation.error!);
      }
    }

    setValidationErrors(errors);

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  }, [files.length, maxFiles, validateFile, onUpload]);

  // Enhanced drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      validateAndUploadFiles(droppedFiles);
    }
  }, [disabled, validateAndUploadFiles]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      validateAndUploadFiles(selectedFiles);
    }
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [disabled, validateAndUploadFiles]);

  // Get appropriate file icon and color
  const getFileConfig = useCallback((file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') return FILE_CONFIGS.pdf;
    if (['doc', 'docx'].includes(extension || '')) return FILE_CONFIGS.doc;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return FILE_CONFIGS.image;
    
    return FILE_CONFIGS.default;
  }, []);

  // Enhanced file size formatting
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Enhanced status icon with loading state
  const getStatusIcon = useCallback((file: UploadedFile) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (file.status) {
      case 'uploaded':
        return <FileCheck {...iconProps} className="h-4 w-4 text-green-500" />;
      case 'uploading':
        return <Loader2 {...iconProps} className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <FileX {...iconProps} className="h-4 w-4 text-red-500" />;
      default:
        return <FileUp {...iconProps} className="h-4 w-4 text-gray-400" />;
    }
  }, []);

  // Clear validation errors when files change
  useEffect(() => {
    if (validationErrors.length > 0) {
      const timer = setTimeout(() => setValidationErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [validationErrors]);

  const canUploadMore = files.length < maxFiles && !disabled;
  const hasErrors = validationErrors.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            {label}
            {required && <span className="text-red-500">*</span>}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Max {maxFiles} files, up to {maxFileSize}MB each
          </p>
          <p className="text-xs text-gray-400">
            Supported: {acceptedTypes.join(', ')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">
            {files.length}/{maxFiles} files
          </div>
          {files.length > 0 && (
            <div className="text-xs text-gray-400">
              {formatFileSize(files.reduce((total, file) => total + file.file.size, 0))} total
            </div>
          )}
        </div>
      </div>
      
      {/* Validation Errors */}
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <h5 className="text-sm font-medium text-red-800 mb-1">Upload Errors</h5>
              <ul className="text-xs text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {canUploadMore && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50 scale-105' 
              : disabled
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FileUp className={`mx-auto h-12 w-12 mb-4 transition-colors ${
            dragActive ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <p className="text-sm text-gray-600 mb-2">
            {dragActive ? (
              "Drop files here to upload"
            ) : (
              <>
                Drag and drop files here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  browse
                </button>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500">
            {maxFiles - files.length} more files allowed
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
            aria-label={`Upload ${label.toLowerCase()}`}
          />
        </div>
      )}

      {/* File Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((uploadedFile) => {
            const fileConfig = getFileConfig(uploadedFile.file);
            const IconComponent = fileConfig.icon;
            
            return (
              <div
                key={uploadedFile.id}
                className={`group relative bg-white border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                  uploadedFile.status === 'error' 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Upload Progress Bar */}
                {uploadedFile.status === 'uploading' && uploadedFile.uploadProgress !== undefined && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-lg overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadedFile.uploadProgress}%` }}
                    />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  {getStatusIcon(uploadedFile)}
                </div>

                {/* File Preview */}
                <div className="flex items-start space-x-3 mb-3">
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="h-12 w-12 object-cover rounded border flex-shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded flex-shrink-0">
                      <IconComponent className={`h-6 w-6 ${fileConfig.color}`} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate" title={uploadedFile.file.name}>
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                    {uploadedFile.status === 'uploading' && uploadedFile.uploadProgress !== undefined && (
                      <p className="text-xs text-blue-600">
                        Uploading... {uploadedFile.uploadProgress}%
                      </p>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {uploadedFile.error && (
                  <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                    {uploadedFile.error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
            <Button
                      variant="ghost"
              size="sm"
                      onClick={() => onView(uploadedFile)}
                      disabled={uploadedFile.status === 'uploading'}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      title="View file"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
                      variant="ghost"
              size="sm"
                      disabled={uploadedFile.status !== 'uploaded'}
                      className="h-8 w-8 p-0 hover:bg-gray-100 disabled:opacity-50"
                      title="Download file"
                      onClick={() => {
                        const url = URL.createObjectURL(uploadedFile.file);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = uploadedFile.file.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="h-4 w-4" />
            </Button>
                    {uploadedFile.status === 'error' && onRetry && (
          <Button
                        variant="ghost"
            size="sm"
                        onClick={() => onRetry(uploadedFile.id)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 text-blue-600"
                        title="Retry upload"
          >
                        <RefreshCw className="h-4 w-4" />
          </Button>
        )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(uploadedFile.id)}
                    disabled={uploadedFile.status === 'uploading'}
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && !canUploadMore && (
        <div className="text-center py-8 text-gray-500">
          <FileUp className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-sm">Maximum files reached</p>
        </div>
      )}

      {files.length === 0 && canUploadMore && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No files uploaded yet</p>
      </div>
      )}
    </div>
  );
} 