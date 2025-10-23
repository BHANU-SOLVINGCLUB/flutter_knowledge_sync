import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Package, ExternalLink, Search, Star, Download, Calendar } from 'lucide-react';

function PackagesTable() {
  const { packages, loading, fetchPackages } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPackages, setFilteredPackages] = useState(packages);

  React.useEffect(() => {
    setFilteredPackages(packages);
  }, [packages]);

  React.useEffect(() => {
    if (searchTerm) {
      const filtered = packages.filter(pkg =>
        pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPackages(filtered);
    } else {
      setFilteredPackages(packages);
    }
  }, [searchTerm, packages]);

  const handleSearch = async () => {
    if (searchTerm) {
      await fetchPackages(50, searchTerm);
    } else {
      await fetchPackages();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const getPackageStats = (pkg) => {
    const raw = pkg.raw || {};
    return {
      likes: raw.likes || 0,
      popularity: raw.popularity || 0,
      pubPoints: raw.pubPoints || 0,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Flutter Packages</h2>
            <p className="text-sm text-gray-500">
              {filteredPackages.length} packages from pub.dev
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search packages..."
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
        {loading.packages ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading packages...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No packages found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
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
              {filteredPackages.map((pkg, index) => {
                const stats = getPackageStats(pkg);
                return (
                  <tr key={pkg.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {pkg.name || 'Unknown Package'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {pkg.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md">
                        {pkg.description || 'No description available'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {stats.likes}
                        </div>
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-1 text-blue-500" />
                          {stats.popularity}
                        </div>
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {stats.pubPoints} pts
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(pkg.updated_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(`https://pub.dev/packages/${pkg.name}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="View on pub.dev"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PackagesTable;
