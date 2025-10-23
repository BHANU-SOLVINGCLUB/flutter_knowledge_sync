import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Package, 
  AlertCircle, 
  Search, 
  BarChart3,
  Database,
  Settings,
  HelpCircle
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Documentation', href: '/docs', icon: FileText },
  { name: 'Packages', href: '/packages', icon: Package },
  { name: 'GitHub Issues', href: '/issues', icon: AlertCircle },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const secondaryNavigation = [
  { name: 'Database', href: '/database', icon: Database },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 pt-20">
      <div className="flex flex-col h-full">
        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 w-5 h-5 ${
                      isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Secondary Navigation */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 w-4 h-4 ${
                      isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">FK</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Flutter Knowledge</p>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
