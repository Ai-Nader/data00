import { useState } from 'react';
import { Calendar, Clock, Users, Tags, Save } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { TagInput } from '../ui/TagInput';

export function MeetingNotesForm() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    attendees: '',
    notes: '',
    tags: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Meeting notes submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meeting Title
        </label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter meeting title"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Time
          </label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            icon={<Clock className="h-4 w-4" />}
          />
        </div>
      </div>

      <div>
        <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Attendees
        </label>
        <Input
          id="attendees"
          type="text"
          value={formData.attendees}
          onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
          placeholder="Enter attendee names (comma separated)"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meeting Notes
        </label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Enter meeting notes"
          rows={8}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <TagInput
          value={formData.tags}
          onChange={(tags) => setFormData({ ...formData, tags })}
          placeholder="Add tags"
          icon={<Tags className="h-4 w-4" />}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" icon={<Save className="h-4 w-4" />}>
          Save Notes
        </Button>
      </div>
    </form>
  );
}