/**
 * Productivity.jsx
 * Productivity management page - clean version without placeholder content
 */

import React from 'react';
import { CheckSquare } from 'lucide-react';

const Productivity = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <CheckSquare className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Productivity Suite</h1>
      </div>

      {/* Placeholder for future productivity tools */}
      <div className="content-area">
        <p className="text-gray-600 dark:text-gray-400">
          Productivity tools will be added here as needed.
        </p>
      </div>
    </div>
  );
};

export default Productivity;
