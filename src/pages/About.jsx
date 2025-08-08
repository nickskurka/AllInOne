/**
 * About.jsx
 * About page - information about the AllInOne Dashboard
 */

import React from 'react';
import { Info, Heart, Code, Github } from 'lucide-react';
import { format, toZonedTime } from 'date-fns-tz';
import { BUILD_DATE } from '../utils/buildinfo';
import Settings from '../components/Settings';

const About = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <Info className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold">About</h1>
      </div>

      {/* About Content */}
      <div className="content-area space-y-8">
        {/* Project Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            All-in-one Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            A comprehensive personal dashboard that brings together various tools and utilities in one convenient location.
            Built with React and designed with a clean, modern interface that adapts to your preferences with dark/light mode support.
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <strong>Last Updated:</strong> {format(toZonedTime(BUILD_DATE, Intl.DateTimeFormat().resolvedOptions().timeZone), 'EEEE, MMMM d, hh:mm a zzz')}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">📊 Personal Finance</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm"></p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">📈 Stock Market</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Monitor stocks, indices, and other financial instruments</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">✅ Productivity</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Productivity tools such as pomodoro timers, scheduling, and more</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">🎮 Games</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Library of 2-dimensional flash-esque games</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">🧮 Calculators</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Various mathematical, financial, and scientific calculators</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">🛠️ Tools</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Physics simulations and development tools</p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Code className="w-6 h-6 text-blue-500 mr-2" />
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <h3 className="font-medium">Frontend</h3>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <li>• React 18</li>
                <li>• JavaScript (ES6+)</li>
                <li>• HTML5 Canvas</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Backend</h3>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <li>• Python</li>
                <li>• SQL</li>
                <li>• C++</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Styling</h3>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <li>• Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Icons & Assets</h3>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <li>• Lucide React</li>
                <li>• Custom Sprites</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Version Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Version:</span> 1.0.0
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Last Updated:</span> {format(toZonedTime(BUILD_DATE, Intl.DateTimeFormat().resolvedOptions().timeZone), 'EEEE, MMMM d, hh:mm a zzz')}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Build:</span> Production
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Status:</span> Active Development
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
        </div>
      </div>
    </div>
  );
};

export default About;
