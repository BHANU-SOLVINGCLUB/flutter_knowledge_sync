import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FileText, ExternalLink, Search, Calendar, Eye } from 'lucide-react';

function DocsTable() {
  const { docs, loading, fetchDocs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocs, setFilteredDocs] = useState(docs);

  React.useEffect(() => {
    setFilteredDocs(docs);
  }, [docs]);

  React.useEffect(() => {
    if (searchTerm) {
      const filtered = docs.filter(doc =>
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocs(filtered);
    } else {
      setFilteredDocs(docs);
    }
  }, [searchTerm, docs]);

  const handleSearch = async () => {
    if (searchTerm) {
      await fetchDocs(50, searchTerm);
    } else {
      await fetchDocs();
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Flutter Documentation</h2>
            <p className="text-sm text-gray-500">
              {filteredDocs.length} documentation pages available
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documentation..."
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
        {loading.docs ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading documentation...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No documentation found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocs.map((doc, index) => (
                <tr key={doc.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {doc.title || 'Untitled Document'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {doc.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {truncateText(doc.content || doc.summary)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(doc.updated_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(doc.url, '_blank')}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      {doc.url && (
                        <button
                          onClick={() => window.open(doc.url, '_blank')}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                          title="Open in New Tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
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

export default DocsTable;
