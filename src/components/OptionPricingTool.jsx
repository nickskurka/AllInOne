/**
 * OptionPricingTool.jsx
 * Professional Option Pricing Tool with Black-Scholes pricing and Greeks
 */

import React, { useState } from 'react';
import { Calculator, Info, ChevronDown, ChevronUp, Settings, TrendingUp, Target, HelpCircle, BarChart3, Eye, EyeOff } from 'lucide-react';
import { useOptionPricing } from '../hooks/useOptionPricing';
import { useOptionLadder } from '../hooks/useOptionLadder';
import OptionChart from './OptionChart';

const OptionPricingTool = () => {
  const {
    parameters,
    updateParameter,
    results,
    validation,
    calculateOptionPrice,
    calculateGreeks
  } = useOptionPricing();

  const {
    ladderConfig,
    updateLadderConfig,
    isExpanded,
    setIsExpanded,
    availableGreeks,
    toggleGreek,
    generateLadder,
    ladderValidation,
    formatExpiration,
    formatPrice,
    formatPercentage
  } = useOptionLadder(calculateOptionPrice, calculateGreeks);

  // Chart expansion state
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  // Format number for display
  const formatNumber = (num, decimals = 2) => {
    if (isNaN(num) || !isFinite(num)) return 'N/A';
    return num.toFixed(decimals);
  };

  // Compact input field component
  const CompactInput = ({ label, value, onChange, tooltip, suffix = '', type = 'number', step = 'any' }) => (
    <div className="space-y-1">
      <div className="flex items-center space-x-1">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <input
          type={type}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent font-mono"
        />
        {suffix && (
          <span className="absolute right-2 top-1 text-xs text-gray-500">{suffix}</span>
        )}
      </div>
    </div>
  );

  // Generate ladder data
  const ladderData = isExpanded ? generateLadder(parameters) : [];

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Option Pricing Tool</h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Black-Scholes pricing with Greeks analysis and option chain generator
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* 🔧 Input Parameters Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
            Input Parameters
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <CompactInput
              label="Stock Price (S₀)"
              value={parameters.S}
              onChange={(value) => updateParameter('S', value)}
              tooltip="Current stock price"
              suffix="$"
            />
            <CompactInput
              label="Strike Price (K)"
              value={parameters.K}
              onChange={(value) => updateParameter('K', value)}
              tooltip="Exercise price"
              suffix="$"
            />
            <CompactInput
              label="Time (T)"
              value={parameters.T}
              onChange={(value) => updateParameter('T', value)}
              tooltip="Years to expiration"
              suffix="yr"
              step="0.01"
            />
            <CompactInput
              label="Volatility (σ)"
              value={parameters.sigma}
              onChange={(value) => updateParameter('sigma', value)}
              tooltip="Annual volatility (decimal)"
              step="0.01"
            />
            <CompactInput
              label="Risk-free Rate (r)"
              value={parameters.r}
              onChange={(value) => updateParameter('r', value)}
              tooltip="Risk-free rate (decimal)"
              step="0.001"
            />
            <CompactInput
              label="Dividend Yield (q)"
              value={parameters.q}
              onChange={(value) => updateParameter('q', value)}
              tooltip="Dividend yield (decimal)"
              step="0.001"
            />
          </div>

          {/* Validation Errors */}
          {!validation.isValid && (
            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs">
              <div className="font-medium text-red-800 dark:text-red-200 mb-1">Errors:</div>
              <ul className="text-red-700 dark:text-red-300 space-y-0.5">
                {validation.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 💵 Option Prices Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
            Option Prices
          </h2>

          {validation.isValid ? (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Call Option</span>
                  <span className="text-lg font-bold font-mono text-green-900 dark:text-green-100">
                    {formatPrice(results.callPrice)}
                  </span>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">Right to buy</div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">Put Option</span>
                  <span className="text-lg font-bold font-mono text-red-900 dark:text-red-100">
                    {formatPrice(results.putPrice)}
                  </span>
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">Right to sell</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
              Fix input errors to see prices
            </div>
          )}
        </div>

        {/* 📊 Greeks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
            The Greeks
          </h2>

          {validation.isValid ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1">
                <span>Greek</span>
                <span className="text-center">Call</span>
                <span className="text-center">Put</span>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="font-sans">Delta</span>
                  <span className="text-center">{formatNumber(results.callDelta, 3)}</span>
                  <span className="text-center">{formatNumber(results.putDelta, 3)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1 bg-gray-50 dark:bg-gray-700/50">
                  <span className="font-sans">Gamma</span>
                  <span className="text-center">{formatNumber(results.gamma, 4)}</span>
                  <span className="text-center">{formatNumber(results.gamma, 4)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="font-sans">Theta</span>
                  <span className="text-center">{formatNumber(results.callTheta, 3)}</span>
                  <span className="text-center">{formatNumber(results.putTheta, 3)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1 bg-gray-50 dark:bg-gray-700/50">
                  <span className="font-sans">Vega</span>
                  <span className="text-center">{formatNumber(results.vega, 3)}</span>
                  <span className="text-center">{formatNumber(results.vega, 3)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="font-sans">Rho</span>
                  <span className="text-center">{formatNumber(results.callRho, 3)}</span>
                  <span className="text-center">{formatNumber(results.putRho, 3)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
              Fix input errors to see Greeks
            </div>
          )}
        </div>
      </div>

      {/* 📉 Option Ladder (Chain) Section */}
      {validation.isValid && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Option Chain</h2>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
            >
              <span>{isExpanded ? 'Hide' : 'Show'}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {isExpanded && (
            <div className="space-y-4">
              {/* Compact Configuration */}
              <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  {/* Mode Selection */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Type</label>
                    <div className="flex space-x-2 text-xs">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={ladderConfig.mode === 'strike'}
                          onChange={() => updateLadderConfig('mode', 'strike')}
                          className="mr-1"
                        />
                        <span>Strikes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={ladderConfig.mode === 'expiration'}
                          onChange={() => updateLadderConfig('mode', 'expiration')}
                          className="mr-1"
                        />
                        <span>Expirations</span>
                      </label>
                    </div>
                  </div>

                  {/* Range Configuration */}
                  {ladderConfig.mode === 'strike' ? (
                    <>
                      <CompactInput
                        label="Min Strike"
                        value={ladderConfig.strikeMin}
                        onChange={(value) => updateLadderConfig('strikeMin', parseFloat(value) || 0)}
                        suffix="$"
                      />
                      <CompactInput
                        label="Max Strike"
                        value={ladderConfig.strikeMax}
                        onChange={(value) => updateLadderConfig('strikeMax', parseFloat(value) || 0)}
                        suffix="$"
                      />
                      <CompactInput
                        label="Step"
                        value={ladderConfig.strikeStep}
                        onChange={(value) => updateLadderConfig('strikeStep', parseFloat(value) || 1)}
                        suffix="$"
                      />
                    </>
                  ) : (
                    <>
                      <CompactInput
                        label="Min Time"
                        value={ladderConfig.expirationMin}
                        onChange={(value) => updateLadderConfig('expirationMin', parseFloat(value) || 0)}
                        suffix="yr"
                        step="0.1"
                      />
                      <CompactInput
                        label="Max Time"
                        value={ladderConfig.expirationMax}
                        onChange={(value) => updateLadderConfig('expirationMax', parseFloat(value) || 0)}
                        suffix="yr"
                        step="0.1"
                      />
                      <CompactInput
                        label="Step"
                        value={ladderConfig.expirationStep}
                        onChange={(value) => updateLadderConfig('expirationStep', parseFloat(value) || 0.1)}
                        suffix="yr"
                        step="0.1"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Greek Selection Toggles */}
              <div className="border border-gray-200 dark:border-gray-700 rounded p-3">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Greeks to Display
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGreeks.map(greek => (
                    <button
                      key={greek.key}
                      onClick={() => toggleGreek(greek.key)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                        ladderConfig.visibleGreeks.includes(greek.key)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-700'
                          : 'bg-gray-100 text-gray-600 border border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                      }`}
                    >
                      {ladderConfig.visibleGreeks.includes(greek.key) ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      <span>{greek.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option Chain Table */}
              {ladderData.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {/* Call columns */}
                          <th className="px-2 py-2 text-center border-r border-gray-200 dark:border-gray-600 font-semibold text-green-700 dark:text-green-400" colSpan={2 + ladderConfig.visibleGreeks.length}>
                            Calls
                          </th>
                          {/* Strike/Expiration column */}
                          <th className="px-2 py-2 text-center border-r border-gray-200 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300">
                            {ladderConfig.mode === 'strike' ? 'Strike' : 'Expiration'}
                          </th>
                          {/* Put columns */}
                          <th className="px-2 py-2 text-center font-semibold text-red-700 dark:text-red-400" colSpan={2 + ladderConfig.visibleGreeks.length}>
                            Puts
                          </th>
                        </tr>
                        <tr className="text-xs text-gray-600 dark:text-gray-400">
                          {/* Call sub-headers */}
                          {ladderConfig.visibleGreeks.map(greek => {
                            const greekInfo = availableGreeks.find(g => g.key === greek);
                            return (
                              <th key={greek} className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">
                                {greekInfo?.label}
                              </th>
                            );
                          })}
                          <th className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">IV</th>
                          <th className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">Price</th>
                          {/* Center column */}
                          <th className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600 font-semibold">
                            {ladderConfig.mode === 'strike' ? '$' : 'Years'}
                          </th>
                          {/* Put sub-headers */}
                          <th className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">
                            Price
                          </th>
                          <th className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">
                            IV
                          </th>
                          {ladderConfig.visibleGreeks.map(greek => {
                            const greekInfo = availableGreeks.find(g => g.key === greek);
                            return (
                              <th key={greek} className="px-2 py-1 text-center">
                                {greekInfo?.label}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {ladderData.map((row, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}>
                                {/* Call Greeks (outermost) */}
                                {ladderConfig.visibleGreeks.map(greek => {
                                  const greekInfo = availableGreeks.find(g => g.key === greek);
                                  return (
                                    <td key={greek} className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">
                                      {greekInfo?.format(row.call[greek]) || 'N/A'}
                                    </td>
                                  );
                                })}
                                {/* Call IV */}
                                <td className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">
                                  {formatPercentage(row.call.impliedVol)}
                                </td>
                                {/* Call Price (closest to center) */}
                                <td className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">
                                  {formatPrice(row.call.price)}
                                </td>
                                {/* Strike/Expiration (center) */}
                                <td className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600 font-semibold bg-gray-100 dark:bg-gray-700">
                                  {ladderConfig.mode === 'strike' ? `$${row.strike}` : `${row.expiration.toFixed(2)}y`}
                                </td>
                                {/* Put Price (closest to center) */}
                                <td className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">
                                  {formatPrice(row.put.price)}
                                </td>
                                {/* Put IV */}
                                <td className="px-2 py-1 text-center border-r border-gray-200 dark:border-gray-600">
                                  {formatPercentage(row.put.impliedVol)}
                                </td>
                                {/* Put Greeks (outermost) */}
                                {ladderConfig.visibleGreeks.map(greek => {
                                  const greekInfo = availableGreeks.find(g => g.key === greek);
                                  return (
                                    <td key={greek} className="px-2 py-1 text-center">
                                      {greekInfo?.format(row.put[greek]) || 'N/A'}
                                    </td>
                                  );
                                })}
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 📊 Expandable Chart Section */}
              {ladderData.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-orange-600" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Price Chart</h3>
                    </div>
                    <button
                      onClick={() => setIsChartExpanded(!isChartExpanded)}
                      className="flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-all duration-200"
                    >
                      <span>{isChartExpanded ? 'Hide Chart' : 'Show Chart'}</span>
                      {isChartExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Animated Chart Expansion */}
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isChartExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {isChartExpanded && (
                      <OptionChart
                        data={ladderData}
                        mode={ladderConfig.mode}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OptionPricingTool;

