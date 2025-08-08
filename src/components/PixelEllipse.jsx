/**
 * PixelEllipse.jsx
 * Interactive geometric visualization tool for generating pixel-perfect circles and ellipses
 * Ported from standalone PixelEllipse project to React component
 */

import React, { useRef, useEffect, useState } from 'react';
import { Circle, Square, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const PixelEllipse = () => {
  const canvasRef = useRef(null);
  const [shapeType, setShapeType] = useState('circle');
  const [radius, setRadius] = useState(15);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(15);
  const [pixelCount, setPixelCount] = useState(0);
  const [zoom, setZoom] = useState(1.0);

  // Algorithm state
  const algorithmRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      algorithmRef.current = new PixelAlgorithm(canvasRef.current, {
        onPixelCountChange: setPixelCount,
        onZoomChange: setZoom
      });
    }
  }, []);

  useEffect(() => {
    if (algorithmRef.current) {
      algorithmRef.current.generateShape(shapeType, { radius, width, height });
    }
  }, [shapeType, radius, width, height]);

  const handleGenerate = () => {
    if (algorithmRef.current) {
      algorithmRef.current.generateShape(shapeType, { radius, width, height });
    }
  };

  const handleReset = () => {
    if (algorithmRef.current) {
      algorithmRef.current.resetView();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Circle className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold">Pixel-Perfect Circle & Ellipse Generator</h2>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset View</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Shape Type Selector */}
          <div className="content-area">
            <h3 className="text-lg font-semibold mb-3">Shape Type</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="shape"
                  value="circle"
                  checked={shapeType === 'circle'}
                  onChange={(e) => setShapeType(e.target.value)}
                  className="text-orange-600"
                />
                <Circle className="w-4 h-4" />
                <span>Circle</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="shape"
                  value="ellipse"
                  checked={shapeType === 'ellipse'}
                  onChange={(e) => setShapeType(e.target.value)}
                  className="text-orange-600"
                />
                <Square className="w-4 h-4" />
                <span>Ellipse</span>
              </label>
            </div>
          </div>

          {/* Parameters */}
          <div className="content-area">
            <h3 className="text-lg font-semibold mb-3">Parameters</h3>

            {shapeType === 'circle' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Radius: <span className="text-orange-600">{radius}</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="100"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Width: <span className="text-orange-600">{width}</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="100"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Height: <span className="text-orange-600">{height}</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="100"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              className="w-full mt-4 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Generate
            </button>
          </div>

          {/* Info Panel */}
          <div className="content-area">
            <h3 className="text-lg font-semibold mb-3">Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Pixels:</span>
                <span className="font-medium">{pixelCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Zoom:</span>
                <span className="font-medium">{zoom.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          {/* Controls Help */}
          <div className="content-area">
            <h3 className="text-lg font-semibold mb-3">Controls</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <ZoomIn className="w-3 h-3" />
                <span>Mouse wheel: Zoom in/out</span>
              </div>
              <div className="flex items-center space-x-2">
                <Square className="w-3 h-3" />
                <span>Click and drag: Pan around</span>
              </div>
              <div className="flex items-center space-x-2">
                <Circle className="w-3 h-3" />
                <span>Sliders: Real-time updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <div className="content-area p-0 overflow-hidden">
            <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-800 p-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="border border-gray-300 dark:border-gray-600 cursor-grab active:cursor-grabbing shadow-lg"
                style={{
                  imageRendering: 'pixelated',
                  imageRendering: '-moz-crisp-edges',
                  imageRendering: 'crisp-edges',
                  maxWidth: '100%',
                  maxHeight: '70vh'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="content-area">
        <h3 className="text-lg font-semibold mb-3">About This Tool</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          This application implements an algorithm for generating pixel-accurate circles and ellipses on a discrete grid,
          minimizing deviation from their ideal mathematical forms. It's useful for applications such as pixel art,
          procedural content generation (e.g., Minecraft structures), scalable raster graphics, and geometric visualization.
          The interactive interface allows you to adjust parameters and observe the resulting shapes in real time.
        </p>
      </div>
    </div>
  );
};

// Pixel Algorithm Class (adapted from original JavaScript)
class PixelAlgorithm {
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.zoom = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.pixels = [];
    this.callbacks = callbacks;

    this.searchMap = {
      1: [[1,0], [0,-1], [1,-1]], // right, down, right-down
      2: [[0,-1], [-1,0], [-1,-1]], // left, down, left-down
      3: [[0,1], [-1,0], [-1,1]], // left, up, left-up
      4: [[0,1], [1,0], [1,1]] // right, up, right-up
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.generateShape('circle', { radius: 15 });
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    this.canvas.addEventListener('contextmenu', e => e.preventDefault());
  }

  getQuadrant(x, y) {
    if (x >= 0 && y > 0) return 1;
    if (x > 0 && y <= 0) return 2;
    if (x <= 0 && y < 0) return 3;
    if (x < 0 && y >= 0) return 4;
    return 1;
  }

  getNextPixel(currentPos, width, height) {
    const [x, y] = currentPos;
    const quadrant = this.getQuadrant(x, y);
    const candidates = [];

    for (const [dx, dy] of this.searchMap[quadrant]) {
      candidates.push([x + dx, y + dy]);
    }

    let bestCandidate = candidates[0];
    let minDistance = this.ellipseDistance(bestCandidate[0], bestCandidate[1], width, height);

    for (const candidate of candidates) {
      const distance = this.ellipseDistance(candidate[0], candidate[1], width, height);
      if (distance < minDistance) {
        minDistance = distance;
        bestCandidate = candidate;
      }
    }

    return bestCandidate;
  }

  ellipseDistance(x, y, width, height) {
    const a = width / 2;
    const b = height / 2;
    return Math.abs((x * x) / (a * a) + (y * y) / (b * b) - 1);
  }

  generateEllipse(width, height) {
    const pixels = new Set();
    const a = width / 2;
    const b = height / 2;

    // Start from the rightmost point
    let currentPos = [Math.round(a), 0];
    pixels.add(currentPos.join(','));

    const maxIterations = Math.ceil(2 * Math.PI * Math.max(a, b));
    let iterations = 0;

    while (iterations < maxIterations) {
      const nextPos = this.getNextPixel(currentPos, width, height);
      const key = nextPos.join(',');

      if (pixels.has(key)) break;

      pixels.add(key);
      currentPos = nextPos;
      iterations++;

      // Stop when we've completed the shape
      if (Math.abs(nextPos[0] - Math.round(a)) < 0.1 && Math.abs(nextPos[1]) < 0.1) {
        break;
      }
    }

    // Convert back to array and apply symmetry
    const result = [];
    for (const key of pixels) {
      const [x, y] = key.split(',').map(Number);
      result.push([x, y]);

      // Add symmetric points
      if (x !== 0) result.push([-x, y]);
      if (y !== 0) result.push([x, -y]);
      if (x !== 0 && y !== 0) result.push([-x, -y]);
    }

    return result;
  }

  generateShape(shapeType, params) {
    if (shapeType === 'circle') {
      this.pixels = this.generateEllipse(params.radius * 2, params.radius * 2);
    } else {
      this.pixels = this.generateEllipse(params.width, params.height);
    }

    if (this.callbacks.onPixelCountChange) {
      this.callbacks.onPixelCountChange(this.pixels.length);
    }

    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--tw-bg-opacity') ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate grid size based on zoom
    const gridSize = Math.max(1, Math.floor(10 * this.zoom));

    // Draw grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--tw-bg-opacity') ? '#334155' : '#e2e8f0';
    ctx.lineWidth = 0.5;

    const centerX = canvas.width / 2 + this.offsetX;
    const centerY = canvas.height / 2 + this.offsetY;

    // Draw pixels
    ctx.fillStyle = '#f97316'; // Orange color
    for (const [x, y] of this.pixels) {
      const pixelX = centerX + x * gridSize;
      const pixelY = centerY - y * gridSize; // Flip Y axis
      ctx.fillRect(pixelX - gridSize/2, pixelY - gridSize/2, gridSize, gridSize);
    }

    // Draw center axes
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--tw-bg-opacity') ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    this.canvas.style.cursor = 'grabbing';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.lastMouseX;
    const deltaY = e.clientY - this.lastMouseY;

    this.offsetX += deltaX;
    this.offsetY += deltaY;

    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    this.draw();
  }

  handleMouseUp() {
    this.isDragging = false;
    this.canvas.style.cursor = 'grab';
  }

  handleWheel(e) {
    e.preventDefault();
    const zoomFactor = 1.1;

    if (e.deltaY < 0) {
      this.zoom *= zoomFactor;
    } else {
      this.zoom /= zoomFactor;
    }

    this.zoom = Math.max(0.1, Math.min(10, this.zoom));

    if (this.callbacks.onZoomChange) {
      this.callbacks.onZoomChange(this.zoom);
    }

    this.draw();
  }

  resetView() {
    this.zoom = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;

    if (this.callbacks.onZoomChange) {
      this.callbacks.onZoomChange(this.zoom);
    }

    this.draw();
  }
}

export default PixelEllipse;
