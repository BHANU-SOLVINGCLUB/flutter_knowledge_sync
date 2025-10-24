import React, { useEffect, useState } from 'react';
import { Activity, Zap, Clock, Wifi } from 'lucide-react';

function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    connectionSpeed: 'unknown'
  });

  useEffect(() => {
    // Measure page load time
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        setMetrics(prev => ({ ...prev, memoryUsage: usedMB }));
      };
      
      updateMemoryUsage();
      const interval = setInterval(updateMemoryUsage, 5000);
      return () => clearInterval(interval);
    }

    // Monitor connection speed
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const speed = connection.effectiveType || 'unknown';
      setMetrics(prev => ({ ...prev, connectionSpeed: speed }));
    }
  }, []);

  const getPerformanceColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConnectionIcon = (speed) => {
    switch (speed) {
      case '4g': return <Wifi className="w-4 h-4 text-green-600" />;
      case '3g': return <Wifi className="w-4 h-4 text-yellow-600" />;
      case '2g': return <Wifi className="w-4 h-4 text-red-600" />;
      default: return <Wifi className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
        <Activity className="w-4 h-4 mr-2 text-blue-500" />
        Performance Metrics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-3 h-3 mr-1 text-gray-500" />
            <span className="text-xs text-gray-600">Load Time</span>
          </div>
          <div className={`text-lg font-semibold ${getPerformanceColor(metrics.loadTime, { good: 1000, warning: 3000 })}`}>
            {metrics.loadTime.toFixed(0)}ms
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Zap className="w-3 h-3 mr-1 text-gray-500" />
            <span className="text-xs text-gray-600">Memory</span>
          </div>
          <div className={`text-lg font-semibold ${getPerformanceColor(metrics.memoryUsage, { good: 50, warning: 100 })}`}>
            {metrics.memoryUsage}MB
          </div>
        </div>
        
        <div className="text-center col-span-2">
          <div className="flex items-center justify-center mb-1">
            {getConnectionIcon(metrics.connectionSpeed)}
            <span className="text-xs text-gray-600 ml-1">Connection</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 capitalize">
            {metrics.connectionSpeed}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMonitor;
