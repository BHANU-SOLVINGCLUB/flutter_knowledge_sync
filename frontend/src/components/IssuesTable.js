import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { AlertCircle, ExternalLink, Search, Calendar, Tag } from 'lucide-react';

function IssuesTable() {
  const { issues, loading, fetchIssues } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFilteredIssues] = useState(issues);

  React.useEffect(() => {
    setFilteredIssues(issues);
  }, [issues]);

  React.useEffect(() => {
    if (searchTerm) {
      const filtered = issues.filter(issue =>
        issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.body?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIssues(filtered);
    } else {
      setFilteredIssues(issues);
    }
  }, [searchTerm, issues]);

  const handleSearch = async () => {
    if (searchTerm) {
      await fetchIssues(50, searchTerm);
    } else {
      await fetchIssues();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const getLabelColor = (label) => {
    const colors = {
      'bug': 'bg-red-100 text-red-800',
      'enhancement': 'bg-blue-100 text-blue-800',
      'feature': 'bg-green-100 text-green-800',
      'documentation': 'bg-yellow-100 text-yellow-800',
      'help wanted': 'bg-purple-100 text-purple-800',
      'good first issue': 'bg-pink-100 text-pink-800',
    };
    return colors[label.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">GitHub Issues</h2>
            <p className="text-sm text-gray-500">
              {filteredIssues.length} issues from flutter/flutter repository
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading.issues ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading issues...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No issues found</p>
            <p className="text-sm text-gray-400 mt-2">
              Make sure GitHub token is configured for issue fetching
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Labels
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue, index) => (
                <tr key={issue.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{issue.issue_number} {issue.title || 'Untitled Issue'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {issue.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {truncateText(issue.body)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {issue.labels && issue.labels.length > 0 ? (
                        issue.labels.slice(0, 3).map((label, labelIndex) => (
                          <span
                            key={labelIndex}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLabelColor(label)}`}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {label}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No labels</span>
                      )}
                      {issue.labels && issue.labels.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{issue.labels.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(issue.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(issue.url, '_blank')}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                        title="View on GitHub"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default IssuesTable;
