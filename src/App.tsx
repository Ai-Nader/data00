import { useState } from 'react';
import { Users, Clock, FileCheck } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MetricsCard } from './components/dashboard/MetricsCard';
import { ActivityFeed } from './components/dashboard/ActivityFeed';
import { QuickLinks } from './components/dashboard/QuickLinks';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { PerformanceChart } from './components/dashboard/PerformanceChart';
import { ClientManagement } from './pages/ClientManagement';
import { DataEntry } from './pages/DataEntry';
import { AdvancedSearch } from './pages/AdvancedSearch';
import { ValidationDashboard } from './pages/ValidationDashboard';
import { GrantWriting } from './pages/GrantWriting';
import { ChatInterface } from './components/chat/ChatInterface';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'clients' | 'data-entry' | 'chat' | 'search' | 'validation' | 'grant-writing'>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const metrics = [
    {
      title: 'Active Clients',
      value: '25',
      icon: <Users className="h-6 w-6 text-fundspoke-600 dark:text-fundspoke-400" />,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Pending Tasks',
      value: '8',
      icon: <Clock className="h-6 w-6 text-fundspoke-600 dark:text-fundspoke-400" />,
      trend: { value: 3, isPositive: false }
    },
    {
      title: 'Reports Due',
      value: '3',
      icon: <FileCheck className="h-6 w-6 text-fundspoke-600 dark:text-fundspoke-400" />,
      trend: { value: 2, isPositive: true }
    }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DashboardHeader />
            
            <div className="mb-8">
              <QuickLinks onNavigate={setCurrentPage} />
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
              {metrics.map((metric) => (
                <MetricsCard key={metric.title} {...metric} />
              ))}
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Performance Overview
                  </h2>
                  <PerformanceChart />
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <ActivityFeed />
              </div>
            </div>
          </div>
        );
      case 'clients':
        return <ClientManagement />;
      case 'data-entry':
        return <DataEntry />;
      case 'search':
        return <AdvancedSearch />;
      case 'validation':
        return <ValidationDashboard />;
      case 'grant-writing':
        return <GrantWriting />;
      case 'chat':
        return <ChatInterface />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
      />
      <main className="pt-16 pb-24">
        {renderPage()}
      </main>

      <Footer onNavigate={setCurrentPage} />

      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-full md:w-96 h-[600px] shadow-xl">
          <ChatInterface />
        </div>
      )}
    </div>
  );
}

export default App;