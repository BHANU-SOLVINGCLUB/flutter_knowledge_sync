import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { AlertCircle, ExternalLink, Calendar, Tag } from 'lucide-react';

function IssuesPage() {
  const { issues, loading, error, fetchIssues } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIssues(50, searchTerm);
  }, [searchTerm]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'open':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">GitHub Issues</h1>
        <p className="page-description">
          Browse issues from the Flutter repository
        </p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search issues by labels (e.g., bug, enhancement)..."
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

      {loading.issues ? (
        <div className="loading">
          <div className="loading-spinner" />
          Loading issues...
        </div>
      ) : (
        <div className="list-container">
          {issues.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No issues found</p>
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="list-item">
                <div className="list-item-title">
                  {issue.title}
                </div>
                <div className="list-item-description">
                  {issue.body}
                </div>
                <div className="list-item-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    {formatDate(issue.created_at)}
                  </span>
                  <span style={{ 
                    backgroundColor: `${getStateColor(issue.state)}20`, 
                    color: getStateColor(issue.state), 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {issue.state}
                  </span>
                  {issue.labels && issue.labels.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {issue.labels.map((label, index) => (
                        <span 
                          key={index}
                          style={{ 
                            backgroundColor: '#e0e7ff', 
                            color: '#3730a3', 
                            padding: '0.125rem 0.5rem', 
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Tag size={10} />
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                  {issue.url && (
                    <a 
                      href={issue.url} 
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
                      View on GitHub
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

export default IssuesPage;
