/**
 * PhysicsMathTools.jsx
 * Physics, mathematics, and utility tools page - clean version with only working tools
 */

import React, { useState, useEffect } from 'react';
import { Calculator, Circle, Palette } from 'lucide-react';
import PixelEllipse from '../components/PixelEllipse';
import SpriteGenerator from '../components/SpriteGenerator';
import { trackEvent } from '../utils/analytics';

const PhysicsMathTools = ({ searchNavigation }) => {
  const [activeModule, setActiveModule] = useState(null);

  // Only the working tools you requested
  const toolModules = [
    {
      id: 'pixelellipse',
      title: 'Pixel-Perfect Shapes',
      description: 'Generate pixel-accurate circles and ellipses with interactive controls',
      icon: Circle,
      status: 'available',
      component: PixelEllipse
    },
    {
      id: 'spritegenerator',
      title: 'Sprite Generator',
      description: 'Create pixel art sprites with advanced drawing tools, color wheel picker, and export options',
      icon: Palette,
      status: 'available',
      component: SpriteGenerator
    }

  ];

  // Handle opening a tool module
  const openModule = (moduleId) => {
    const module = toolModules.find(m => m.id === moduleId);
    if (module && module.status === 'available') {
      setActiveModule(module);
      trackEvent('tools_tool_launch', { tool: module.title });
    }
  };

  // Handle search navigation - automatically open tool when navigated from search
  useEffect(() => {
    if (searchNavigation && searchNavigation.toolId) {
      const targetModule = toolModules.find(m => m.id === searchNavigation.toolId);
      if (targetModule && targetModule.status === 'available') {
        setActiveModule(targetModule);
      }
    }
  }, [searchNavigation]);

  // If a module is active, render it
  if (activeModule) {
    const ModuleComponent = activeModule.component;
    return (
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setActiveModule(null);
              trackEvent('tools_back', { from: activeModule?.title });
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span>← Back to Tools</span>
          </button>
          <div className="flex items-center space-x-2">
            <activeModule.icon className="w-6 h-6 text-orange-600" />
            <h1 className="text-2xl font-bold">{activeModule.title}</h1>
          </div>
        </div>

        {/* Render the active module */}
        <ModuleComponent />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <Calculator className="w-8 h-8 text-orange-600" />
        <h1 className="text-3xl font-bold">Physics, Math & Tools</h1>
      </div>

      {/* Available Tools */}
      <div className="content-area">
        <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {toolModules.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                className="border border-green-200 dark:border-green-800 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => openModule(tool.id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <IconComponent className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{tool.title}</h4>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      available
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tool.description}</p>
                <button
                  className="w-full py-2 px-4 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModule(tool.id);
                    trackEvent('tools_tool_launch_button', { tool: tool.title });
                  }}
                >
                  Launch Tool
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhysicsMathTools;
