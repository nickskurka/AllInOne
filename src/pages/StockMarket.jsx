/**
 * StockMarket.jsx
 * Stock market tools and analysis page
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Target } from 'lucide-react';
import OptionPricingTool from '../components/OptionPricingTool';
import { trackEvent } from '../utils/analytics';

const StockMarket = ({ searchNavigation }) => {
  const [activeModule, setActiveModule] = useState(null);

  // Available stock market modules
  const stockMarketModules = [
    {
      id: 'optionPricing',
      title: 'Option Pricing Calculator',
      description: 'Calculate and analyze options pricing using various models including Black-Scholes and Binomial',
      icon: Target,
      status: 'available',
      component: OptionPricingTool
    }
  ];

  // Handle opening a stock market module
  const openModule = (moduleId) => {
    const module = stockMarketModules.find(m => m.id === moduleId);
    if (module && module.status === 'available') {
      setActiveModule(module);
      trackEvent('stockmarket_tool_launch', { tool: module.title });
    }
  };

  // Handle search navigation - automatically open tool when navigated from search
  useEffect(() => {
    if (searchNavigation && searchNavigation.toolId) {
      const targetModule = stockMarketModules.find(m => m.id === searchNavigation.toolId);
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
              trackEvent('stockmarket_back', { from: activeModule?.title });
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span>← Back to Stock Market</span>
          </button>
          <div className="flex items-center space-x-2">
            <activeModule.icon className="w-6 h-6 text-yellow-600" />
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
        <TrendingUp className="w-8 h-8 text-yellow-600" />
        <h1 className="text-3xl font-bold">Stock Market</h1>
      </div>

      {/* Available Stock Market Tools */}
      <div className="content-area">
        <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stockMarketModules.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => openModule(tool.id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <IconComponent className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{tool.title}</h4>
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                      available
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tool.description}</p>
                <button
                  className="w-full py-2 px-4 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModule(tool.id);
                    trackEvent('stockmarket_tool_launch_button', { tool: tool.title });
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

export default StockMarket;
