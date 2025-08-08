/**
 * useGraphingEngine.js
 * Custom hook for mathematical expression parsing, evaluation, and graph plotting
 */

import { useState, useCallback, useMemo } from 'react';
import { evaluate, parse, compile } from 'mathjs';

export const useGraphingEngine = () => {
  const [expressions, setExpressions] = useState([
    { id: 1, expression: 'sin(x)', color: '#3B82F6', visible: true, showIntercepts: false }
  ]);
  const [viewport, setViewport] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  });
  const [gridSettings, setGridSettings] = useState({
    showGrid: true,
    showAxes: true,
    showLabels: true,
    gridStep: 1
  });

  // Add new expression
  const addExpression = useCallback(() => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    const newId = Math.max(...expressions.map(e => e.id), 0) + 1;
    const color = colors[(expressions.length) % colors.length];

    setExpressions(prev => [...prev, {
      id: newId,
      expression: '',
      color,
      visible: true,
      showIntercepts: false
    }]);
  }, [expressions]);

  // Update expression
  const updateExpression = useCallback((id, newExpression) => {
    setExpressions(prev => prev.map(expr =>
      expr.id === id ? { ...expr, expression: newExpression } : expr
    ));
  }, []);

  // Remove expression
  const removeExpression = useCallback((id) => {
    setExpressions(prev => prev.filter(expr => expr.id !== id));
  }, []);

  // Toggle expression visibility
  const toggleExpression = useCallback((id) => {
    setExpressions(prev => prev.map(expr =>
      expr.id === id ? { ...expr, visible: !expr.visible } : expr
    ));
  }, []);

  // Toggle intercept display
  const toggleIntercepts = useCallback((id) => {
    setExpressions(prev => prev.map(expr =>
      expr.id === id ? { ...expr, showIntercepts: !expr.showIntercepts } : expr
    ));
  }, []);

  // Change expression color
  const changeExpressionColor = useCallback((id, color) => {
    setExpressions(prev => prev.map(expr =>
      expr.id === id ? { ...expr, color } : expr
    ));
  }, []);

  // Parse and validate expression
  const validateExpression = useCallback((expression) => {
    console.log('validateExpression called with:', expression);

    try {
      if (!expression.trim()) {
        console.log('validateExpression: empty expression');
        return { valid: false, error: 'Empty expression' };
      }

      // Replace common symbols
      let processedExpr = expression
        .replace(/π/g, 'pi')
        .replace(/∞/g, 'Infinity')
        .replace(/√/g, 'sqrt')
        .replace(/\|([^|]+)\|/g, 'abs($1)');

      console.log('validateExpression: processed expression:', processedExpr);

      // Test compilation with basic math
      const compiled = compile(processedExpr);
      const testResult = compiled.evaluate({ x: 1 });
      console.log('validateExpression: test evaluation result:', testResult);

      const result = {
        valid: true,
        compiled,
        processedExpr,
        isInequality: false
      };

      console.log('validateExpression: returning:', result);
      return result;
    } catch (error) {
      console.log('validateExpression: error:', error);
      return { valid: false, error: error.message };
    }
  }, []);

  // Evaluate expression at point
  const evaluateAt = useCallback((expression, x) => {
    try {
      const validation = validateExpression(expression);
      if (!validation.valid) return null;

      const result = validation.compiled.evaluate({ x });
      return typeof result === 'number' && isFinite(result) ? result : null;
    } catch {
      return null;
    }
  }, [validateExpression]);

  // Generate plot points for expression
  const generatePlotPoints = useCallback((expression, numPoints = 500) => {
    console.log('generatePlotPoints called with:', expression);

    const validation = validateExpression(expression);
    console.log('generatePlotPoints validation:', validation);

    if (!validation.valid) {
      console.log('generatePlotPoints: validation failed');
      return [];
    }

    const points = [];
    const step = (viewport.xMax - viewport.xMin) / numPoints;
    console.log('generatePlotPoints: viewport', viewport, 'step', step);

    for (let i = 0; i <= numPoints; i++) {
      const x = viewport.xMin + i * step;
      const y = evaluateAt(expression, x);

      if (y !== null && Math.abs(y) < 1e10) { // Prevent extreme values
        points.push({ x, y });
      } else if (points.length > 0) {
        // Add discontinuity marker
        points.push(null);
      }
    }

    console.log('generatePlotPoints: generated', points.length, 'points');
    console.log('First few points:', points.slice(0, 5));
    return points;
  }, [viewport, validateExpression, evaluateAt]);

  // Find function intercepts and extrema
  const findCriticalPoints = useCallback((expression) => {
    const validation = validateExpression(expression);
    if (!validation.valid) return { intercepts: [], extrema: [] };

    const points = [];
    const step = (viewport.xMax - viewport.xMin) / 1000;

    // Find approximate x-intercepts
    const intercepts = [];
    let prevY = null;

    for (let x = viewport.xMin; x <= viewport.xMax; x += step) {
      const y = evaluateAt(expression, x);
      if (y !== null && prevY !== null) {
        // Sign change indicates intercept
        if ((y > 0 && prevY < 0) || (y < 0 && prevY > 0)) {
          // Refine with binary search
          let left = x - step, right = x;
          for (let i = 0; i < 10; i++) {
            const mid = (left + right) / 2;
            const midY = evaluateAt(expression, mid);
            if (midY === null) break;

            if ((midY > 0 && prevY < 0) || (midY < 0 && prevY > 0)) {
              right = mid;
            } else {
              left = mid;
            }
          }
          const interceptX = (left + right) / 2;
          const interceptY = evaluateAt(expression, interceptX);
          if (interceptY !== null && Math.abs(interceptY) < 0.1) {
            intercepts.push({ x: interceptX, y: interceptY, type: 'x-intercept' });
          }
        }
      }
      prevY = y;
    }

    // Find y-intercept
    const yIntercept = evaluateAt(expression, 0);
    if (yIntercept !== null &&
        0 >= viewport.xMin && 0 <= viewport.xMax &&
        yIntercept >= viewport.yMin && yIntercept <= viewport.yMax) {
      intercepts.push({ x: 0, y: yIntercept, type: 'y-intercept' });
    }

    return { intercepts, extrema: [] }; // Extrema finding would be more complex
  }, [viewport, validateExpression, evaluateAt]);

  // Zoom functions
  const zoomIn = useCallback((centerX = 0, centerY = 0) => {
    const factor = 0.7;
    const width = viewport.xMax - viewport.xMin;
    const height = viewport.yMax - viewport.yMin;

    setViewport({
      xMin: centerX - (width * factor) / 2,
      xMax: centerX + (width * factor) / 2,
      yMin: centerY - (height * factor) / 2,
      yMax: centerY + (height * factor) / 2
    });
  }, [viewport]);

  const zoomOut = useCallback((centerX = 0, centerY = 0) => {
    const factor = 1.4;
    const width = viewport.xMax - viewport.xMin;
    const height = viewport.yMax - viewport.yMin;

    setViewport({
      xMin: centerX - (width * factor) / 2,
      xMax: centerX + (width * factor) / 2,
      yMin: centerY - (height * factor) / 2,
      yMax: centerY + (height * factor) / 2
    });
  }, [viewport]);

  const resetZoom = useCallback(() => {
    setViewport({
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10
    });
  }, []);

  const panViewport = useCallback((deltaX, deltaY) => {
    setViewport(prev => ({
      xMin: prev.xMin + deltaX,
      xMax: prev.xMax + deltaX,
      yMin: prev.yMin + deltaY,
      yMax: prev.yMax + deltaY
    }));
  }, []);

  // Get smart grid step
  const getGridStep = useMemo(() => {
    const width = viewport.xMax - viewport.xMin;
    const steps = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
    const targetSteps = 10;
    const idealStep = width / targetSteps;

    return steps.find(step => step >= idealStep) || steps[steps.length - 1];
  }, [viewport]);

  return {
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
    evaluateAt,
    generatePlotPoints,
    findCriticalPoints,
    zoomIn,
    zoomOut,
    resetZoom,
    panViewport,
    setViewport,
    setGridSettings,
    getGridStep
  };
};
