import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://flutterlens.vercel.app');

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initial state
const initialState = {
  docs: [],
  packages: [],
  issues: [],
  searchResults: {},
  stats: {
    total_docs: 0,
    total_packages: 0,
    total_issues: 0
  },
  loading: {
    docs: false,
    packages: false,
    issues: false,
    search: false,
    stats: false
  },
  error: null
};

// Reducer
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
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'SET_DOCS':
      return {
        ...state,
        docs: action.payload.data || action.payload,
        loading: {
          ...state.loading,
          docs: false
        }
      };
    
    case 'SET_PACKAGES':
      return {
        ...state,
        packages: action.payload.data || action.payload,
        loading: {
          ...state.loading,
          packages: false
        }
      };
    
    case 'SET_ISSUES':
      return {
        ...state,
        issues: action.payload.data || action.payload,
        loading: {
          ...state.loading,
          issues: false
        }
      };
    
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
        loading: {
          ...state.loading,
          search: false
        }
      };
    
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload,
        loading: {
          ...state.loading,
          stats: false
        }
      };
    
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // API functions
  const fetchDocs = async (limit = 50, search = '', offset = 0) => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'docs', loading: true } });
    try {
      const response = await apiClient.get('/api/flutter/docs', {
        params: { limit, search, offset }
      });
      dispatch({ type: 'SET_DOCS', payload: response.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchPackages = async (limit = 50, search = '', offset = 0) => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'packages', loading: true } });
    try {
      const response = await apiClient.get('/api/flutter/packages', {
        params: { limit, search, offset }
      });
      dispatch({ type: 'SET_PACKAGES', payload: response.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchIssues = async (limit = 50, labels = '', offset = 0) => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'issues', loading: true } });
    try {
      const response = await apiClient.get('/api/flutter/issues', {
        params: { limit, labels, offset }
      });
      dispatch({ type: 'SET_ISSUES', payload: response.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const searchAll = async (query, limit = 20) => {
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
    }
  };

  const fetchStats = async () => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'stats', loading: true } });
    try {
      const response = await apiClient.get('/api/flutter/stats');
      dispatch({ type: 'SET_STATS', payload: response.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchStats(),
          fetchDocs(10),
          fetchPackages(10),
          fetchIssues(10)
        ]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const value = {
    ...state,
    fetchDocs,
    fetchPackages,
    fetchIssues,
    searchAll,
    fetchStats,
    clearError
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