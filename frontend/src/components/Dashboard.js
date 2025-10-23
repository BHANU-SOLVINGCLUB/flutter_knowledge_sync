import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import StatsCards from './StatsCards';
import DocsTable from './DocsTable';
import PackagesTable from './PackagesTable';
import IssuesTable from './IssuesTable';
import SearchResults from './SearchResults';
import SyncStatus from './SyncStatus';
import { FileText, Package, AlertCircle, Search, TrendingUp, Clock } from 'lucide-react';

function Dashboard({ tab = 'overview' }) {
  const { error } = useData();
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'docs', name: 'Documentation', icon: FileText },
    { id: 'packages', name: 'Packages', icon: Package },
    { id: 'issues', name: 'GitHub Issues', icon: AlertCircle },
    { id: 'search', name: 'Search', icon: Search },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SyncStatus />
              <RecentActivity />
            </div>
          </div>
        );
      case 'docs':
        return <DocsTable />;
      case 'packages':
        return <PackagesTable />;
      case 'issues':
        return <IssuesTable />;
      case 'search':
        return <SearchResults />;
      default:
        return <StatsCards />;
    }
  };

  return (
    <div className="pt-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Flutter Knowledge Dashboard
        </h1>
        <p className="text-gray-600">
          Manage and explore Flutter documentation, packages, and community insights
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon
                    className={`mr-2 w-4 h-4 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity() {
  const { lastSync } = useData();
  
  const activities = [
    {
      id: 1,
      type: 'sync',
      message: 'Data synchronization completed',
      timestamp: lastSync,
      icon: Clock,
    },
    {
      id: 2,
      type: 'docs',
      message: '4 Flutter documentation pages updated',
      timestamp: lastSync,
      icon: FileText,
    },
    {
      id: 3,
      type: 'packages',
      message: '10 packages fetched from pub.dev',
      timestamp: lastSync,
      icon: Package,
    },
  ];

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <activity.icon className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.message}</p>
              <p className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
