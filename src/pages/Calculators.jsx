/**
 * Calculators.jsx
 * Calculators page - various mathematical and utility calculators
 */

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, LineChart } from 'lucide-react';
import LoanCalculatorTool from '../components/LoanCalculatorTool';
import GraphingCalculatorTool from '../components/GraphingCalculatorTool';
import { trackEvent } from '../utils/analytics';

const Calculators = ({ searchNavigation }) => {
  const [activeModule, setActiveModule] = useState(null);

  // Available calculator modules
  const calculatorModules = [
    {
      id: 'graphingCalculator',
      title: 'Graphing Calculator',
      description: 'Professional graphing calculator with interactive plotting, zoom/pan controls, and advanced mathematical expression support',
      icon: LineChart,
      status: 'available',
      component: GraphingCalculatorTool
    },
    {
      id: 'loanCalculator',
      title: 'Loan Amortization Calculator',
      description: 'Calculate loan payments, generate amortization schedules, and visualize payment breakdowns with interactive charts',
      icon: TrendingUp,
      status: 'available',
      component: LoanCalculatorTool
    }
  ];

  // Handle opening a calculator module
  const openModule = (moduleId) => {
    const module = calculatorModules.find(m => m.id === moduleId);
    if (module && module.status === 'available') {
      setActiveModule(module);
      trackEvent('calculator_launch', { calculator: module.title });
    }
  };

  // Handle search navigation - automatically open calculator when navigated from search
  useEffect(() => {
    if (searchNavigation && searchNavigation.toolId) {
      const targetModule = calculatorModules.find(m => m.id === searchNavigation.toolId);
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
              trackEvent('calculator_back', { from: activeModule?.title });
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span>← Back to Calculators</span>
          </button>
          <div className="flex items-center space-x-2">
            <activeModule.icon className="w-6 h-6 text-blue-600" />
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
        <Calculator className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Calculators</h1>
      </div>

      {/* Available Calculators */}
      <div className="content-area">
        <h2 className="text-xl font-semibold mb-4">Available Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculatorModules.map((calculator) => {
            const IconComponent = calculator.icon;
            return (
              <div
                key={calculator.id}
                className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => openModule(calculator.id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{calculator.title}</h4>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      available
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{calculator.description}</p>
                <button
                  className="w-full py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModule(calculator.id);
                    trackEvent('calculator_launch_button', { calculator: calculator.title });
                  }}
                >
                  Launch Calculator
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calculators;
