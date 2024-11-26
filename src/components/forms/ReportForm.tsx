import { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

const reportTypes = [
  { value: 'performance', label: 'Performance Report' },
  { value: 'financial', label: 'Financial Statement' },
  { value: 'investment', label: 'Investment Summary' },
  { value: 'tax', label: 'Tax Document' },
];

export function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    file: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Report form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Report Title
        </label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter report title"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Report Type
        </label>
        <Select
          id="type"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value })}
          options={reportTypes}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter report description"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload Report
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="report-upload"
                className="relative cursor-pointer rounded-md font-medium text-fundspoke-600 hover:text-fundspoke-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-fundspoke-500"
              >
                <span>Upload a file</span>
                <input
                  id="report-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, file });
                  }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF, XLSX, CSV up to 50MB
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" icon={<Upload className="h-4 w-4" />}>
          Upload Report
        </Button>
      </div>
    </form>
  );
}