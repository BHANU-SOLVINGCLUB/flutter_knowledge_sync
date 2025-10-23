import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://flutterlens.vercel.app');

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
    sync: false
  },
  error: null,
  lastSync: null,
  stats: {
    totalDocs: 0,
    totalPackages: 0,
    totalIssues: 0
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
      return {
        ...state,
        docs: action.payload,
        stats: {
          ...state.stats,
          totalDocs: action.payload.length
        }
      };
    
    case 'SET_PACKAGES':
      return {
        ...state,
        packages: action.payload,
        stats: {
          ...state.stats,
          totalPackages: action.payload.length
        }
      };
    
    case 'SET_ISSUES':
      return {
        ...state,
        issues: action.payload,
        stats: {
          ...state.stats,
          totalIssues: action.payload.length
        }
      };
    
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload
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
    
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // API functions
  const fetchDocs = async (limit = 50, search = '') => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'docs', loading: true } });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/flutter/docs`, {
        params: { limit, search }
      });
      dispatch({ type: 'SET_DOCS', payload: response.data.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'docs', loading: false } });
    }
  };

  const fetchPackages = async (limit = 50, search = '') => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'packages', loading: true } });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/flutter/packages`, {
        params: { limit, search }
      });
      dispatch({ type: 'SET_PACKAGES', payload: response.data.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'packages', loading: false } });
    }
  };

  const fetchIssues = async (limit = 50, labels = '') => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'issues', loading: true } });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/flutter/issues`, {
        params: { limit, labels }
      });
      dispatch({ type: 'SET_ISSUES', payload: response.data.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'issues', loading: false } });
    }
  };

  const searchAll = async (query, limit = 20) => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'search', loading: true } });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/flutter/search`, {
        params: { q: query, limit }
      });
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'search', loading: false } });
    }
  };

  const triggerSync = async () => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'sync', loading: true } });
    try {
      // This would call a sync endpoint if available
      // For now, we'll just refresh all data
      await Promise.all([
        fetchDocs(),
        fetchPackages(),
        fetchIssues()
      ]);
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'sync', loading: false } });
    }
  };

  const checkHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      throw new Error('API is not responding');
    }
  };

  // Load initial data
  useEffect(() => {
    fetchDocs();
    fetchPackages();
    fetchIssues();
  }, []);

  const value = {
    ...state,
    fetchDocs,
    fetchPackages,
    fetchIssues,
    searchAll,
    triggerSync,
    checkHealth
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
