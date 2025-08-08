/**
 * SpriteGenerator.jsx
 * A comprehensive pixel art creation tool integrated into the AllInOne Dashboard
 * Features: Color wheel picker, multiple drawing tools, undo/redo, zoom, export
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from '../utils/analytics';

const SpriteGenerator = () => {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const colorWheelRef = useRef(null);
  const editorRef = useRef(null);

  // Track usage for analytics
  useEffect(() => {
    // Track tool launch
    if (window.gtag) {
      window.gtag('event', 'tool_launch', {
        tool_name: 'Sprite Generator',
        category: 'Physics Math Tools'
      });
    }
  }, []);

  // Initialize the sprite editor when component mounts
  useEffect(() => {
    if (canvasRef.current && colorWheelRef.current) {
      editorRef.current = new SpriteEditor(canvasRef.current, colorWheelRef.current, isDark);
    }

    // Cleanup on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.cleanup();
      }
    };
  }, [isDark]);

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex h-full">
        {/* Canvas Area */}
        <div className="flex-1 flex justify-center items-center p-6 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700">
          <div className="relative border-2 border-gray-400 dark:border-gray-600 rounded-xl bg-white shadow-xl overflow-hidden">
            <canvas
              ref={canvasRef}
              id="sprite-canvas"
              width="512"
              height="512"
              className="block cursor-crosshair"
              style={{
                imageRendering: 'pixelated',
                imageRendering: '-moz-crisp-edges',
                imageRendering: 'crisp-edges'
              }}
            />
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-80 bg-gray-50 dark:bg-gray-900 p-5 overflow-y-auto flex flex-col gap-5">
          {/* Color Picker Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500 rounded"></div>
              Color Picker
            </h3>
            <div className="text-center">
              <canvas
                ref={colorWheelRef}
                id="color-wheel"
                width="120"
                height="120"
                className="mx-auto border-2 border-gray-300 dark:border-gray-600 rounded-full cursor-crosshair hover:border-blue-500 transition-colors shadow-md"
              />
              <input
                type="range"
                id="brightness-slider"
                min="0"
                max="100"
                defaultValue="100"
                className="w-full mt-3 mb-3 h-2 bg-gradient-to-r from-black to-white rounded-lg appearance-none cursor-pointer"
              />
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">R</label>
                  <input
                    type="number"
                    id="rgb-r"
                    min="0"
                    max="255"
                    defaultValue="255"
                    className="w-full px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">G</label>
                  <input
                    type="number"
                    id="rgb-g"
                    min="0"
                    max="255"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">B</label>
                  <input
                    type="number"
                    id="rgb-b"
                    min="0"
                    max="255"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div
                id="color-preview"
                className="w-full h-9 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:scale-105 transition-transform"
                style={{ backgroundColor: 'rgb(255, 0, 0)' }}
              />
            </div>
          </div>

          {/* Grid Size Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500 rounded"></div>
              Grid Size
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[8, 16, 32, 64, 128].map(size => (
                <button
                  key={size}
                  className={`size-button px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium ${
                    size === 32 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  data-size={size}
                  onClick={() => trackEvent('sprite_grid_size', { size })}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500 rounded"></div>
              Tools
            </h3>

            {/* Undo/Redo */}
            <div className="flex gap-2 mb-3">
              <button
                id="undo-btn"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-green-500 hover:text-white transition-all text-xs font-medium"
                onClick={() => trackEvent('sprite_undo')}
              >
                ↶ Undo
              </button>
              <button
                id="redo-btn"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-green-500 hover:text-white transition-all text-xs font-medium"
                onClick={() => trackEvent('sprite_redo')}
              >
                ↷ Redo
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex gap-2 mb-3">
              <button
                id="zoom-out-btn"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-orange-500 hover:text-white transition-all text-xs font-medium"
                onClick={() => trackEvent('sprite_zoom_out')}
              >
                − Zoom Out
              </button>
              <button
                id="zoom-in-btn"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-orange-500 hover:text-white transition-all text-xs font-medium"
                onClick={() => trackEvent('sprite_zoom_in')}
              >
                + Zoom In
              </button>
            </div>

            {/* Drawing Tools */}
            <div className="flex flex-col gap-2">
              <button
                className="tool-button active px-4 py-3 border border-gray-300 dark:border-gray-600 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-3 text-sm font-medium"
                data-tool="brush"
                onClick={() => trackEvent('sprite_tool_select', { tool: 'brush' })}
              >
                🖌️ Brush
              </button>
              <button
                className="tool-button px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center gap-3 text-sm font-medium"
                data-tool="bucket"
                onClick={() => trackEvent('sprite_tool_select', { tool: 'bucket' })}
              >
                🪣 Bucket Fill
              </button>
              <button
                className="tool-button px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center gap-3 text-sm font-medium"
                data-tool="rectangle"
                onClick={() => trackEvent('sprite_tool_select', { tool: 'rectangle' })}
              >
                ▭ Rectangle
              </button>
              <button
                className="tool-button px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center gap-3 text-sm font-medium"
                data-tool="eyedropper"
                onClick={() => trackEvent('sprite_tool_select', { tool: 'eyedropper' })}
              >
                🎨 Eyedropper
              </button>
              <button
                id="eraser-toggle"
                className="tool-button px-4 py-3 border border-red-300 dark:border-red-600 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-3 text-sm font-medium"
                onClick={() => trackEvent('sprite_tool_select', { tool: 'eraser' })}
              >
                🗑️ Eraser Mode
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <div className="w-1 h-4 bg-green-500 rounded"></div>
              Import
            </h3>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Upload a sprite image to continue editing:
              </label>
              <input
                type="file"
                id="sprite-upload"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900 dark:file:text-green-300"
              />
            </div>
            <button
              id="import-button"
              className="w-full px-3 py-2 border border-green-500 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-semibold"
              onClick={() => trackEvent('sprite_import')}
            >
              📁 Load Sprite
            </button>
          </div>

          {/* Export Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500 rounded"></div>
              Export
            </h3>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                FILENAME:
              </label>
              <input
                type="text"
                id="filename-input"
                placeholder="Enter filename without extension"
                defaultValue="sprite"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['png', 'jpg', 'bmp', 'gif'].map(format => (
                <button
                  key={format}
                  className="export-button px-3 py-2 border border-blue-500 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-xs font-semibold uppercase"
                  data-format={format}
                  onClick={() => trackEvent('sprite_export', { format })}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div
        id="status-bar"
        className="bg-gray-800 dark:bg-gray-900 text-gray-300 dark:text-gray-400 px-4 py-2 text-sm font-medium border-t border-gray-300 dark:border-gray-700"
      >
        Tool: Brush | Grid: 32x32 | Color: RGB(255, 0, 0)
      </div>
    </div>
  );
};

// SpriteEditor class - Core logic for the pixel art editor
class SpriteEditor {
  constructor(canvas, colorWheel, isDark) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.colorWheel = colorWheel;
    this.colorWheelCtx = colorWheel.getContext('2d');
    this.isDark = isDark;

    // State
    this.gridSize = 32;
    this.baseCanvasSize = 512;
    this.zoomLevel = 1;
    this.pixelSize = this.baseCanvasSize / this.gridSize;
    this.currentTool = 'brush';
    this.eraserMode = false;
    this.currentColor = { r: 255, g: 0, b: 0 };
    this.brightness = 1;
    this.hue = 0;
    this.saturation = 1;

    // Grid data
    this.grid = this.createEmptyGrid();
    this.history = [this.copyGrid(this.grid)];
    this.historyIndex = 0;

    // Mouse state
    this.isDrawing = false;
    this.isRectSelecting = false;
    this.rectStart = null;
    this.rectEnd = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.drawColorWheel();
    this.updateCanvas();
    this.updateStatus();
  }

  createEmptyGrid() {
    const grid = [];
    for (let y = 0; y < this.gridSize; y++) {
      grid[y] = [];
      for (let x = 0; x < this.gridSize; x++) {
        grid[y][x] = null; // null represents transparent/empty
      }
    }
    return grid;
  }

  copyGrid(grid) {
    return grid.map(row => [...row]);
  }

  setupEventListeners() {
    // Canvas events
    this.canvas.addEventListener('mousedown', this.handleCanvasMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleCanvasMouseUp.bind(this));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Color wheel events
    this.colorWheel.addEventListener('click', this.handleColorWheelClick.bind(this));

    // Brightness slider
    const brightnessSlider = document.getElementById('brightness-slider');
    if (brightnessSlider) {
      brightnessSlider.addEventListener('input', (e) => {
        this.brightness = e.target.value / 100;
        this.updateColorFromHSB();
      });
    }

    // RGB inputs
    ['r', 'g', 'b'].forEach(component => {
      const input = document.getElementById(`rgb-${component}`);
      if (input) {
        input.addEventListener('input', (e) => {
          this.currentColor[component] = parseInt(e.target.value) || 0;
          this.updateColorPreview();
          this.updateStatus();
        });
      }
    });

    // Grid size buttons
    document.querySelectorAll('.size-button').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.size-button').forEach(b => {
          b.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
          b.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        });
        button.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        button.classList.add('bg-blue-500', 'text-white', 'border-blue-500');
        this.changeGridSize(parseInt(button.dataset.size));
      });
    });

    // Tool buttons
    document.querySelectorAll('.tool-button:not(#eraser-toggle)').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.tool-button:not(#eraser-toggle)').forEach(b => {
          b.classList.remove('bg-blue-500', 'text-white', 'active');
          b.classList.add('bg-white', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        });
        button.classList.remove('bg-white', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        button.classList.add('bg-blue-500', 'text-white', 'active');
        this.currentTool = button.dataset.tool;
        this.updateStatus();
      });
    });

    // Eraser toggle
    const eraserToggle = document.getElementById('eraser-toggle');
    if (eraserToggle) {
      eraserToggle.addEventListener('click', () => {
        this.eraserMode = !this.eraserMode;
        eraserToggle.classList.toggle('bg-red-600', this.eraserMode);
        this.updateStatus();
      });
    }

    // Undo/Redo
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    if (undoBtn) undoBtn.addEventListener('click', () => this.undo());
    if (redoBtn) redoBtn.addEventListener('click', () => this.redo());

    // Export buttons
    document.querySelectorAll('.export-button').forEach(button => {
      button.addEventListener('click', () => {
        this.exportImage(button.dataset.format);
      });
    });

    // Zoom buttons
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.changeZoom(1));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.changeZoom(-1));

    // Import button
    const importButton = document.getElementById('import-button');
    if (importButton) {
      importButton.addEventListener('click', () => {
        const fileInput = document.getElementById('sprite-upload');
        if (fileInput && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            this.loadImage(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    };

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          this.undo();
        } else if ((e.key === 'Z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          this.redo();
        }
      }
    });
  }

  drawColorWheel() {
    const centerX = 60;
    const centerY = 60;
    const radius = 50;

    for (let angle = 0; angle < 360; angle++) {
      for (let r = 0; r < radius; r++) {
        const x = centerX + r * Math.cos(angle * Math.PI / 180);
        const y = centerY + r * Math.sin(angle * Math.PI / 180);

        const hue = angle;
        const saturation = r / radius;
        const rgb = this.hsvToRgb(hue, saturation, this.brightness);

        this.colorWheelCtx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.colorWheelCtx.fillRect(x, y, 1, 1);
      }
    }
  }

  hsvToRgb(h, s, v) {
    h = h % 360;
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  handleColorWheelClick(e) {
    const rect = this.colorWheel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = 60;
    const centerY = 60;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= 50) {
      this.hue = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      this.saturation = Math.min(distance / 50, 1);
      this.updateColorFromHSB();
    }
  }

  updateColorFromHSB() {
    const rgb = this.hsvToRgb(this.hue, this.saturation, this.brightness);
    this.currentColor = rgb;

    const rInput = document.getElementById('rgb-r');
    const gInput = document.getElementById('rgb-g');
    const bInput = document.getElementById('rgb-b');

    if (rInput) rInput.value = rgb.r;
    if (gInput) gInput.value = rgb.g;
    if (bInput) bInput.value = rgb.b;

    this.updateColorPreview();
    this.updateStatus();
  }

  updateColorPreview() {
    const preview = document.getElementById('color-preview');
    if (preview) {
      preview.style.backgroundColor = `rgb(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b})`;
    }
  }

  getPixelPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const actualPixelSize = this.pixelSize * this.zoomLevel;
    const x = Math.floor((e.clientX - rect.left) / actualPixelSize);
    const y = Math.floor((e.clientY - rect.top) / actualPixelSize);
    return { x, y };
  }

  handleCanvasMouseDown(e) {
    const pos = this.getPixelPosition(e);

    if (e.button === 0) { // Left click
      if (this.currentTool === 'eyedropper') {
        this.sampleColor(pos.x, pos.y);
      } else if (this.currentTool === 'bucket') {
        this.floodFill(pos.x, pos.y);
        this.saveState();
      } else if (this.currentTool === 'rectangle') {
        this.isRectSelecting = true;
        this.rectStart = pos;
        this.rectEnd = pos;
      } else { // brush
        this.isDrawing = true;
        this.drawPixel(pos.x, pos.y);
      }
    } else if (e.button === 2 && this.isRectSelecting) { // Right click
      this.isRectSelecting = false;
      this.rectStart = null;
      this.rectEnd = null;
      this.updateCanvas();
    }
  }

  handleCanvasMouseMove(e) {
    const pos = this.getPixelPosition(e);

    if (this.isDrawing && this.currentTool === 'brush') {
      this.drawPixel(pos.x, pos.y);
    } else if (this.isRectSelecting) {
      this.rectEnd = pos;
      this.updateCanvas();
    }
  }

  handleCanvasMouseUp(e) {
    if (this.isRectSelecting && e.button === 0) {
      this.drawRectangle();
      this.isRectSelecting = false;
      this.rectStart = null;
      this.rectEnd = null;
      this.saveState();
    } else if (this.isDrawing) {
      this.isDrawing = false;
      this.saveState();
    }
  }

  drawPixel(x, y) {
    if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
      if (this.eraserMode) {
        this.grid[y][x] = null;
      } else {
        this.grid[y][x] = { ...this.currentColor };
      }
      this.updateCanvas();
    }
  }

  floodFill(startX, startY) {
    if (startX < 0 || startX >= this.gridSize || startY < 0 || startY >= this.gridSize) return;

    const targetColor = this.grid[startY][startX];
    const newColor = this.eraserMode ? null : { ...this.currentColor };

    // Don't fill if the target color is the same as the new color
    if (this.colorsEqual(targetColor, newColor)) return;

    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop();

      if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) continue;
      if (!this.colorsEqual(this.grid[y][x], targetColor)) continue;

      this.grid[y][x] = newColor;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    this.updateCanvas();
  }

  colorsEqual(color1, color2) {
    if (color1 === null && color2 === null) return true;
    if (color1 === null || color2 === null) return false;
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
  }

  drawRectangle() {
    if (!this.rectStart || !this.rectEnd) return;

    const minX = Math.min(this.rectStart.x, this.rectEnd.x);
    const maxX = Math.max(this.rectStart.x, this.rectEnd.x);
    const minY = Math.min(this.rectStart.y, this.rectEnd.y);
    const maxY = Math.max(this.rectStart.y, this.rectEnd.y);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
          if (this.eraserMode) {
            this.grid[y][x] = null;
          } else {
            this.grid[y][x] = { ...this.currentColor };
          }
        }
      }
    }

    this.updateCanvas();
  }

  sampleColor(x, y) {
    if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
      const color = this.grid[y][x];
      if (color) {
        this.currentColor = { ...color };

        const rInput = document.getElementById('rgb-r');
        const gInput = document.getElementById('rgb-g');
        const bInput = document.getElementById('rgb-b');

        if (rInput) rInput.value = color.r;
        if (gInput) gInput.value = color.g;
        if (bInput) bInput.value = color.b;

        this.updateColorPreview();
        this.updateColorWheelFromRGB(color.r, color.g, color.b);
        this.updateStatus();
      }
    }
  }

  updateColorWheelFromRGB(r, g, b) {
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const delta = max - min;

    let hue = 0;
    if (delta !== 0) {
      if (max === r / 255) {
        hue = ((g / 255 - b / 255) / delta) % 6;
      } else if (max === g / 255) {
        hue = (b / 255 - r / 255) / delta + 2;
      } else {
        hue = (r / 255 - g / 255) / delta + 4;
      }
      hue *= 60;
      if (hue < 0) hue += 360;
    }

    const saturation = max === 0 ? 0 : delta / max;

    this.hue = hue;
    this.saturation = saturation;
    this.brightness = max;

    const brightnessSlider = document.getElementById('brightness-slider');
    if (brightnessSlider) {
      brightnessSlider.value = Math.round(this.brightness * 100);
    }
  }

  changeGridSize(newSize) {
    this.gridSize = newSize;
    this.pixelSize = this.baseCanvasSize / this.gridSize;
    this.grid = this.createEmptyGrid();
    this.history = [this.copyGrid(this.grid)];
    this.historyIndex = 0;
    this.updateCanvas();
    this.updateStatus();
  }

  changeZoom(direction) {
    const oldZoom = this.zoomLevel;
    if (direction > 0) {
      this.zoomLevel = Math.min(this.zoomLevel * 1.5, 8);
    } else {
      this.zoomLevel = Math.max(this.zoomLevel / 1.5, 0.25);
    }

    if (this.zoomLevel !== oldZoom) {
      this.updateCanvasSize();
    }
  }

  updateCanvasSize() {
    const newSize = this.baseCanvasSize * this.zoomLevel;
    this.canvas.style.width = `${newSize}px`;
    this.canvas.style.height = `${newSize}px`;
  }

  updateCanvas() {
    // Clear canvas
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.baseCanvasSize, this.baseCanvasSize);

    // Draw grid lines for pixel boundaries
    this.ctx.strokeStyle = '#e5e5e5'; // Light grey color for grid
    this.ctx.lineWidth = 1;

    // Draw vertical grid lines
    for (let x = 0; x <= this.gridSize; x++) {
      const pos = x * this.pixelSize;
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.baseCanvasSize);
      this.ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= this.gridSize; y++) {
      const pos = y * this.pixelSize;
      this.ctx.beginPath();
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(this.baseCanvasSize, pos);
      this.ctx.stroke();
    }

    // Draw pixels
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const color = this.grid[y][x];
        if (color) {
          this.ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          this.ctx.fillRect(
            x * this.pixelSize,
            y * this.pixelSize,
            this.pixelSize,
            this.pixelSize
          );
        }
      }
    }

    // Draw rectangle preview
    if (this.isRectSelecting && this.rectStart && this.rectEnd) {
      const minX = Math.min(this.rectStart.x, this.rectEnd.x);
      const maxX = Math.max(this.rectStart.x, this.rectEnd.x);
      const minY = Math.min(this.rectStart.y, this.rectEnd.y);
      const maxY = Math.max(this.rectStart.y, this.rectEnd.y);

      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        minX * this.pixelSize,
        minY * this.pixelSize,
        (maxX - minX + 1) * this.pixelSize,
        (maxY - minY + 1) * this.pixelSize
      );
    }
  }

  updateStatus() {
    const statusBar = document.getElementById('status-bar');
    if (statusBar) {
      const tool = this.eraserMode ? 'Eraser' : this.currentTool.charAt(0).toUpperCase() + this.currentTool.slice(1);
      statusBar.textContent = `Tool: ${tool} | Grid: ${this.gridSize}x${this.gridSize} | Color: RGB(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b})`;
    }
  }

  saveState() {
    this.historyIndex++;
    this.history = this.history.slice(0, this.historyIndex);
    this.history.push(this.copyGrid(this.grid));

    // Limit history size
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }

    this.updateUndoRedoButtons();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.grid = this.copyGrid(this.history[this.historyIndex]);
      this.updateCanvas();
      this.updateUndoRedoButtons();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.grid = this.copyGrid(this.history[this.historyIndex]);
      this.updateCanvas();
      this.updateUndoRedoButtons();
    }
  }

  updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    if (undoBtn) {
      undoBtn.disabled = this.historyIndex <= 0;
    }
    if (redoBtn) {
      redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
  }

  exportImage(format) {
    // Create a temporary canvas for export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = this.gridSize;
    exportCanvas.height = this.gridSize;
    const exportCtx = exportCanvas.getContext('2d');

    // Fill with white background for non-PNG formats
    if (format !== 'png') {
      exportCtx.fillStyle = 'white';
      exportCtx.fillRect(0, 0, this.gridSize, this.gridSize);
    }

    // Draw pixels
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const color = this.grid[y][x];
        if (color) {
          exportCtx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          exportCtx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Get filename
    const filenameInput = document.getElementById('filename-input');
    const filename = (filenameInput?.value || 'sprite') + '.' + format;

    // Export
    const mimeType = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'gif': 'image/gif'
    }[format] || 'image/png';

    exportCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      // Track export event
      if (window.gtag) {
        window.gtag('event', 'sprite_export', {
          format: format,
          grid_size: this.gridSize,
          category: 'Sprite Generator'
        });
      }
    }, mimeType);
  }

  loadImage(dataUrl) {
    const img = new Image();
    img.onload = () => {
      // Create a temporary canvas to process the image at the correct resolution
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.gridSize;
      tempCanvas.height = this.gridSize;
      const tempCtx = tempCanvas.getContext('2d');

      // Disable image smoothing to preserve pixel art
      tempCtx.imageSmoothingEnabled = false;

      // Draw the image scaled to the grid size
      tempCtx.drawImage(img, 0, 0, this.gridSize, this.gridSize);

      // Get the image data
      const imageData = tempCtx.getImageData(0, 0, this.gridSize, this.gridSize);

      // Clear the current grid
      this.grid = this.createEmptyGrid();

      // Convert image data to grid
      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          const index = (y * this.gridSize + x) * 4;
          const r = imageData.data[index];
          const g = imageData.data[index + 1];
          const b = imageData.data[index + 2];
          const a = imageData.data[index + 3];

          // Only load pixels that aren't completely transparent
          // Also check if it's not a white background pixel (for JPEGs)
          if (a > 128 && !(r === 255 && g === 255 && b === 255)) {
            this.grid[y][x] = { r, g, b };
          } else {
            this.grid[y][x] = null;
          }
        }
      }

      // Update the display and save state
      this.updateCanvas();
      this.saveState();

      // Clear the file input for future uploads
      const fileInput = document.getElementById('sprite-upload');
      if (fileInput) {
        fileInput.value = '';
      }
    };

    img.onerror = () => {
      alert('Error loading image. Please try a different image file.');
    };

    img.src = dataUrl;
  }

  cleanup() {
    // Remove event listeners and clean up
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.handleCanvasMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleCanvasMouseMove);
      this.canvas.removeEventListener('mouseup', this.handleCanvasMouseUp);
    }
    if (this.colorWheel) {
      this.colorWheel.removeEventListener('click', this.handleColorWheelClick);
    }
  }
}

export default SpriteGenerator;
