import { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/utils';

export type SectionStatus = 'complete' | 'incomplete' | 'in-progress';

interface SectionWrapperProps {
  title: string;
  icon: React.ReactNode;
  status: SectionStatus;
  isExpanded: boolean;
  onToggle: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onNext?: () => void;
  supportingDocs?: boolean;
  children: React.ReactNode;
  colorTheme?: 'emerald' | 'sky' | 'lavender';
}

const colorThemes = {
  emerald: {
    bg: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  sky: {
    bg: 'from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20',
    border: 'border-sky-200 dark:border-sky-800',
    icon: 'text-sky-600 dark:text-sky-400',
  },
  lavender: {
    bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
  },
};

export function SectionWrapper({
  title,
  icon,
  status,
  isExpanded,
  onToggle,
  isEditing,
  onEdit,
  onSave,
  onNext,
  supportingDocs,
  children,
  colorTheme = 'emerald',
}: SectionWrapperProps) {
  const [isUploading, setIsUploading] = useState(false);
  const theme = colorThemes[colorTheme];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUploading(false);
    event.target.value = '';
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-5 w-5 text-green-500" />
          </motion.div>
        );
      case 'incomplete':
        return (
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
          </motion.div>
        );
      case 'in-progress':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="h-5 w-5 text-yellow-500" />
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "bg-gradient-to-br rounded-lg shadow-sm border overflow-hidden",
        theme.bg,
        theme.border
      )}
    >
      <motion.button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "p-2 rounded-lg",
              theme.icon
            )}
          >
            {icon}
          </motion.div>
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                status === 'complete' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                status === 'incomplete' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                status === 'in-progress' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              )}
            >
              {getStatusIcon()}
              <span className="ml-1">{status}</span>
            </motion.span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end space-x-3 mb-6">
                {supportingDocs && (
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="sr-only"
                      multiple
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <motion.label
                      htmlFor="file-upload"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium",
                        "cursor-pointer transition-colors duration-200",
                        isUploading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700",
                        theme.border
                      )}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Documents'}
                    </motion.label>
                  </div>
                )}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {isEditing ? (
                    <Button onClick={onSave} variant="primary">Save Changes</Button>
                  ) : (
                    <Button onClick={onEdit} variant="outline">Edit Information</Button>
                  )}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>

              {onNext && (
                <motion.div
                  className="mt-6 flex justify-end"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={onNext}
                    variant="outline"
                    className="group"
                  >
                    Next Section
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}