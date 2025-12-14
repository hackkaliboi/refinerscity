import React, { useEffect, useState } from 'react';
import { listFiles, deleteFile, getPublicUrl } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type MediaFile = Database['public']['Tables']['media_files']['Row'];

export function FileGallery() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'created_at' | 'size' | 'name'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadFiles();
  }, [sortBy, sortOrder, search]);

  const loadFiles = async () => {
    try {
      const { data, error } = await listFiles('media', {
        sortBy,
        order: sortOrder,
        search,
      });
      if (error) throw error;
      setFiles(data || []);
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, path: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error } = await deleteFile('media', path);
      if (error) throw error;
      setFiles(files.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-primary-700">Loading files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full transition-all duration-300"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 rounded-lg border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
        >
          <option value="created_at">Date</option>
          <option value="size">Size</option>
          <option value="name">Name</option>
        </select>
        <button
          onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
          className="px-4 py-2 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map((file) => (
          <div key={file.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-primary-100">
            {/* Preview */}
            <div className="aspect-w-16 aspect-h-9 bg-primary-50">
              {file.mime_type.startsWith('image/') ? (
                <img
                  src={getPublicUrl('media', file.path)}
                  alt={file.title || file.path}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-4">
                    <svg className="w-12 h-12 mx-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="mt-2 text-primary-600 text-sm">
                      {file.mime_type.split('/')[1].toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="p-4">
              <h3 className="font-medium text-primary-800 truncate" title={file.title || file.path}>
                {file.title || file.path.split('/').pop()}
              </h3>
              <div className="mt-2 text-sm text-primary-600">
                <p>{formatFileSize(file.size)}</p>
                <p>{formatDate(file.created_at)}</p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end gap-2">
                <a
                  href={getPublicUrl('media', file.path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm rounded-md bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(file.id, file.path)}
                  className="px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-primary-800">No files found</h3>
          <p className="mt-1 text-primary-600">Upload some files to get started!</p>
        </div>
      )}
    </div>
  );
}