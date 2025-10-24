import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Package, ExternalLink, Calendar, Heart, AlertCircle } from 'lucide-react';

function PackagesPage() {
  const { packages, loading, error, fetchPackages } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPackages(50, searchTerm);
  }, [searchTerm, fetchPackages]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Flutter Packages</h1>
        <p className="page-description">
          Discover popular Flutter packages from pub.dev
        </p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading.packages ? (
        <div className="loading">
          <div className="loading-spinner" />
          Loading packages...
        </div>
      ) : (
        <div className="list-container">
          {packages.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No packages found</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="list-item">
                <div className="list-item-title">
                  {pkg.name}
                </div>
                <div className="list-item-description">
                  {pkg.description}
                </div>
                <div className="list-item-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    {formatDate(pkg.updated_at)}
                  </span>
                  <span style={{ 
                    backgroundColor: '#fef3c7', 
                    color: '#92400e', 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    v{pkg.version}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Heart size={14} style={{ color: '#ef4444' }} />
                    {pkg.likes}
                  </span>
                  {pkg.pub_url && (
                    <a 
                      href={pkg.pub_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        color: '#3b82f6',
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={14} />
                      View on pub.dev
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PackagesPage;
