import { useState } from 'react';
import { Menu, Search, MessageSquare, Sun, Moon, Home, Users, FileText, BarChart3, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Switch from '@radix-ui/react-switch';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

interface NavbarProps {
  currentPage: 'dashboard' | 'clients' | 'data-entry' | 'chat' | 'search' | 'validation' | 'grant-writing';
  onNavigate: (page: 'dashboard' | 'clients' | 'data-entry' | 'chat' | 'search' | 'validation' | 'grant-writing') => void;
  onToggleChat: () => void;
}

const navItems = [
  { name: 'Dashboard', id: 'dashboard' as const, icon: Home },
  { name: 'Client Management', id: 'clients' as const, icon: Users },
  { name: 'Data Entry', id: 'data-entry' as const, icon: FileText },
  { name: 'Validation', id: 'validation' as const, icon: BarChart3 },
  { name: 'Grant Writing', id: 'grant-writing' as const, icon: PenTool },
];

const MotionNav = motion(NavigationMenu.Root);

export function Navbar({ currentPage, onNavigate, onToggleChat }: NavbarProps) {
  const { isDark, setIsDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex flex-1">
            <div className="flex-shrink-0 flex items-center">
              <button 
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 ml-2 lg:ml-0"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-8 h-8 bg-gradient-to-br from-fundspoke-500 to-teal-dark rounded-lg flex items-center justify-center"
                >
                  <span className="text-white font-bold">F</span>
                </motion.div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-fundspoke-600 to-teal-dark bg-clip-text text-transparent">
                    Fundspoke
                  </span>
                  <span className="hidden lg:block text-xs text-gray-500 dark:text-gray-400">
                    Empowering Grant Management
                  </span>
                </div>
              </motion.div>
            </div>
            
            <MotionNav 
              className="hidden lg:ml-6 lg:flex lg:space-x-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <NavigationMenu.List className="flex space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenu.Item key={item.name}>
                      <motion.button
                        onClick={() => onNavigate(item.id)}
                        className={cn(
                          "inline-flex items-center px-1 pt-1 text-sm font-medium",
                          "relative group",
                          currentPage === item.id
                            ? "text-fundspoke-600 dark:text-fundspoke-400"
                            : "text-gray-700 dark:text-gray-200 hover:text-fundspoke-600 dark:hover:text-fundspoke-400"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                        {currentPage === item.id && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-fundspoke-600 dark:bg-fundspoke-400"
                            layoutId="underline"
                          />
                        )}
                      </motion.button>
                    </NavigationMenu.Item>
                  );
                })}
              </NavigationMenu.List>
            </MotionNav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <motion.button 
              onClick={() => onNavigate('search')}
              className={cn(
                "p-2 rounded-full transition-colors duration-200",
                "text-gray-600 dark:text-gray-300",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "hover:text-fundspoke-600 dark:hover:text-fundspoke-400",
                currentPage === 'search' && "text-fundspoke-600 dark:text-fundspoke-400"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Advanced Search"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            
            <motion.button 
              onClick={onToggleChat}
              className={cn(
                "p-2 rounded-full transition-colors duration-200",
                "text-gray-600 dark:text-gray-300",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "hover:text-fundspoke-600 dark:hover:text-fundspoke-400",
                currentPage === 'chat' && "text-fundspoke-600 dark:text-fundspoke-400"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Interactive Chat"
            >
              <MessageSquare className="h-5 w-5" />
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <Switch.Root
                checked={isDark}
                onCheckedChange={setIsDark}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors duration-200",
                  "bg-gray-200 dark:bg-gray-700",
                  "data-[state=checked]:bg-fundspoke-600"
                )}
              >
                <Switch.Thumb 
                  className={cn(
                    "block w-4 h-4 bg-white rounded-full shadow-lg",
                    "transition-transform duration-200",
                    "translate-x-1 data-[state=checked]:translate-x-6"
                  )} 
                />
              </Switch.Root>
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="lg:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  currentPage === item.id
                    ? "bg-fundspoke-100 text-fundspoke-600 dark:bg-fundspoke-900 dark:text-fundspoke-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.name}
              </button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}