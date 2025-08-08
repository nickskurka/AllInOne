/**
 * Settings.jsx
 * Settings page component that provides theme toggle and placeholder for future settings
 * Demonstrates how to integrate with ThemeContext for global state management
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Settings as SettingsIcon } from 'lucide-react';

const SearchBarSettings = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* Page Header */}
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Theme Settings Section */}
      <h2 className="text-xl font-semibold mb-4">Appearance</h2>
      <div>
        <div>
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <div>
            <h3 className="font-medium">Theme</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Currently using {isDark ? 'dark' : 'light'} mode
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isDark ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDark ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Future Settings Sections (Placeholders) */}
      <h2 className="text-xl font-semibold mb-4">Preferences</h2>
      <div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🚧 Additional preference settings will be added here
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Data & Storage</h2>
      <div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🚧 Data management settings will be added here
          </p>
        </div>
      </div>
    </>
  );
};

export default SearchBarSettings;
