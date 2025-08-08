/**
 * GraphingCalculatorTool.jsx
 * Professional graphing calculator with interactive plotting and math expression support
 */

import React, { useState } from 'react';
import { Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useGraphingEngine } from '../hooks/useGraphingEngine';
import ExpressionInputBar from './ExpressionInputBar';
import GraphCanvas from './GraphCanvas';

const GraphingCalculatorTool = () => {
  const {
    expressions,
    viewport,
    gridSettings,
    addExpression,
    updateExpression,
    removeExpression,
    toggleExpression,
    toggleIntercepts,
    changeExpressionColor,
    validateExpression,
    generatePlotPoints,
    findCriticalPoints,
    zoomIn,
    zoomOut,
    resetZoom,
    panViewport,
    setViewport,
    setGridSettings,
    getGridStep
  } = useGraphingEngine();

  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('expressions');

  // Export graph as PNG
  const exportGraph = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `graph_${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Quick zoom presets
  const zoomPresets = [
    { name: 'Standard', viewport: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 } },
    { name: 'Trigonometric', viewport: { xMin: -2*Math.PI, xMax: 2*Math.PI, yMin: -2, yMax: 2 } },
    { name: 'Detailed', viewport: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 } },
    { name: 'Wide', viewport: { xMin: -20, xMax: 20, yMin: -20, yMax: 20 } }
  ];

  // Sample expressions for quick start
  const sampleExpressions = [
    'sin(x)',
    'cos(x)',
    'x^2',
    'sqrt(x)',
    'ln(x)',
    'e^x',
    'abs(x)',
    'tan(x)'
  ];

  const handleSampleExpression = (expr) => {
    if (expressions.length === 1 && !expressions[0].expression) {
      updateExpression(expressions[0].id, expr);
    } else {
      addExpression();
      // Update the new expression after it's added
      setTimeout(() => {
        const newExpr = expressions[expressions.length];
        if (newExpr) {
          updateExpression(newExpr.id, expr);
        }
      }, 0);
    }
  };

  return (
    <div className="space-y-6">

      {/* Main Calculator Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        {/* Left Panel - Controls */}
        <div className="xl:col-span-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-1 flex flex-col">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('expressions')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'expressions'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Expressions
              </button>
              <button
                onClick={() => setActiveTab('samples')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'samples'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Examples
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Settings
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {/* Expressions Tab */}
              {activeTab === 'expressions' && (
                <ExpressionInputBar
                  expressions={expressions}
                  onAdd={addExpression}
                  onUpdate={updateExpression}
                  onRemove={removeExpression}
                  onToggle={toggleExpression}
                  onToggleIntercepts={toggleIntercepts}
                  onColorChange={changeExpressionColor}
                  validateExpression={validateExpression}
                />
              )}

              {/* Sample Expressions Tab */}
              {activeTab === 'samples' && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Click to add sample expressions:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {sampleExpressions.map((expr) => (
                      <button
                        key={expr}
                        onClick={() => handleSampleExpression(expr)}
                        className="px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-mono"
                      >
                        {expr}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      More Examples:
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div><code>x^3 - 2*x^2 + x - 1</code> - Cubic polynomial</div>
                      <div><code>sin(x) + cos(2*x)</code> - Trigonometric sum</div>
                      <div><code>e^(-x^2)</code> - Gaussian function</div>
                      <div><code>log(abs(x))</code> - Logarithmic function</div>
                      <div><code>sqrt(25 - x^2)</code> - Semi-circle</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  {/* Grid Settings */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Display Options
                    </div>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={gridSettings.showGrid}
                        onChange={(e) => setGridSettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Show Grid</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={gridSettings.showAxes}
                        onChange={(e) => setGridSettings(prev => ({ ...prev, showAxes: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Show Axes</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={gridSettings.showLabels}
                        onChange={(e) => setGridSettings(prev => ({ ...prev, showLabels: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Show Labels</span>
                    </label>
                  </div>

                  {/* Viewport Controls */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Viewport
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">X Min</label>
                        <input
                          type="number"
                          value={viewport.xMin}
                          onChange={(e) => setViewport(prev => ({ ...prev, xMin: parseFloat(e.target.value) || prev.xMin }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">X Max</label>
                        <input
                          type="number"
                          value={viewport.xMax}
                          onChange={(e) => setViewport(prev => ({ ...prev, xMax: parseFloat(e.target.value) || prev.xMax }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Y Min</label>
                        <input
                          type="number"
                          value={viewport.yMin}
                          onChange={(e) => setViewport(prev => ({ ...prev, yMin: parseFloat(e.target.value) || prev.yMin }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Y Max</label>
                        <input
                          type="number"
                          value={viewport.yMax}
                          onChange={(e) => setViewport(prev => ({ ...prev, yMax: parseFloat(e.target.value) || prev.yMax }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Zoom Presets */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quick Zoom
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {zoomPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setViewport(preset.viewport)}
                          className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Graph */}
        <div className="xl:col-span-2 space-y-4">
          {/* Graph Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => zoomIn()}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Zoom In</span>
                </button>
                <button
                  onClick={() => zoomOut()}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Zoom Out</span>
                </button>
                <button
                  onClick={resetZoom}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={exportGraph}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  title="Export as PNG"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Graph Canvas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <GraphCanvas
              expressions={expressions}
              viewport={viewport}
              gridSettings={gridSettings}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onPan={panViewport}
              generatePlotPoints={generatePlotPoints}
              findCriticalPoints={findCriticalPoints}
              getGridStep={getGridStep}
              validateExpression={validateExpression}
            />
          </div>

          {/* Function Analysis */}
          {expressions.some(expr => expr.visible && expr.expression.trim()) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Function Analysis</h3>
              <div className="space-y-2">
                {expressions
                  .filter(expr => expr.visible && expr.expression.trim())
                  .map(expr => {
                    // Only calculate intercepts if showIntercepts is enabled
                    const { intercepts } = expr.showIntercepts ? findCriticalPoints(expr.expression) : { intercepts: [] };
                    return (
                      <div key={expr.id} className="text-sm">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: expr.color }}
                          />
                          <span className="font-mono">{expr.expression}</span>
                        </div>
                        {expr.showIntercepts && intercepts.length > 0 && (
                          <div className="ml-5 text-gray-600 dark:text-gray-400">
                            Intercepts: {intercepts.map(pt =>
                              `(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`
                            ).join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphingCalculatorTool;
