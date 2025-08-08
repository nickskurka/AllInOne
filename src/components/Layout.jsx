/**
 * Layout.jsx
 * Main layout component that provides consistent structure across all pages
 * Handles responsive design and overall page organization
 */

import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation area */}
      <header className="bg-light-secondary dark:bg-dark-secondary border-b border-light-border dark:border-dark-border">
        <div className="w-full px-6">
          {children[0]} {/* Navbar component */}
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 w-full px-6">
        {children[1]} {/* Main content */}
      </div>

      {/* Footer (placeholder for future expansion) */}
      <footer className="bg-light-secondary dark:bg-dark-secondary border-t border-light-border dark:border-dark-border mt-auto">
        <div className="w-full px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 Nick Skurka. Released under the MIT License.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
