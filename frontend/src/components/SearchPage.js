import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, BookOpen, Package, AlertCircle, ExternalLink, Calendar } from 'lucide-react';

function SearchPage() {
  const { searchResults, loading, error, searchAll } = useData();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
      await searchAll(query);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderSearchResults = (results, type, Icon, title) => {
    if (!results || results.length === 0) return null;

    return (
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '1rem', 
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Icon size={20} />
          {title} ({results.length})
        </h3>
        <div className="list-container">
          {results.map((item, index) => (
            <div key={index} className="list-item">
              <div className="list-item-title">
                {item.title || item.name}
              </div>
              <div className="list-item-description">
                {item.content || item.description || item.body}
              </div>
              <div className="list-item-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={14} />
                  {formatDate(item.updated_at || item.created_at)}
                </span>
                {item.url && (
                  <a 
                    href={item.url} 
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
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Search Flutter Resources</h1>
        <p className="page-description">
          Search across documentation, packages, and issues
        </p>
      </div>

      <form onSubmit={handleSearch} className="search-container">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search for anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            style={{ flex: 1 }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading.search}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            {loading.search ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <Search size={16} style={{ marginRight: '0.5rem' }} />
                Search
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {hasSearched && !loading.search && (
        <div>
          {searchResults.total_results > 0 ? (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#64748b' }}>
                Found {searchResults.total_results} results for "{searchResults.query}"
              </p>
            </div>
          ) : (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#64748b',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0'
            }}>
              <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No results found for "{searchResults.query}"</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Try different keywords or check your spelling
              </p>
            </div>
          )}

          {searchResults.results && (
            <>
              {renderSearchResults(searchResults.results.docs, 'docs', BookOpen, 'Documentation')}
              {renderSearchResults(searchResults.results.packages, 'packages', Package, 'Packages')}
              {renderSearchResults(searchResults.results.issues, 'issues', AlertCircle, 'Issues')}
            </>
          )}
        </div>
      )}

      {!hasSearched && (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#64748b',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0'
        }}>
          <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>Enter a search term to find Flutter resources</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Search across documentation, packages, and GitHub issues
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
