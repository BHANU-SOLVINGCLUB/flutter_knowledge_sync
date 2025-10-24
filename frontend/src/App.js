import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DocsPage from './components/DocsPage';
import PackagesPage from './components/PackagesPage';
import IssuesPage from './components/IssuesPage';
import SearchPage from './components/SearchPage';
import { DataProvider } from './context/DataContext';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;