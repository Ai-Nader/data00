import { ExternalLink, Mail, Phone, Building2, Calendar, Hash, MapPin, Users, DollarSign, User, Globe, Linkedin, Twitter, Facebook, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { cn } from '../../lib/utils';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface ClientSummaryProps {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  companyName?: string;
  revenue?: {
    year2022: string;
    year2023: string;
    year2024: string;
  };
  employees?: {
    fullTime: string;
    partTime: string;
    contractors: string;
  };
}

interface SummaryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onRefresh?: () => void;
}

function SummaryCard({ title, description, icon, children, onRefresh }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-fundspoke-100 dark:bg-fundspoke-900 rounded-lg">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>
          {onRefresh && (
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-fundspoke-500 dark:text-gray-500 dark:hover:text-fundspoke-400"
            >
              <RefreshCw className="h-5 w-5" />
            </motion.button>
          )}
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function ContactInfo({ label, value, icon, href }: { label: string; value: string; icon: React.ReactNode; href?: string }) {
  return (
    <div className="flex items-center space-x-3 py-2">
      <div className="text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      <div className="flex-1">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}:</span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-fundspoke-600 dark:text-fundspoke-400 hover:underline"
          >
            {value}
          </a>
        ) : (
          <span className="ml-2 text-gray-900 dark:text-white">{value}</span>
        )}
      </div>
    </div>
  );
}

export function ClientSummary({
  name,
  email,
  phone,
  linkedin,
  twitter,
  facebook,
  website,
  companyName,
  revenue,
  employees,
}: ClientSummaryProps) {
  const getTotalEmployees = () => {
    if (!employees) return 0;
    return Object.values(employees).reduce((sum, count) => sum + (parseInt(count) || 0), 0);
  };

  const formatCurrency = (value: string) => {
    const num = parseInt(value);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const employeeChartData = {
    labels: ['Full-Time', 'Part-Time', 'Contractors'],
    datasets: [{
      data: [
        parseInt(employees?.fullTime || '0'),
        parseInt(employees?.partTime || '0'),
        parseInt(employees?.contractors || '0'),
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(168, 85, 247, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const revenueChartData = {
    labels: ['2022', '2023', '2024 (Projected)'],
    datasets: [{
      label: 'Revenue',
      data: [
        parseInt(revenue?.year2022 || '0'),
        parseInt(revenue?.year2023 || '0'),
        parseInt(revenue?.year2024 || '0'),
      ],
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            if (context.chart.canvas.id === 'revenue-chart') {
              return formatCurrency(value.toString());
            }
            return `${value} employees (${((value / getTotalEmployees()) * 100).toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <TooltipPrimitive.Provider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Details */}
        <SummaryCard
          title="Contact Details"
          description="Primary contact information"
          icon={<User className="h-6 w-6 text-fundspoke-600 dark:text-fundspoke-400" />}
        >
          <div className="space-y-1">
            {name && <ContactInfo label="Name" value={name} icon={<User className="h-5 w-5" />} />}
            {companyName && <ContactInfo label="Company" value={companyName} icon={<Building2 className="h-5 w-5" />} />}
            {email && <ContactInfo label="Email" value={email} icon={<Mail className="h-5 w-5" />} href={`mailto:${email}`} />}
            {phone && <ContactInfo label="Phone" value={phone} icon={<Phone className="h-5 w-5" />} href={`tel:${phone}`} />}
          </div>
        </SummaryCard>

        {/* Online Presence */}
        <SummaryCard
          title="Online Presence"
          description="Digital footprint and social media"
          icon={<Globe className="h-6 w-6 text-fundspoke-600 dark:text-fundspoke-400" />}
        >
          <div className="space-y-1">
            {website && <ContactInfo label="Website" value={website} icon={<Globe className="h-5 w-5" />} href={website} />}
            {linkedin && <ContactInfo label="LinkedIn" value={linkedin} icon={<Linkedin className="h-5 w-5" />} href={linkedin} />}
            {twitter && <ContactInfo label="Twitter" value={twitter} icon={<Twitter className="h-5 w-5" />} href={twitter} />}
            {facebook && <ContactInfo label="Facebook" value={facebook} icon={<Facebook className="h-5 w-5" />} href={facebook} />}
            {!website && !linkedin && !twitter && !facebook && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No online presence data available
              </p>
            )}
          </div>
        </SummaryCard>

        {/* Workforce Distribution */}
        <SummaryCard
          title="Workforce Distribution"
          description="Employee breakdown by type"
          icon={<Users className="h-6 w-6 text-fundspoke-600 dark:text-fundspoke-400" />}
          onRefresh={() => {}}
        >
          {employees ? (
            <>
              <div className="h-64">
                <Doughnut data={employeeChartData} options={chartOptions} />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Workforce: <span className="font-medium text-gray-900 dark:text-white">{getTotalEmployees()} employees</span>
                </p>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No workforce data available
              </p>
            </div>
          )}
        </SummaryCard>

        {/* Revenue Trends */}
        <SummaryCard
          title="Revenue Trends"
          description="Annual revenue analysis"
          icon={<DollarSign className="h-6 w-6 text-fundspoke-600 dark:text-fundspoke-400" />}
          onRefresh={() => {}}
        >
          {revenue ? (
            <div className="h-64">
              <Line 
                data={revenueChartData} 
                options={chartOptions}
                id="revenue-chart"
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No revenue data available
              </p>
            </div>
          )}
        </SummaryCard>
      </div>
    </TooltipPrimitive.Provider>
  );
}