import React from 'react';
import { useData } from '../context/DataContext';
import { FileText, Package, AlertCircle, TrendingUp, Clock } from 'lucide-react';

function StatsCards() {
  const { stats, loading, lastSync } = useData();

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const cards = [
    {
      title: 'Documentation',
      value: stats.totalDocs,
      icon: FileText,
      color: 'blue',
      description: 'Flutter docs pages',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Packages',
      value: stats.totalPackages,
      icon: Package,
      color: 'green',
      description: 'Pub.dev packages',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'GitHub Issues',
      value: stats.totalIssues,
      icon: AlertCircle,
      color: 'orange',
      description: 'Community issues',
      trend: '+3%',
      trendUp: true,
    },
    {
      title: 'Last Sync',
      value: formatLastSync(lastSync),
      icon: Clock,
      color: 'purple',
      description: 'Data updated',
      trend: 'Live',
      trendUp: true,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100',
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        iconBg: 'bg-green-100',
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        iconBg: 'bg-orange-100',
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        iconBg: 'bg-purple-100',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);
        return (
          <div
            key={index}
            className={`${colors.bg} rounded-xl p-6 border border-gray-200 card-hover`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {loading.docs || loading.packages || loading.issues ? (
                    <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
                  ) : (
                    card.value
                  )}
                </p>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
              <div className={`${colors.iconBg} p-3 rounded-lg`}>
                <card.icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;
