import { Activity, Mail, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const activities = [
  {
    id: 1,
    type: 'email',
    content: 'New email added for Client A',
    timestamp: '10 minutes ago',
    icon: <Mail className="h-4 w-4" />
  },
  {
    id: 2,
    type: 'meeting',
    content: 'Meeting scheduled with Client B',
    timestamp: '1 hour ago',
    icon: <Calendar className="h-4 w-4" />
  },
  {
    id: 3,
    type: 'document',
    content: 'Report uploaded for Client C',
    timestamp: '2 hours ago',
    icon: <FileText className="h-4 w-4" />
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
    >
      <div className="flex items-center mb-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Activity className="h-5 w-5 text-fundspoke-600 dark:text-fundspoke-400" />
        </motion.div>
        <h2 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
          Recent Activity
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flow-root"
      >
        <ul className="-mb-8">
          {activities.map((activity, idx) => (
            <motion.li
              key={activity.id}
              variants={item}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative pb-8">
                {idx !== activities.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div className="flex items-center">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className="h-8 w-8 rounded-full bg-fundspoke-100 dark:bg-fundspoke-900 flex items-center justify-center ring-8 ring-white dark:ring-gray-800"
                    >
                      {activity.icon}
                    </motion.span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {activity.content}
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}