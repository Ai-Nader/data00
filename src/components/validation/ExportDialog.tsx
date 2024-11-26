import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, FileDown, Mail, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';
import { exportToPDF, exportToExcel } from '../../lib/exportUtils';

interface ExportDialogProps {
  clientName: string;
  validationScore: number;
  opportunities: any[];
  recommendations: any[];
}

export function ExportDialog({
  clientName,
  validationScore,
  opportunities,
  recommendations,
}: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    try {
      const data = {
        clientName,
        validationScore,
        opportunities,
        recommendations,
      };

      if (format === 'pdf') {
        await exportToPDF(data);
      } else {
        await exportToExcel(data);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
    setIsExporting(false);
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSharing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShareSuccess(true);
    setTimeout(() => {
      setIsOpen(false);
      setShareSuccess(false);
      setEmail('');
    }, 2000);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" icon={<FileDown className="h-4 w-4" />}>
          Export / Share
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
            Export Dashboard
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Export the dashboard as a report or share it with others.
          </Dialog.Description>

          <div className="mt-6 space-y-6">
            {/* Export Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Export Options
              </h3>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2" />
                  )}
                  Export as PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport('excel')}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2" />
                  )}
                  Export as Excel
                </Button>
              </div>
            </div>

            {/* Share Form */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Share Dashboard
              </h3>
              <form onSubmit={handleShare} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter recipient's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                  required
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSharing || !email}
                >
                  {isSharing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : shareSuccess ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  {shareSuccess ? 'Sent!' : 'Share Dashboard'}
                </Button>
              </form>
            </div>
          </div>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:ring-offset-gray-950 dark:focus:ring-gray-800 dark:data-[state=open]:bg-gray-800">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}