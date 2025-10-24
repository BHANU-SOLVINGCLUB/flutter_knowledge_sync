import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, FileText, Package, AlertCircle, ExternalLink, Clock } from 'lucide-react';

function SearchResults() {
  const { searchResults, loading, searchAll, error, clearError } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setHasSearched(true);
      clearError();
      
      // Add to search history
      const trimmedQuery = searchQuery.trim();
      if (!searchHistory.includes(trimmedQuery)) {
        setSearchHistory(prev => [trimmedQuery, ...prev.slice(0, 4)]); // Keep last 5 searches
      }
      
      await searchAll(trimmedQuery);
    }
  };

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
    setHasSearched(true);
    clearError();
    searchAll(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'No content available';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const renderSearchResults = () => {
    if (!hasSearched) {
      return (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search Flutter Knowledge</h3>
          <p className="text-gray-500">Enter a search term to find documentation, packages, and issues</p>
        </div>
      );
    }

    if (loading.search) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Searching...</p>
        </div>
      );
    }

    const { results = {}, total_results = 0 } = searchResults;
    const { docs = [], packages = [], issues = [] } = results;

    if (total_results === 0) {
      return (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500">Try different search terms or check your spelling</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Search Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Search Results for "{searchQuery}"
          </h3>
          <p className="text-blue-700">
            Found {total_results} results across {docs.length} docs, {packages.length} packages, and {issues.length} issues
          </p>
        </div>

        {/* Documentation Results */}
        {docs.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Documentation ({docs.length})
            </h4>
            <div className="space-y-3">
              {docs.map((doc, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 mb-1">{doc.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{truncateText(doc.content || doc.summary)}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Updated: {formatDate(doc.updated_at)}
                      </div>
                    </div>
                    {doc.url && (
                      <button
                        onClick={() => window.open(doc.url, '_blank')}
                        className="ml-4 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Package Results */}
        {packages.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-500" />
              Packages ({packages.length})
            </h4>
            <div className="space-y-3">
              {packages.map((pkg, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 mb-1">{pkg.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{pkg.description || 'No description available'}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Updated: {formatDate(pkg.updated_at)}
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(`https://pub.dev/packages/${pkg.name}`, '_blank')}
                      className="ml-4 text-green-600 hover:text-green-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issue Results */}
        {issues.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
              GitHub Issues ({issues.length})
            </h4>
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 mb-1">
                        #{issue.issue_number} {issue.title}
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">{truncateText(issue.body)}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Created: {formatDate(issue.created_at)}
                      </div>
                    </div>
                    {issue.url && (
                      <button
                        onClick={() => window.open(issue.url, '_blank')}
                        className="ml-4 text-orange-600 hover:text-orange-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Flutter Knowledge</h2>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for widgets, packages, issues, or any Flutter topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || loading.search}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading.search ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(query)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderSearchResults()}
      </div>
    </div>
  );
}

export default SearchResults;
