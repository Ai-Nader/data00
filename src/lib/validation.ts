import { z } from 'zod';

// Basic validation schemas
export const emailSchema = z.string().email('Invalid email format');
export const phoneSchema = z.string().regex(/^\+?1?\d{10,}$/, 'Invalid phone number');
export const urlSchema = z.string().url('Invalid URL format');
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');
export const numberSchema = z.string().regex(/^\d+$/, 'Must be a number');

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, 'Invalid postal code format (A1A 1A1)'),
});

// Company validation schema
export const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  legalName: z.string().min(1, 'Legal name is required'),
  incorporationDate: dateSchema,
  corporationNumber: z.string().min(1, 'Corporation number is required'),
  businessNumber: z.string().regex(/^\d{9}$/, 'Business number must be 9 digits'),
  legalAddress: addressSchema,
  businessAddress: addressSchema,
});

// Revenue validation schema
export const revenueSchema = z.object({
  year2022: numberSchema,
  year2023: numberSchema,
  year2024: numberSchema,
});

// Employees validation schema
export const employeesSchema = z.object({
  fullTime: numberSchema,
  partTime: numberSchema,
  contractors: numberSchema,
});

// Contact validation schema
export const contactSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactPosition: z.string().min(1, 'Position is required'),
  contactEmail: emailSchema,
  contactPhone: phoneSchema,
  contactLinkedin: urlSchema.optional(),
});

// Online presence validation schema
export const onlinePresenceSchema = z.object({
  website: urlSchema.optional(),
  linkedin: urlSchema.optional(),
  twitter: urlSchema.optional(),
  facebook: urlSchema.optional(),
});

// Field descriptions for tooltips and help text
export const fieldDescriptions = {
  company: {
    name: 'Legal registered name of the company',
    incorporationDate: 'Date when the company was officially incorporated',
    corporationNumber: 'Official corporation registration number',
    businessNumber: '9-digit CRA business number',
  },
  address: {
    street: 'Street address including unit/suite number if applicable',
    province: 'Province or territory',
    postalCode: 'Canadian postal code in A1A 1A1 format',
  },
  revenue: 'Annual revenue in CAD (numbers only)',
  employees: {
    fullTime: 'Number of full-time employees (35+ hours/week)',
    partTime: 'Number of part-time employees (<35 hours/week)',
    contractors: 'Number of independent contractors',
  },
  contact: {
    name: 'Full name of primary contact person',
    position: 'Job title or position in the company',
    email: 'Professional email address',
    phone: 'Business phone number',
    linkedin: 'LinkedIn profile URL',
  },
  online: {
    website: 'Company website URL',
    linkedin: 'Company LinkedIn page URL',
    twitter: 'Company Twitter profile URL',
    facebook: 'Company Facebook page URL',
  },
};

// Value formatters
export const formatters = {
  phone: (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  },
  postalCode: (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  },
  corporationNumber: (value: string) => value.replace(/[^0-9]/g, ''),
  businessNumber: (value: string) => value.replace(/[^0-9]/g, ''),
  currency: (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(parseInt(number) || 0);
  },
};

// Validation error interface
export interface ValidationError {
  row: number;
  column: string;
  value: string;
  error: string;
}

// Field validation function
export function validateField(schema: z.ZodType<any>, value: any): { isValid: boolean; error?: string } {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid value' };
  }
}

// Row validation function
export function validateRow(row: Record<string, any>, mappings: Record<string, string>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  Object.entries(mappings).forEach(([sourceColumn, targetField]) => {
    if (!targetField) return;
    
    const value = row[sourceColumn];
    const schema = getSchemaForField(targetField);
    if (!schema) return;
    
    const validation = validateField(schema, value);
    if (!validation.isValid) {
      errors.push({
        row: 0,
        column: sourceColumn,
        value: value,
        error: validation.error || 'Invalid value',
      });
    }
  });

  return errors;
}

// Dataset validation function
export function validateDataset(
  data: Record<string, any>[],
  mappings: Record<string, string>
): ValidationError[] {
  return data.flatMap((row, index) => 
    validateRow(row, mappings).map(error => ({
      ...error,
      row: index + 1,
    }))
  );
}

// Helper function to get schema for a field
function getSchemaForField(field: string): z.ZodType<any> | null {
  switch (field) {
    case 'email':
      return emailSchema;
    case 'phone':
      return phoneSchema;
    case 'website':
    case 'linkedin':
    case 'twitter':
    case 'facebook':
      return urlSchema;
    case 'incorporationDate':
      return dateSchema;
    case 'revenue':
    case 'employeeCount':
      return numberSchema;
    default:
      return z.string().min(1, 'Field is required');
  }
}

// Generate error report in CSV format
export function generateErrorReport(errors: ValidationError[]): string {
  const header = 'Row,Column,Value,Error\n';
  const rows = errors.map(error => 
    `${error.row},"${error.column}","${error.value}","${error.error}"`
  ).join('\n');
  
  return header + rows;
}

// Format error summary for display
export function formatErrorSummary(errors: ValidationError[]): string {
  if (errors.length === 0) return 'No validation errors found.';

  const summary = errors.reduce((acc, error) => {
    const key = `Row ${error.row}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(`${error.column}: ${error.error}`);
    return acc;
  }, {} as Record<string, string[]>);

  return Object.entries(summary)
    .map(([row, errors]) => `${row}:\n  - ${errors.join('\n  - ')}`)
    .join('\n\n');
}