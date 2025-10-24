import React from 'react';
import { useData } from '../context/DataContext';
import { BookOpen, Package, AlertCircle, TrendingUp } from 'lucide-react';

function Dashboard() {
  const { stats, loading } = useData();

  const statCards = [
    {
      title: 'Documentation',
      value: stats.total_docs,
      icon: BookOpen,
      color: '#3b82f6',
      description: 'Flutter documentation entries'
    },
    {
      title: 'Packages',
      value: stats.total_packages,
      icon: Package,
      color: '#10b981',
      description: 'Pub.dev packages'
    },
    {
      title: 'Issues',
      value: stats.total_issues,
      icon: AlertCircle,
      color: '#f59e0b',
      description: 'GitHub issues'
    },
    {
      title: 'Total Resources',
      value: stats.total_docs + stats.total_packages + stats.total_issues,
      icon: TrendingUp,
      color: '#8b5cf6',
      description: 'All Flutter resources'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Flutter Knowledge Dashboard</h1>
        <p className="dashboard-subtitle">
          Explore comprehensive Flutter documentation, packages, and community resources
          in one centralized platform.
        </p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="stat-card">
              <div 
                className="stat-icon"
                style={{ backgroundColor: `${card.color}20`, color: card.color }}
              >
                <Icon size={24} />
              </div>
              <div className="stat-number">
                {loading.stats ? (
                  <div className="loading-spinner" />
                ) : (
                  card.value.toLocaleString()
                )}
              </div>
              <div className="stat-label">{card.title}</div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                {card.description}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
            Quick Access
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="/docs" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
              📚 Browse Documentation
            </a>
            <a href="/packages" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
              📦 Explore Packages
            </a>
            <a href="/issues" className="btn btn-secondary" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
              🐛 View Issues
            </a>
            <a href="/search" className="btn btn-primary" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
              🔍 Search Everything
            </a>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
            About This Dashboard
          </h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            This dashboard provides a centralized view of Flutter resources including 
            official documentation, community packages, and GitHub issues. Use the 
            search functionality to quickly find what you need.
          </p>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              <strong>API Status:</strong> <span style={{ color: '#10b981' }}>🟢 Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;