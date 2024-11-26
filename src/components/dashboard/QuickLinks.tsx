import { Users, FileSpreadsheet, Search, BarChart3, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface QuickLinksProps {
  onNavigate: (page: 'dashboard' | 'clients' | 'data-entry' | 'search' | 'validation' | 'grant-writing') => void;
}

const links = [
  {
    title: 'Client Management',
    icon: <Users className="h-8 w-8" />,
    page: 'clients' as const,
    description: 'Manage your client portfolio',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Data Entry',
    icon: <FileSpreadsheet className="h-8 w-8" />,
    page: 'data-entry' as const,
    description: 'Update client information',
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Advanced Search',
    icon: <Search className="h-8 w-8" />,
    page: 'search' as const,
    description: 'Search across all data',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Validation Dashboard',
    icon: <BarChart3 className="h-8 w-8" />,
    page: 'validation' as const,
    description: 'Check funding eligibility',
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Grant Writing',
    icon: <PenTool className="h-8 w-8" />,
    page: 'grant-writing' as const,
    description: 'Create and manage grant proposals',
    color: 'from-pink-500 to-pink-600'
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function QuickLinks({ onNavigate }: QuickLinksProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      {links.map((link, index) => (
        <motion.button
          key={link.title}
          variants={item}
          onClick={() => onNavigate(link.page)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative group flex flex-col items-center p-6",
            "bg-white dark:bg-gray-800 rounded-xl shadow-md",
            "transition-all duration-200 hover:shadow-lg",
            "overflow-hidden"
          )}
        >
          <motion.div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
              "bg-gradient-to-br",
              link.color
            )}
            initial={false}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
          />
          
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "p-4 rounded-full mb-4",
              "bg-gradient-to-br from-fundspoke-100 to-fundspoke-200",
              "dark:from-fundspoke-900 dark:to-fundspoke-800"
            )}
          >
            {link.icon}
          </motion.div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
            {link.title}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {link.description}
          </p>
        </motion.button>
      ))}
    </motion.div>
  );
}