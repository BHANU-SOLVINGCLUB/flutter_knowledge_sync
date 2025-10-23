import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Database } from 'lucide-react';

function SyncStatus() {
  const { loading, lastSync, triggerSync, checkHealth } = useData();
  const [healthStatus, setHealthStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const health = await checkHealth();
      setHealthStatus(health);
    } catch (error) {
      setHealthStatus({ status: 'error', message: error.message });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSync = async () => {
    try {
      await triggerSync();
      await checkApiHealth();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sync Status</h3>
        <button
          onClick={handleSync}
          disabled={loading.sync}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading.sync ? 'animate-spin' : ''}`} />
          <span>{loading.sync ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* API Health Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">API Status</p>
              <p className="text-sm text-gray-500">
                {isCheckingHealth ? 'Checking...' : 'Connection status'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {healthStatus && (
              <>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(healthStatus.status)}`}>
                  {healthStatus.status === 'ok' ? 'Healthy' : 'Error'}
                </div>
                {React.createElement(getStatusIcon(healthStatus.status), {
                  className: `w-4 h-4 ${healthStatus.status === 'ok' ? 'text-green-500' : 'text-red-500'}`
                })}
              </>
            )}
          </div>
        </div>

        {/* Last Sync */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">Last Sync</p>
              <p className="text-sm text-gray-500">
                {formatLastSync(lastSync)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {lastSync ? 'Completed' : 'Pending'}
          </div>
        </div>

        {/* Sync Progress */}
        {loading.sync && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-900">Syncing Data</p>
                <p className="text-sm text-blue-700">
                  Fetching latest Flutter documentation, packages, and issues...
                </p>
              </div>
            </div>
            <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}

        {/* Health Details */}
        {healthStatus && healthStatus.status === 'ok' && (
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">All Systems Operational</p>
                <p className="text-sm text-green-700">
                  API version: {healthStatus.version || '1.0.0'} • 
                  Supabase: {healthStatus.supabase_configured ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
          </div>
        )}

        {healthStatus && healthStatus.status === 'error' && (
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Connection Error</p>
                <p className="text-sm text-red-700">
                  {healthStatus.message || 'Unable to connect to API'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SyncStatus;
