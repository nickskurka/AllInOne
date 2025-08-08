/**
 * LoanCalculatorTool.jsx
 * Comprehensive Loan Amortization Calculator with charts and export functionality
 */

import React, { useState, useRef } from 'react';
import { Calculator, Download, Copy, TrendingDown, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAmortizationSchedule } from '../hooks/useAmortizationSchedule';

const LoanCalculatorTool = () => {
  const [inputs, setInputs] = useState({
    loanAmount: 300000,
    downPayment: 60000,
    interestRate: 6.5,
    loanTerm: 30,
    termUnit: 'years',
    paymentFrequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    paymentType: 'EOP',
    extraPayment: 0
  });

  const [showCharts, setShowCharts] = useState(true);
  const [activeChart, setActiveChart] = useState('balance');
  const tableRef = useRef(null);

  const { payments, summary, isCalculating } = useAmortizationSchedule(inputs);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: field.includes('Amount') || field.includes('Payment') || field === 'interestRate' || field === 'loanTerm'
        ? parseFloat(value) || 0
        : value
    }));
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!payments.length) return;

    const headers = ['Payment #', 'Date', 'Principal Paid', 'Interest Paid', 'Total Payment', 'Remaining Balance', 'Cumulative Interest'];
    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        payment.paymentNumber,
        payment.date,
        payment.principalPaid,
        payment.interestPaid,
        payment.totalPayment,
        payment.remainingBalance,
        payment.cumulativeInterest
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan_amortization_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Copy summary to clipboard
  const copySummary = async () => {
    if (!summary) return;

    const summaryText = `
Loan Summary:
Loan Amount: $${summary.principal.toLocaleString()}
Total Interest: $${summary.totalInterestPaid.toLocaleString()}
Total Amount Paid: $${summary.totalAmountPaid.toLocaleString()}
Monthly Payment: $${summary.monthlyPayment.toLocaleString()}
Payoff Date: ${summary.payoffDate}
Interest as % of Principal: ${summary.interestPercentage}%
    `.trim();

    try {
      await navigator.clipboard.writeText(summaryText);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  // Prepare chart data
  const chartData = payments.map((payment, index) => ({
    paymentNumber: payment.paymentNumber,
    remainingBalance: payment.remainingBalance,
    principalPaid: payment.principalPaid,
    interestPaid: payment.interestPaid,
    cumulativeInterest: payment.cumulativeInterest
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Calculator className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Loan Amortization Calculator</h1>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Loan Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">Loan Amount</label>
            <input
              type="number"
              value={inputs.loanAmount}
              onChange={(e) => handleInputChange('loanAmount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="300000"
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium mb-2">Down Payment (Optional)</label>
            <input
              type="number"
              value={inputs.downPayment}
              onChange={(e) => handleInputChange('downPayment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="60000"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={inputs.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="6.5"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium mb-2">Loan Term</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={inputs.loanTerm}
                onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="30"
              />
              <select
                value={inputs.termUnit}
                onChange={(e) => handleInputChange('termUnit', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          {/* Payment Frequency */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Frequency</label>
            <select
              value={inputs.paymentFrequency}
              onChange={(e) => handleInputChange('paymentFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Timing</label>
            <select
              value={inputs.paymentType}
              onChange={(e) => handleInputChange('paymentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="EOP">End of Period</option>
              <option value="BOP">Beginning of Period</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={inputs.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Extra Payment */}
          <div>
            <label className="block text-sm font-medium mb-2">Extra Payment (Optional)</label>
            <input
              type="number"
              value={inputs.extraPayment}
              onChange={(e) => handleInputChange('extraPayment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Loan Summary</h2>
            <button
              onClick={copySummary}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Principal</div>
              <div className="text-2xl font-bold text-blue-600">${summary.principal.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Interest</div>
              <div className="text-2xl font-bold text-red-600">${summary.totalInterestPaid.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${summary.totalAmountPaid.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Payment Amount</div>
              <div className="text-2xl font-bold text-green-600">${summary.monthlyPayment.toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Payoff Date</div>
              <div className="text-lg font-semibold">{summary.payoffDate}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Interest as % of Principal</div>
              <div className="text-lg font-semibold">{summary.interestPercentage}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {summary && payments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Visualizations</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveChart('balance')}
                className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                  activeChart === 'balance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                <span>Balance</span>
              </button>
              <button
                onClick={() => setActiveChart('payments')}
                className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                  activeChart === 'payments'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Payments</span>
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'balance' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="paymentNumber"
                    label={{ value: 'Payment Number', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Remaining Balance']}
                    labelFormatter={(label) => `Payment #${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="remainingBalance"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Remaining Balance"
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData.slice(0, Math.min(chartData.length, 50))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="paymentNumber"
                    label={{ value: 'Payment Number', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                    labelFormatter={(label) => `Payment #${label}`}
                  />
                  <Legend />
                  <Bar dataKey="principalPaid" stackId="a" fill="#10B981" name="Principal" />
                  <Bar dataKey="interestPaid" stackId="a" fill="#EF4444" name="Interest" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Amortization Table */}
      {payments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Amortization Schedule</h2>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto" ref={tableRef}>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Payment #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Principal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Remaining Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.paymentNumber} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {payment.paymentNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        ${payment.principalPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        ${payment.interestPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                        ${payment.totalPayment.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ${payment.remainingBalance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isCalculating && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
          <div className="text-gray-500 dark:text-gray-400">Calculating amortization schedule...</div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculatorTool;
