import { useState, useCallback } from 'react';
import { File, Upload, Search, Filter, FileText, FileSpreadsheet, FileImage, Folder, Trash2, Download, Eye, AlertCircle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { SectionWrapper } from './SectionWrapper';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Select } from '../../ui/Select';
import { cn } from '../../../lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

interface FileCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  required?: boolean;
}

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadDate: Date;
  url?: string;
}

const fileCategories: FileCategory[] = [
  { 
    id: 'incorporation',
    name: 'Articles of Incorporation',
    icon: <FileText className="h-5 w-5" />,
    description: 'Legal documents of incorporation',
    required: true
  },
  {
    id: 'financial',
    name: 'Financial Statements',
    icon: <FileSpreadsheet className="h-5 w-5" />,
    description: 'Annual financial reports and statements',
    required: true
  },
  {
    id: 'pitch',
    name: 'Pitch Decks',
    icon: <FileImage className="h-5 w-5" />,
    description: 'Sales presentations and pitch materials'
  },
  {
    id: 'case-studies',
    name: 'Case Studies',
    icon: <FileText className="h-5 w-5" />,
    description: 'Client success stories and case studies'
  },
  {
    id: 'technical',
    name: 'Technical Sheets',
    icon: <FileText className="h-5 w-5" />,
    description: 'Product specifications and technical documentation'
  },
  {
    id: 'resumes',
    name: 'CVs/Resumes',
    icon: <FileText className="h-5 w-5" />,
    description: 'Team member resumes and CVs'
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    icon: <Folder className="h-5 w-5" />,
    description: 'Other company documents'
  }
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
  if (type.includes('sheet') || type.includes('excel')) return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  if (type.includes('word')) return <FileText className="h-5 w-5 text-blue-500" />;
  if (type.includes('image')) return <FileImage className="h-5 w-5 text-purple-500" />;
  return <File className="h-5 w-5 text-gray-500" />;
};

interface CompanyFilesSectionProps {
  clientId: string;
  onSave?: () => void;
}

export function CompanyFilesSection({ clientId, onSave }: CompanyFilesSectionProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['incorporation']));
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const fileId = Math.random().toString(36).substring(7);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        
        if (progress >= 100) {
          clearInterval(interval);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });

          // Add file to list
          setFiles(prev => [...prev, {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            category: 'misc',
            uploadDate: new Date(),
          }]);

          setNotification({
            type: 'success',
            message: `${file.name} uploaded successfully`
          });
          setTimeout(() => setNotification(null), 3000);
        }
      }, 200);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setNotification({
      type: 'success',
      message: 'File deleted successfully'
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
    const matchesType = typeFilter === 'all' || file.type.includes(typeFilter);
    
    if (dateFilter === 'all') return matchesSearch && matchesCategory && matchesType;
    
    const fileDate = file.uploadDate;
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (dateFilter) {
      case 'today':
        return daysDiff === 0 && matchesSearch && matchesCategory && matchesType;
      case 'week':
        return daysDiff <= 7 && matchesSearch && matchesCategory && matchesType;
      case 'month':
        return daysDiff <= 30 && matchesSearch && matchesCategory && matchesType;
      default:
        return matchesSearch && matchesCategory && matchesType;
    }
  });

  const getSectionStatus = () => {
    const requiredCategories = fileCategories.filter(c => c.required);
    const hasAllRequired = requiredCategories.every(category =>
      files.some(file => file.category === category.id)
    );
    
    if (files.length === 0) return 'incomplete';
    if (hasAllRequired) return 'complete';
    return 'in-progress';
  };

  return (
    <SectionWrapper
      title="Company General Files"
      icon={<Folder className="h-5 w-5" />}
      status={getSectionStatus()}
      isExpanded={true}
      onToggle={() => {}}
      isEditing={true}
      onEdit={() => {}}
      onSave={onSave}
      colorTheme="sky"
    >
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Button
            variant="outline"
            {...getRootProps()}
            icon={<Upload className="h-4 w-4" />}
          >
            Upload Files
            <input {...getInputProps()} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: 'all', label: 'All Categories' },
              ...fileCategories.map(cat => ({
                value: cat.id,
                label: cat.name
              }))
            ]}
          />

          <Select
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { value: 'all', label: 'All Dates' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' }
            ]}
          />

          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'pdf', label: 'PDF Files' },
              { value: 'word', label: 'Word Documents' },
              { value: 'sheet', label: 'Spreadsheets' },
              { value: 'image', label: 'Images' }
            ]}
          />
        </div>
      </div>

      {/* File Categories */}
      <div className="space-y-4">
        {fileCategories.map((category) => (
          <div
            key={category.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-center space-x-3">
                {category.icon}
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                    {category.required && (
                      <span className="ml-2 text-xs text-red-500">*Required</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {files.filter(f => f.category === category.id).length} files
                </span>
                {expandedCategories.has(category.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {expandedCategories.has(category.id) && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {files.filter(f => f.category === category.id).length > 0 ? (
                      <div className="space-y-2">
                        {files
                          .filter(f => f.category === category.id)
                          .map((file) => (
                            <motion.div
                              key={file.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                {getFileIcon(file.type)}
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatFileSize(file.size)} • Uploaded {file.uploadDate.toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Tooltip.Provider>
                                  <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle view
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                      <Tooltip.Content
                                        className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm"
                                        sideOffset={5}
                                      >
                                        View file
                                        <Tooltip.Arrow className="fill-white dark:fill-gray-800" />
                                      </Tooltip.Content>
                                    </Tooltip.Portal>
                                  </Tooltip.Root>
                                </Tooltip.Provider>

                                <Tooltip.Provider>
                                  <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle download
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                      >
                                        <Download className="h-4 w-4" />
                                      </button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                      <Tooltip.Content
                                        className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm"
                                        sideOffset={5}
                                      >
                                        Download file
                                        <Tooltip.Arrow className="fill-white dark:fill-gray-800" />
                                      </Tooltip.Content>
                                    </Tooltip.Portal>
                                  </Tooltip.Root>
                                </Tooltip.Provider>

                                <Tooltip.Provider>
                                  <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteFile(file.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                      <Tooltip.Content
                                        className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm"
                                        sideOffset={5}
                                      >
                                        Delete file
                                        <Tooltip.Arrow className="fill-white dark:fill-gray-800" />
                                      </Tooltip.Content>
                                    </Tooltip.Portal>
                                  </Tooltip.Root>
                                </Tooltip.Provider>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No files uploaded yet
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {Object.keys(uploadProgress).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Uploading Files...
            </h4>
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="text-gray-900 dark:text-white">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-fundspoke-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-4 right-4 max-w-sm w-full rounded-lg shadow-lg p-4",
              "border flex items-center justify-between",
              notification.type === 'success'
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900"
            )}
          >
            <div className="flex items-center space-x-3">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <p className={cn(
                "text-sm font-medium",
                notification.type === 'success'
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              )}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}</content></file>
<boltAction type="start">
<command>npm run dev</command>