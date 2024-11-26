import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, FileText, FileSpreadsheet, File } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { DataMapping } from './DataMapping';

interface UploadedFile extends File {
  id: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface FileUploadProps {
  clientId: string;
  onUploadComplete?: (files: File[]) => void;
}

const acceptedFileTypes = {
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/csv': ['.csv'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const getFileIcon = (type: string = '') => {
  if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) {
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  }
  if (type.includes('word')) return <FileText className="h-5 w-5 text-blue-500" />;
  return <File className="h-5 w-5 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileUpload({ clientId, onUploadComplete }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [mappingFile, setMappingFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Check if any of the files are structured data files
    const structuredFile = acceptedFiles.find(file => 
      file.type?.includes('sheet') || 
      file.type?.includes('csv') ||
      file.name.toLowerCase().endsWith('.csv')
    );

    if (structuredFile) {
      setMappingFile(structuredFile);
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      status: 'uploading' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload for each file
    newFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, progress } 
              : f
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          setFiles(prev =>
            prev.map(f =>
              f.id === file.id
                ? { ...f, status: 'success' as const }
                : f
            )
          );

          // Check if all files are uploaded
          const allUploaded = files.every(f => f.status === 'success');
          if (allUploaded) {
            setNotification({
              type: 'success',
              message: 'All files uploaded successfully'
            });
            onUploadComplete?.(acceptedFiles);
          }
        }
      }, 500);
    });
  }, [files, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleMappingComplete = (mappedData: any[]) => {
    console.log('Mapped data:', mappedData);
    setMappingFile(null);
    setNotification({
      type: 'success',
      message: 'Data mapping completed successfully'
    });
  };

  const handleMappingCancel = () => {
    setMappingFile(null);
  };

  return (
    <div className="space-y-6">
      {mappingFile ? (
        <DataMapping
          file={mappingFile}
          onComplete={handleMappingComplete}
          onCancel={handleMappingCancel}
        />
      ) : (
        <>
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-200",
              isDragActive
                ? "border-fundspoke-500 bg-fundspoke-50 dark:bg-fundspoke-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-fundspoke-500"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isDragActive ? (
                "Drop the files here"
              ) : (
                "Drag and drop files here, or click to select files"
              )}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: CSV, Excel, PDF, Word (up to 50MB each)
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Uploaded Files
              </h3>
              <ul className="space-y-3">
                {files.map((file) => (
                  <motion.li
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {file.status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : file.status === 'error' ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-fundspoke-500 border-t-transparent rounded-full animate-spin" />
                        )}
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.type)}
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.name}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {file.status === 'success'
                            ? 'Completed'
                            : file.status === 'error'
                            ? 'Failed'
                            : `${file.progress}%`}
                        </span>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {file.status === 'uploading' && (
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-fundspoke-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                    {file.error && (
                      <p className="mt-2 text-sm text-red-500">
                        {file.error}
                      </p>
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {files.length > 0 && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                className="mr-3"
                onClick={() => setFiles([])}
              >
                Clear All
              </Button>
              <Button
                type="button"
                disabled={files.some((f) => f.status === 'uploading')}
              >
                Process Files
              </Button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-4 right-4 max-w-sm w-full rounded-lg shadow-lg p-4",
              "flex items-center justify-between",
              notification.type === 'success'
                ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-200"
                : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900 dark:text-red-200"
            )}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}