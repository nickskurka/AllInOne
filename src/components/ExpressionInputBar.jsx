/**
 * ExpressionInputBar.jsx
 * Math expression input with syntax highlighting and symbol buttons
 */

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Eye, EyeOff, Trash2 } from 'lucide-react';

const ExpressionInputBar = ({
  expressions,
  onAdd,
  onUpdate,
  onRemove,
  onToggle,
  onToggleIntercepts,
  onColorChange,
  validateExpression
}) => {
  const [focusedId, setFocusedId] = useState(null);

  // Math symbols for quick input
  const mathSymbols = [
    { symbol: 'π', text: 'pi', label: 'Pi' },
    { symbol: 'e', text: 'e', label: 'Euler\'s number' },
    { symbol: '√', text: 'sqrt()', label: 'Square root' },
    { symbol: 'x²', text: '^2', label: 'Power of 2' },
    { symbol: 'xⁿ', text: '^', label: 'Power' },
    { symbol: '|x|', text: 'abs()', label: 'Absolute value' },
    { symbol: 'sin', text: 'sin()', label: 'Sine' },
    { symbol: 'cos', text: 'cos()', label: 'Cosine' },
    { symbol: 'tan', text: 'tan()', label: 'Tangent' },
    { symbol: 'ln', text: 'ln()', label: 'Natural log' },
    { symbol: 'log', text: 'log()', label: 'Base 10 log' },
    { symbol: '∞', text: 'Infinity', label: 'Infinity' }
  ];

  // Color options for expressions
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  // Insert symbol at cursor position
  const insertSymbol = (expressionId, symbolText) => {
    const input = document.getElementById(`expr-input-${expressionId}`);
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const currentValue = input.value;

    let newValue = currentValue.substring(0, start) + symbolText + currentValue.substring(end);
    let newCursorPos = start + symbolText.length;

    // Adjust cursor position for functions with parentheses
    if (symbolText.includes('()')) {
      newCursorPos = start + symbolText.indexOf('(') + 1;
    }

    onUpdate(expressionId, newValue);

    // Set cursor position after update
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Format expression for display (convert to math symbols)
  const formatExpression = (expr) => {
    return expr
      .replace(/pi/g, 'π')
      .replace(/sqrt\(/g, '√(')
      .replace(/Infinity/g, '∞')
      .replace(/\*\*/g, '^');
  };

  // Get expression validation status
  const getValidationStatus = (expression) => {
    if (!expression.trim()) return { valid: true, message: '' };
    if (typeof validateExpression !== 'function') {
      console.error('validateExpression is not a function in getValidationStatus');
      return { valid: false, message: 'Validation unavailable' };
    }
    const result = validateExpression(expression);
    return {
      valid: result.valid,
      message: result.valid ? '✓ Valid' : `Error: ${result.error}`
    };
  };

  useEffect(() => {
    if (typeof validateExpression !== 'function') {
      // eslint-disable-next-line no-console
      console.error('validateExpression prop is not a function!');
    }
  }, [validateExpression]);

  return (
    <div className="space-y-3">
      {/* Expression List */}
      <div className="space-y-2">
        {expressions.map((expr) => {
          const validation = getValidationStatus(expr.expression);

          return (
            <div key={expr.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-2">
                {/* Color picker */}
                <div className="flex space-x-1">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => onColorChange(expr.id, color)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        expr.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      title="Change color"
                    />
                  ))}
                </div>

                {/* Visibility toggle */}
                <button
                  onClick={() => onToggle(expr.id)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title={expr.visible ? 'Hide expression' : 'Show expression'}
                >
                  {expr.visible ?
                    <Eye className="w-4 h-4 text-gray-600" /> :
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  }
                </button>

                {/* Remove button */}
                {expressions.length > 1 && (
                  <button
                    onClick={() => onRemove(expr.id)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                    title="Remove expression"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Expression input */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">f(x) =</span>
                  <div className="flex-1 relative">
                    <input
                      id={`expr-input-${expr.id}`}
                      type="text"
                      value={expr.expression}
                      onChange={(e) => onUpdate(expr.id, e.target.value)}
                      onFocus={() => setFocusedId(expr.id)}
                      onBlur={() => setFocusedId(null)}
                      placeholder="Enter expression (e.g., sin(x), x^2, sqrt(x))"
                      className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono ${
                        validation.valid
                          ? 'border-gray-300 dark:border-gray-600'
                          : 'border-red-300 dark:border-red-600'
                      }`}
                    />
                    {expr.expression && (
                      <div className="absolute right-2 top-2 text-xs text-gray-500">
                        {formatExpression(expr.expression)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Validation status */}
                <div className={`text-xs ${validation.valid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.message}
                </div>

                {/* Intercept display checkbox */}
                {expr.expression.trim() && validation.valid && (
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={expr.showIntercepts || false}
                        onChange={() => onToggleIntercepts(expr.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span>Show intercepts</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Math symbol buttons (show when focused) */}
              {focusedId === expr.id && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick Insert:</div>
                  <div className="grid grid-cols-6 gap-2">
                    {mathSymbols.map((symbol) => (
                      <button
                        key={symbol.symbol}
                        onClick={() => insertSymbol(expr.id, symbol.text)}
                        className="px-2 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                        title={symbol.label}
                      >
                        {symbol.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add expression button */}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Expression</span>
      </button>

      {/* Common functions reference - make more compact */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <div className="font-medium mb-1">Common Functions:</div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-0 text-xs">
          <div>+, -, *, /, ^</div>
          <div>sin, cos, tan</div>
          <div>sqrt, ln, log</div>
          <div>abs, exp</div>
          <div>pi, e</div>
        </div>
      </div>
    </div>
  );
};

export default ExpressionInputBar;
