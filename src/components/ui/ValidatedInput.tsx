import { useState, useEffect, useRef } from 'react';
import { Check, AlertCircle, HelpCircle } from 'lucide-react';
import { Input } from './Input';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean) => void;
  validate?: (value: string) => { isValid: boolean; error?: string };
  format?: (value: string) => string;
  icon?: React.ReactNode;
  suggestions?: string[];
  description?: string;
  required?: boolean;
  delay?: number;
}

export function ValidatedInput({
  label,
  value,
  onChange,
  onValidation,
  validate,
  format,
  icon,
  suggestions,
  description,
  required,
  delay = 0,
  className,
  ...props
}: ValidatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [validation, setValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (suggestions && value) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [value, suggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (format) {
      newValue = format(newValue);
    }
    onChange(newValue);
    setIsDirty(true);

    if (validate) {
      const result = validate(newValue);
      setValidation(result);
      onValidation?.(result.isValid);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setShowSuggestions(false);
    setIsDirty(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (suggestions && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="flex items-center justify-between mb-1">
        <motion.label
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: delay + 0.1 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
        {description && (
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <motion.button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HelpCircle className="h-4 w-4" />
                </motion.button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm text-gray-700 dark:text-gray-300 max-w-xs"
                  sideOffset={5}
                >
                  {description}
                  <Tooltip.Arrow className="fill-white dark:fill-gray-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}
      </div>

      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          icon={icon}
          className={cn(
            "transition-all duration-200",
            validation.isValid ? "border-gray-300" : "border-red-500",
            isFocused && "ring-2 ring-fundspoke-500 transform scale-[1.02]",
            className
          )}
          {...props}
        />

        <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {validation.isValid ? (
                <motion.div
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {validation.error && isDirty && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-red-500"
          >
            {validation.error}
          </motion.p>
        )}

        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700",
                  index === 0 && "rounded-t-lg",
                  index === filteredSuggestions.length - 1 && "rounded-b-lg"
                )}
                onClick={() => selectSuggestion(suggestion)}
                whileHover={{ x: 5 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}