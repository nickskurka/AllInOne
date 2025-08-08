/**
 * GraphCanvas.jsx
 * Interactive graph canvas with zooming, panning, and function plotting
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';

const GraphCanvas = ({
  expressions,
  viewport,
  gridSettings,
  onZoomIn,
  onZoomOut,
  onPan,
  generatePlotPoints,
  findCriticalPoints,
  getGridStep,
  validateExpression
}) => {
  const canvasRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCoordinates, setShowCoordinates] = useState(false);

  // Canvas dimensions
  const width = 800;
  const height = 600;

  // Convert world coordinates to screen coordinates
  const worldToScreen = useCallback((worldX, worldY) => {
    const screenX = ((worldX - viewport.xMin) / (viewport.xMax - viewport.xMin)) * width;
    const screenY = height - ((worldY - viewport.yMin) / (viewport.yMax - viewport.yMin)) * height;
    return { x: screenX, y: screenY };
  }, [viewport, width, height]);

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((screenX, screenY) => {
    const worldX = viewport.xMin + (screenX / width) * (viewport.xMax - viewport.xMin);
    const worldY = viewport.yMin + ((height - screenY) / height) * (viewport.yMax - viewport.yMin);
    return { x: worldX, y: worldY };
  }, [viewport, width, height]);

  // Draw grid and axes
  const drawGrid = useCallback((ctx) => {
    if (!gridSettings.showGrid && !gridSettings.showAxes) return;

    const gridStep = getGridStep; // Fixed: use as value, not function call
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;

    // Draw vertical grid lines
    if (gridSettings.showGrid) {
      for (let x = Math.ceil(viewport.xMin / gridStep) * gridStep; x <= viewport.xMax; x += gridStep) {
        const screenPos = worldToScreen(x, 0);
        ctx.beginPath();
        ctx.moveTo(screenPos.x, 0);
        ctx.lineTo(screenPos.x, height);
        ctx.stroke();
      }

      // Draw horizontal grid lines
      for (let y = Math.ceil(viewport.yMin / gridStep) * gridStep; y <= viewport.yMax; y += gridStep) {
        const screenPos = worldToScreen(0, y);
        ctx.beginPath();
        ctx.moveTo(0, screenPos.y);
        ctx.lineTo(width, screenPos.y);
        ctx.stroke();
      }
    }

    // Draw axes
    if (gridSettings.showAxes) {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;

      // X-axis
      if (viewport.yMin <= 0 && viewport.yMax >= 0) {
        const yAxisScreen = worldToScreen(0, 0).y;
        ctx.beginPath();
        ctx.moveTo(0, yAxisScreen);
        ctx.lineTo(width, yAxisScreen);
        ctx.stroke();
      }

      // Y-axis
      if (viewport.xMin <= 0 && viewport.xMax >= 0) {
        const xAxisScreen = worldToScreen(0, 0).x;
        ctx.beginPath();
        ctx.moveTo(xAxisScreen, 0);
        ctx.lineTo(xAxisScreen, height);
        ctx.stroke();
      }
    }

    // Draw labels
    if (gridSettings.showLabels) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // X-axis labels
      for (let x = Math.ceil(viewport.xMin / gridStep) * gridStep; x <= viewport.xMax; x += gridStep) {
        if (Math.abs(x) < 1e-10) continue; // Skip zero
        const screenPos = worldToScreen(x, 0);
        if (screenPos.x >= 0 && screenPos.x <= width) {
          const label = Math.abs(x) < 1e-10 ? '0' : x.toFixed(1).replace(/\.0$/, '');
          const yPos = viewport.yMin <= 0 && viewport.yMax >= 0
            ? worldToScreen(0, 0).y + 15
            : height - 5;
          ctx.fillText(label, screenPos.x, Math.min(yPos, height - 5));
        }
      }

      // Y-axis labels
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let y = Math.ceil(viewport.yMin / gridStep) * gridStep; y <= viewport.yMax; y += gridStep) {
        if (Math.abs(y) < 1e-10) continue; // Skip zero
        const screenPos = worldToScreen(0, y);
        if (screenPos.y >= 0 && screenPos.y <= height) {
          const label = Math.abs(y) < 1e-10 ? '0' : y.toFixed(1).replace(/\.0$/, '');
          const xPos = viewport.xMin <= 0 && viewport.xMax >= 0
            ? worldToScreen(0, 0).x - 10
            : 5;
          ctx.fillText(label, Math.max(xPos, 35), screenPos.y);
        }
      }
    }
  }, [viewport, gridSettings, getGridStep, worldToScreen, width, height]);

  // Draw function plot
  const drawFunction = useCallback((ctx, expression) => {
    console.log('drawFunction called with:', expression);

    if (!expression.visible || !expression.expression.trim()) {
      console.log('Expression not visible or empty:', expression.visible, expression.expression);
      return;
    }

    if (typeof validateExpression !== 'function') {
      console.error('validateExpression is not a function in drawFunction');
      return;
    }

    const validation = validateExpression(expression.expression);
    if (!validation.valid) {
      console.log('Expression validation failed:', validation);
      return;
    }

    // Regular function plotting only
    const points = generatePlotPoints(expression.expression);
    console.log('Generated points:', points.length, 'points');
    console.log('First 5 points:', points.slice(0, 5));

    if (points.length === 0) {
      console.log('No points generated for expression');
      return;
    }

    console.log('Viewport:', viewport);
    console.log('Canvas dimensions:', width, height);

    ctx.strokeStyle = expression.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let pathStarted = false;
    let pointsDrawn = 0;

    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      if (point === null) {
        if (pathStarted) {
          ctx.stroke();
          pathStarted = false;
        }
        continue;
      }

      const screenPos = worldToScreen(point.x, point.y);

      // Log first few screen positions for debugging
      if (i < 5) {
        console.log(`Point ${i}: world(${point.x}, ${point.y}) -> screen(${screenPos.x}, ${screenPos.y})`);
      }

      if (screenPos.x >= -50 && screenPos.x <= width + 50 &&
          screenPos.y >= -50 && screenPos.y <= height + 50) {

        if (!pathStarted) {
          console.log('Starting path at screen position:', screenPos);
          ctx.beginPath();
          ctx.moveTo(screenPos.x, screenPos.y);
          pathStarted = true;
          pointsDrawn++;
        } else {
          ctx.lineTo(screenPos.x, screenPos.y);
          pointsDrawn++;
        }
      } else if (pathStarted) {
        ctx.stroke();
        pathStarted = false;
      }
    }

    if (pathStarted) {
      ctx.stroke();
      console.log(`Function drawn successfully with ${pointsDrawn} points`);
    } else {
      console.log(`No path was drawn. Points processed: ${pointsDrawn}`);
    }
  }, [worldToScreen, generatePlotPoints, validateExpression, width, height, viewport]);

  // Draw critical points
  const drawCriticalPoints = useCallback((ctx, expression) => {
    if (!expression.visible || !expression.expression.trim() || !expression.showIntercepts) return;

    if (typeof validateExpression !== 'function') {
      console.error('validateExpression is not a function in drawCriticalPoints');
      return;
    }

    const validation = validateExpression(expression.expression);
    if (!validation.valid) return;

    const { intercepts } = findCriticalPoints(expression.expression);

    intercepts.forEach(point => {
      const screenPos = worldToScreen(point.x, point.y);

      if (screenPos.x >= 0 && screenPos.x <= width &&
          screenPos.y >= 0 && screenPos.y <= height) {

        ctx.fillStyle = expression.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw label
        ctx.fillStyle = '#374151';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`,
          screenPos.x,
          screenPos.y - 10
        );
      }
    });
  }, [worldToScreen, findCriticalPoints, validateExpression, width, height]);

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas ref not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Canvas context not found');
      return;
    }

    console.log('Rendering canvas...');

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid and axes
    drawGrid(ctx);

    // Draw functions
    console.log('Drawing expressions:', expressions);
    expressions.forEach(expr => {
      console.log('Processing expression:', expr);
      drawFunction(ctx, expr);
      drawCriticalPoints(ctx, expr);
    });

    // Draw crosshairs
    if (showCoordinates) {
      const worldCoords = screenToWorld(mousePos.x, mousePos.y);

      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, height);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(width, mousePos.y);
      ctx.stroke();

      ctx.setLineDash([]);

      // Coordinate label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const label = `(${worldCoords.x.toFixed(2)}, ${worldCoords.y.toFixed(2)})`;
      const labelX = Math.min(mousePos.x + 10, width - 100);
      const labelY = Math.max(mousePos.y - 20, 0);

      // Label background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(labelX - 5, labelY - 2, 90, 18);

      ctx.fillStyle = '#374151';
      ctx.fillText(label, labelX, labelY);
    }
  }, [expressions, drawGrid, drawFunction, drawCriticalPoints, showCoordinates, mousePos, screenToWorld, width, height]);

  // Event handlers
  const handleMouseDown = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setIsMouseDown(true);
    setLastMousePos(pos);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setMousePos(pos);

    if (isMouseDown) {
      // Pan the graph
      const dx = -(pos.x - lastMousePos.x) * (viewport.xMax - viewport.xMin) / width;
      const dy = (pos.y - lastMousePos.y) * (viewport.yMax - viewport.yMin) / height;
      onPan(dx, dy);
      setLastMousePos(pos);
    }
  }, [isMouseDown, lastMousePos, onPan, viewport, width, height]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldCoords = screenToWorld(mouseX, mouseY);

    if (e.deltaY < 0) {
      onZoomIn(worldCoords.x, worldCoords.y);
    } else {
      onZoomOut(worldCoords.x, worldCoords.y);
    }
  }, [onZoomIn, onZoomOut, screenToWorld]);

  const handleDoubleClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    const worldPos = screenToWorld(pos.x, pos.y);

    // Reset viewport to center on clicked point
    const centerX = (viewport.xMax + viewport.xMin) / 2;
    const centerY = (viewport.yMax + viewport.yMin) / 2;
    onPan(centerX - worldPos.x, centerY - worldPos.y);
  }, [onPan, screenToWorld, viewport]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setShowCoordinates(!showCoordinates);
  }, [showCoordinates]);

  const handleMouseEnter = useCallback(() => {
    setShowCoordinates(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowCoordinates(false);
    setIsMouseDown(false);
  }, []);

  // Initialize canvas and render
  useEffect(() => {
    render();
  }, [render]);

  // Register event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('dblclick', handleDoubleClick);
    canvas.addEventListener('contextmenu', handleContextMenu);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('dblclick', handleDoubleClick);
      canvas.removeEventListener('contextmenu', handleContextMenu);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, handleDoubleClick, handleContextMenu, handleMouseEnter, handleMouseLeave]);

  useEffect(() => {
    if (typeof validateExpression !== 'function') {
      // eslint-disable-next-line no-console
      console.error('validateExpression prop is not a function!');
    }
  }, [validateExpression]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

export default GraphCanvas;
