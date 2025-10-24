import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-6 ml-64">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/docs" element={<Dashboard tab="docs" />} />
                  <Route path="/packages" element={<Dashboard tab="packages" />} />
                  <Route path="/issues" element={<Dashboard tab="issues" />} />
                  <Route path="/search" element={<Dashboard tab="search" />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;
