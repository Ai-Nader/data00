import { ReactNode, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '../../lib/utils';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export function MetricsCard({ title, value, icon, trend, delay = 0 }: MetricsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const numericValue = parseInt(value.toString(), 10);
    const duration = 1000; // Animation duration in milliseconds
    const steps = 30; // Number of steps in the animation
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const currentValue = Math.round(progress * numericValue);
      setDisplayValue(currentValue);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "p-3 rounded-xl",
                "bg-gradient-to-br from-fundspoke-100 to-fundspoke-200",
                "dark:from-fundspoke-900 dark:to-fundspoke-800"
              )}
            >
              {icon}
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="mt-1 text-3xl font-bold bg-gradient-to-r from-fundspoke-600 to-teal-dark bg-clip-text text-transparent">
                {displayValue}
              </p>
            </div>
          </div>
          
          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3 }}
              className={cn(
                "flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium",
                trend.isPositive
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              )}
            >
              <span>{trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%</span>
              <motion.div
                animate={{ y: trend.isPositive ? -2 : 2 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.5
                }}
              >
                {trend.isPositive ? '↑' : '↓'}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}