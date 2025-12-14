import React, { useState, useCallback } from 'react';
import { uploadFile, getPublicUrl } from '../lib/supabase';

interface FileUploadProps {
  bucket: string;
  path: string;
  allowedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
  onUploadComplete: (urls: string[]) => void;
  onError: (error: string) => void;
}

export function FileUpload({
  bucket,
  path,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSize = 50 * 1024 * 1024, // 50MB default
  multiple = false,
  onUploadComplete,
  onError,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type for ${file.name}. Allowed types: ${allowedTypes.join(', ')}`;
    }
    if (file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size: ${maxSize / 1024 / 1024}MB`;
    }
    return null;
  }, [allowedTypes, maxSize]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Reset previous errors
    setUploadError(null);
    
    // Validate all files first
    const errors = files.map(validateFile).filter(Boolean);
    if (errors.length > 0) {
      const errorMessage = errors.join('\n');
      setUploadError(errorMessage);
      onError(errorMessage);
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      await Promise.all(
        files.map(async (file) => {
          const { data, error } = await uploadFile(
            bucket,
            path,
            file,
            (progress) => {
              setProgress(prev => ({
                ...prev,
                [file.name]: progress
              }));
            }
          );

          if (error) throw error;
          if (!data) throw new Error(`Upload failed for ${file.name}`);

          const url = getPublicUrl(bucket, data.path);
          uploadedUrls.push(url);
        })
      );

      onUploadComplete(uploadedUrls);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      onError(errorMessage);
    } finally {
      setUploading(false);
      // Keep progress visible for a moment to show completion
      setTimeout(() => {
        setProgress({});
      }, 2000);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <label className="block">
          <span className="sr-only">Choose file{multiple ? 's' : ''}</span>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-primary-300 border-dashed rounded-lg cursor-pointer bg-primary-50 hover:bg-primary-100 transition-all duration-300">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-primary-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-primary-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-primary-600">
                  {multiple ? 'Upload multiple files' : 'Upload a file'} (Max size: {maxSize / 1024 / 1024}MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={allowedTypes.join(',')}
                multiple={multiple}
                disabled={uploading}
              />
            </label>
          </div>
        </label>

        {uploading && Object.entries(progress).map(([fileName, value]) => (
          <div key={fileName} className="mt-4">
            <div className="flex justify-between text-sm text-primary-700 mb-1">
              <span className="truncate">{fileName}</span>
              <span>{Math.round(value)}%</span>
            </div>
            <div className="w-full bg-primary-100 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Error message display */}
      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-red-700 font-medium">Upload Error</span>
          </div>
          <p className="mt-2 text-red-600 text-sm whitespace-pre-line">{uploadError}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-primary-700">
        <p>
          {multiple ? 'Drop files here or click to upload' : 'Drop a file here or click to upload'}
        </p>
        <p className="text-xs text-primary-600 mt-1">
          Supported formats: {allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
        </p>
      </div>
    </div>
  );
}
