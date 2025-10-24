import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const DataContext = createContext();

// Enhanced API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://flutterlens.vercel.app');

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      if (status === 429) {
        error.message = 'Rate limit exceeded. Please try again later.';
      } else if (status >= 500) {
        error.message = 'Server error. Please try again later.';
      } else if (status === 404) {
        error.message = 'Resource not found.';
      } else {
        error.message = data?.detail || data?.message || 'An error occurred';
      }
    } else if (error.request) {
      // Network error
      error.message = 'Network error. Please check your connection.';
    } else {
      // Other error
      error.message = error.message || 'An unexpected error occurred';
    }
    
    return Promise.reject(error);
  }
);

const initialState = {
  docs: [],
  packages: [],
  issues: [],
  searchResults: {},
  loading: {
    docs: false,
    packages: false,
    issues: false,
    search: false,
    sync: false,
    stats: false
  },
  error: null,
  lastSync: null,
  stats: {
    totalDocs: 0,
    totalPackages: 0,
    totalIssues: 0
  },
  cache: {
    docs: { data: [], timestamp: null, ttl: 5 * 60 * 1000 }, // 5 minutes
    packages: { data: [], timestamp: null, ttl: 10 * 60 * 1000 }, // 10 minutes
    issues: { data: [], timestamp: null, ttl: 15 * 60 * 1000 }, // 15 minutes
    stats: { data: null, timestamp: null, ttl: 2 * 60 * 1000 } // 2 minutes
  },
  pagination: {
    docs: { offset: 0, hasMore: false },
    packages: { offset: 0, hasMore: false },
    issues: { offset: 0, hasMore: false }
  }
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading
        }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'SET_DOCS':
      const docsData = action.payload.data || action.payload;
      const docsPagination = action.payload.pagination;
      return {
        ...state,
        docs: docsData,
        stats: {
          ...state.stats,
          totalDocs: action.payload.total || docsData.length
        },
        cache: {
          ...state.cache,
          docs: {
            data: docsData,
            timestamp: Date.now(),
            ttl: state.cache.docs.ttl
          }
        },
        pagination: {
          ...state.pagination,
          docs: docsPagination ? {
            offset: docsPagination.offset,
            hasMore: docsPagination.has_more
          } : state.pagination.docs
        }
      };
    
    case 'APPEND_DOCS':
      return {
        ...state,
        docs: [...state.docs, ...action.payload.data],
        pagination: {
          ...state.pagination,
          docs: {
            offset: action.payload.pagination.offset,
            hasMore: action.payload.pagination.has_more
          }
        }
      };
    
    case 'SET_PACKAGES':
      const packagesData = action.payload.data || action.payload;
      const packagesPagination = action.payload.pagination;
      return {
        ...state,
        packages: packagesData,
        stats: {
          ...state.stats,
          totalPackages: action.payload.total || packagesData.length
        },
        cache: {
          ...state.cache,
          packages: {
            data: packagesData,
            timestamp: Date.now(),
            ttl: state.cache.packages.ttl
          }
        },
        pagination: {
          ...state.pagination,
          packages: packagesPagination ? {
            offset: packagesPagination.offset,
            hasMore: packagesPagination.has_more
          } : state.pagination.packages
        }
      };
    
    case 'APPEND_PACKAGES':
      return {
        ...state,
        packages: [...state.packages, ...action.payload.data],
        pagination: {
          ...state.pagination,
          packages: {
            offset: action.payload.pagination.offset,
            hasMore: action.payload.pagination.has_more
          }
        }
      };
    
    case 'SET_ISSUES':
      const issuesData = action.payload.data || action.payload;
      const issuesPagination = action.payload.pagination;
      return {
        ...state,
        issues: issuesData,
        stats: {
          ...state.stats,
          totalIssues: action.payload.total || issuesData.length
        },
        cache: {
          ...state.cache,
          issues: {
            data: issuesData,
            timestamp: Date.now(),
            ttl: state.cache.issues.ttl
          }
        },
        pagination: {
          ...state.pagination,
          issues: issuesPagination ? {
            offset: issuesPagination.offset,
            hasMore: issuesPagination.has_more
          } : state.pagination.issues
        }
      };
    
    case 'APPEND_ISSUES':
      return {
        ...state,
        issues: [...state.issues, ...action.payload.data],
        pagination: {
          ...state.pagination,
          issues: {
            offset: action.payload.pagination.offset,
            hasMore: action.payload.pagination.has_more
          }
        }
      };
    
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload
      };
    
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload,
        cache: {
          ...state.cache,
          stats: {
            data: action.payload,
            timestamp: Date.now(),
            ttl: state.cache.stats.ttl
          }
        }
      };
    
    case 'SET_LAST_SYNC':
      return {
        ...state,
        lastSync: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'CLEAR_CACHE':
      return {
        ...state,
        cache: initialState.cache
      };
    
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Cache utility functions
  const isCacheValid = useCallback((cacheKey) => {
    const cache = state.cache[cacheKey];
    if (!cache || !cache.timestamp) return false;
    return Date.now() - cache.timestamp < cache.ttl;
  }, [state.cache]);

  const getCachedData = useCallback((cacheKey) => {
    return state.cache[cacheKey]?.data || null;
  }, [state.cache]);

  // API functions with caching and enhanced error handling
  const fetchDocs = useCallback(async (limit = 50, search = '', offset = 0, useCache = true) => {
    // Check cache first
    if (useCache && isCacheValid('docs') && !search && offset === 0) {
      const cachedData = getCachedData('docs');
      if (cachedData) {
        dispatch({ type: 'SET_DOCS', payload: { data: cachedData } });
        return;
      }
    }

    dispatch({ type: 'SET_LOADING', payload: { type: 'docs', loading: true } });
    try {
      const response = await apiClient.get('/api/flutter/docs', {
        params: { limit, search, offset }
      });
      
      if (offset === 0) {
        dispatch({ type: 'SET_DOCS', payload: response.data });
      } else {
        dispatch({ type: 'APPEND_DOCS', payload: response.data });
      }
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'docs', loading: false } });
    }
  }, [isCacheValid, getCachedData]);

  const fetchPackages = useCallback(async (limit = 50, search = '', offset = 0, useCache = true) => {
    // Check cache first
    if (useCache && isCacheValid('packages') && !search && offset === 0) {
      const cachedData = getCachedData('packages');
      if (cachedData) {
        dispatch({ type: 'SET_PACKAGES', payload: { data: cachedData } });
        return;
      }
    }

    dispatch({ type: 'SET_LOADING', payload: { type: 'packages', loading: true } });
    try {
      const response = await apiClient.get('/api/flutter/packages', {
        params: { limit, search, offset }
      });
      
      if (offset === 0) {
        dispatch({ type: 'SET_PACKAGES', payload: response.data });
      } else {
        dispatch({ type: 'APPEND_PACKAGES', payload: response.data });
      }
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'packages', loading: false } });
    }
  }, [isCacheValid, getCachedData]);

  const fetchIssues = useCallback(async (limit = 50, labels = '', offset = 0, useCache = true) => {
    // Check cache first
    if (useCache && isCacheValid('issues') && !labels && offset === 0) {
      const cachedData = getCachedData('issues');
      if (cachedData) {
        dispatch({ type: 'SET_ISSUES', payload: { data: cachedData } });
        return;
      }
    }

    dispatch({ type: 'SET_LOADING', payload: { type: 'issues', loading: true } });
    try {
      const response = await apiClient.get('/api/flutter/issues', {
        params: { limit, labels, offset }
      });
      
      if (offset === 0) {
        dispatch({ type: 'SET_ISSUES', payload: response.data });
      } else {
        dispatch({ type: 'APPEND_ISSUES', payload: response.data });
      }
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'issues', loading: false } });
    }
  }, [isCacheValid, getCachedData]);

  const searchAll = useCallback(async (query, limit = 20) => {
    if (!query || query.trim().length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Search query cannot be empty' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: { type: 'search', loading: true } });
    try {
      const response = await apiClient.get('/api/flutter/search', {
        params: { q: query.trim(), limit }
      });
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'search', loading: false } });
    }
  }, []);

  const fetchStats = useCallback(async () => {
    // Check cache first
    if (isCacheValid('stats')) {
      const cachedData = getCachedData('stats');
      if (cachedData) {
        dispatch({ type: 'SET_STATS', payload: cachedData });
        return;
      }
    }

    dispatch({ type: 'SET_LOADING', payload: { type: 'stats', loading: true } });
    try {
      const response = await apiClient.get('/api/flutter/stats');
      dispatch({ type: 'SET_STATS', payload: response.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'stats', loading: false } });
    }
  }, [isCacheValid, getCachedData]);

  const triggerSync = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'sync', loading: true } });
    try {
      // Clear cache and refresh all data
      dispatch({ type: 'CLEAR_CACHE' });
      await Promise.all([
        fetchDocs(50, '', 0, false),
        fetchPackages(50, '', 0, false),
        fetchIssues(50, '', 0, false),
        fetchStats()
      ]);
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'sync', loading: false } });
    }
  }, [fetchDocs, fetchPackages, fetchIssues, fetchStats]);

  const checkHealth = useCallback(async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('API is not responding');
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchDocs(),
          fetchPackages(),
          fetchIssues(),
          fetchStats()
        ]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, [fetchDocs, fetchPackages, fetchIssues, fetchStats]);

  const value = {
    ...state,
    fetchDocs,
    fetchPackages,
    fetchIssues,
    searchAll,
    fetchStats,
    triggerSync,
    checkHealth,
    clearError,
    clearCache
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
