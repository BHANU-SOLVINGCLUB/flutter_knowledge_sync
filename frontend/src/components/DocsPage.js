import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { BookOpen, ExternalLink, Calendar, AlertCircle } from 'lucide-react';

function DocsPage() {
  const { docs, loading, error, fetchDocs } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocs(50, searchTerm);
  }, [searchTerm, fetchDocs]);

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
        <h1 className="page-title">Flutter Documentation</h1>
        <p className="page-description">
          Browse comprehensive Flutter documentation and guides
        </p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search documentation..."
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

      {loading.docs ? (
        <div className="loading">
          <div className="loading-spinner" />
          Loading documentation...
        </div>
      ) : (
        <div className="list-container">
          {docs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No documentation found</p>
            </div>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="list-item">
                <div className="list-item-title">
                  {doc.title}
                </div>
                <div className="list-item-description">
                  {doc.content}
                </div>
                <div className="list-item-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    {formatDate(doc.updated_at)}
                  </span>
                  <span style={{ 
                    backgroundColor: '#e0e7ff', 
                    color: '#3730a3', 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {doc.category}
                  </span>
                  {doc.url && (
                    <a 
                      href={doc.url} 
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
                      View Original
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

export default DocsPage;
