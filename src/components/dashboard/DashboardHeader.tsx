import { motion } from 'framer-motion';
import { Settings, ChevronDown, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function DashboardHeader() {
  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-center justify-between"
      >
        {/* User Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:space-x-4">
          {/* Generic Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="relative group"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg bg-gradient-to-br from-fundspoke-500 to-teal-dark flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm">View Profile</span>
              </div>
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
          </motion.div>

          {/* User Info */}
          <div className="mt-4 md:mt-0 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Nader Shalash
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400"
            >
              AI Solution Architect
            </motion.p>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 md:mt-0 flex items-center space-x-2"
        >
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg",
            "bg-white dark:bg-gray-800 shadow-sm",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            "border border-gray-200 dark:border-gray-700",
            "transition-colors"
          )}>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              My Dashboard
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-0 left-0 right-0 h-48 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-fundspoke-600/10 to-teal-dark/10 blur-3xl" />
      </motion.div>
    </div>
  );
}