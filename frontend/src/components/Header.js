import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Package, AlertCircle, Search, Home } from 'lucide-react';

function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/docs', label: 'Docs', icon: BookOpen },
    { path: '/packages', label: 'Packages', icon: Package },
    { path: '/issues', label: 'Issues', icon: AlertCircle },
    { path: '/search', label: 'Search', icon: Search },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span>🚀</span>
          Flutter Knowledge
        </Link>
        
        <nav className="nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={16} style={{ marginRight: '0.5rem' }} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;