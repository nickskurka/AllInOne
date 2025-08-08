/**
 * SnakeGame.jsx
 * Classic Snake game implementation with clean Canvas graphics
 * Features smooth animations and responsive controls
 */

import React, { useEffect, useRef, useState } from 'react';
import { trackGameActivity, trackUserInteraction } from '../hooks/usePageTracking';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const gameStartTime = useRef(null);
  const [score, setScore] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  // Game constants
  const WIDTH = 600;
  const HEIGHT = 600;
  const GRID_SIZE = 20;
  const GRID_COUNT = WIDTH / GRID_SIZE;

  // Colors
  const BACKGROUND_COLOR = '#2d3748';
  const SNAKE_HEAD_COLOR = '#68d391';
  const SNAKE_BODY_COLOR = '#48bb78';
  const FOOD_COLOR = '#f56565';
  const BORDER_COLOR = '#1a202c';

  // Game classes
  class Snake {
    constructor() {
      this.reset();
    }

    reset() {
      this.body = [{ x: 10, y: 10 }];
      this.direction = { x: 1, y: 0 };
      this.nextDirection = { x: 1, y: 0 };
    }

    update() {
      this.direction = { ...this.nextDirection };

      const head = { ...this.body[0] };
      head.x += this.direction.x;
      head.y += this.direction.y;

      // Wrap around walls
      if (head.x < 0) head.x = GRID_COUNT - 1;
      if (head.x >= GRID_COUNT) head.x = 0;
      if (head.y < 0) head.y = GRID_COUNT - 1;
      if (head.y >= GRID_COUNT) head.y = 0;

      // Check self collision
      if (this.body.some(segment => segment.x === head.x && segment.y === head.y)) {
        return false; // Game over
      }

      this.body.unshift(head);
      return true; // Continue game
    }

    grow() {
      // Don't remove tail, snake grows
    }

    removeTail() {
      this.body.pop();
    }

    changeDirection(newDirection) {
      // Prevent reversing into itself
      if (this.direction.x !== -newDirection.x || this.direction.y !== -newDirection.y) {
        this.nextDirection = newDirection;
      }
    }

    draw(ctx) {
      this.body.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
        ctx.fillRect(
          segment.x * GRID_SIZE + 1,
          segment.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2
        );

        // Add some styling to make it look better
        if (index === 0) {
          // Draw eyes on the head
          ctx.fillStyle = '#2d3748';
          const eyeSize = 3;
          const eyeOffset = 5;

          if (this.direction.x === 1) { // Moving right
            ctx.fillRect(segment.x * GRID_SIZE + eyeOffset + 5, segment.y * GRID_SIZE + 4, eyeSize, eyeSize);
            ctx.fillRect(segment.x * GRID_SIZE + eyeOffset + 5, segment.y * GRID_SIZE + 13, eyeSize, eyeSize);
          } else if (this.direction.x === -1) { // Moving left
            ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + 4, eyeSize, eyeSize);
            ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + 13, eyeSize, eyeSize);
          } else if (this.direction.y === 1) { // Moving down
            ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + eyeOffset + 5, eyeSize, eyeSize);
            ctx.fillRect(segment.x * GRID_SIZE + 13, segment.y * GRID_SIZE + eyeOffset + 5, eyeSize, eyeSize);
          } else { // Moving up
            ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + 4, eyeSize, eyeSize);
            ctx.fillRect(segment.x * GRID_SIZE + 13, segment.y * GRID_SIZE + 4, eyeSize, eyeSize);
          }
        }
      });
    }
  }

  class Food {
    constructor() {
      this.respawn();
    }

    respawn() {
      this.x = Math.floor(Math.random() * GRID_COUNT);
      this.y = Math.floor(Math.random() * GRID_COUNT);
    }

    draw(ctx) {
      ctx.fillStyle = FOOD_COLOR;
      ctx.beginPath();
      ctx.arc(
        this.x * GRID_SIZE + GRID_SIZE / 2,
        this.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }

  class Game {
    constructor(canvas, onScoreChange, onGameOver, onPause) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.onScoreChange = onScoreChange;
      this.onGameOver = onGameOver;
      this.onPause = onPause;

      this.reset();
      this.setupControls();
    }

    reset() {
      this.snake = new Snake();
      this.food = new Food();
      this.score = 1;
      this.gameRunning = true;
      this.isPaused = false;
      this.lastMoveTime = 0;
      this.moveInterval = 150;

      // Track game start
      gameStartTime.current = Date.now();
      trackGameActivity('snake', 'game_start');

      this.onScoreChange(this.score);
      this.onGameOver(false);
      this.onPause(false);

      this.respawnFood();
    }

    setupControls() {
      this.handleKeyPress = (e) => {
        if (!this.gameRunning && !this.isPaused) return;

        // Track key presses for user interaction
        trackUserInteraction('keypress', `snake_${e.key.toLowerCase()}`, {
          game_state: this.gameRunning ? 'playing' : 'paused',
          current_score: this.score
        });

        switch (e.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            this.snake.changeDirection({ x: 0, y: -1 });
            break;
          case 's':
          case 'arrowdown':
            this.snake.changeDirection({ x: 0, y: 1 });
            break;
          case 'a':
          case 'arrowleft':
            this.snake.changeDirection({ x: -1, y: 0 });
            break;
          case 'd':
          case 'arrowright':
            this.snake.changeDirection({ x: 1, y: 0 });
            break;
          case 'p':
            this.togglePause();
            break;
          case 'r':
            if (!this.gameRunning) {
              this.reset();
            }
            break;
        }
      };

      document.addEventListener('keydown', this.handleKeyPress);
    }

    cleanup() {
      document.removeEventListener('keydown', this.handleKeyPress);
    }

    togglePause() {
      this.isPaused = !this.isPaused;
      this.onPause(this.isPaused);

      // Track pause/resume events
      trackGameActivity('snake', this.isPaused ? 'pause' : 'resume', this.score);
    }

    respawnFood() {
      do {
        this.food.respawn();
      } while (this.snake.body.some(segment =>
        segment.x === this.food.x && segment.y === this.food.y
      ));
    }

    update(timestamp) {
      if (!this.gameRunning || this.isPaused) return;

      if (timestamp - this.lastMoveTime >= this.moveInterval) {
        const alive = this.snake.update();

        if (!alive) {
          this.gameRunning = false;
          this.onGameOver(true);

          // Track game over with detailed analytics
          const gameDuration = Date.now() - gameStartTime.current;
          trackGameActivity('snake', 'game_over', this.score);
          trackUserInteraction('game_completion', 'snake_game_over', {
            final_score: this.score,
            game_duration_ms: gameDuration,
            game_duration_seconds: Math.round(gameDuration / 1000)
          });
          return;
        }

        const head = this.snake.body[0];
        if (head.x === this.food.x && head.y === this.food.y) {
          this.snake.grow();
          this.score++;
          this.onScoreChange(this.score);
          this.respawnFood();

          // Track score increases (food eaten)
          trackGameActivity('snake', 'food_eaten', this.score);

          this.moveInterval = Math.max(80, this.moveInterval - 1);
        } else {
          this.snake.removeTail();
        }

        this.lastMoveTime = timestamp;
      }
    }

    draw() {
      // Clear canvas
      this.ctx.fillStyle = BACKGROUND_COLOR;
      this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Draw grid
      this.ctx.strokeStyle = BORDER_COLOR;
      this.ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_COUNT; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * GRID_SIZE, 0);
        this.ctx.lineTo(i * GRID_SIZE, HEIGHT);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, i * GRID_SIZE);
        this.ctx.lineTo(WIDTH, i * GRID_SIZE);
        this.ctx.stroke();
      }

      // Draw game objects
      this.food.draw(this.ctx);
      this.snake.draw(this.ctx);
    }
  }

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new Game(
      canvas,
      setScore,
      setGameOver,
      setPaused
    );

    gameRef.current = game;

    const gameLoop = (timestamp) => {
      game.update(timestamp);
      game.draw();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop(0);

    return () => {
      game.cleanup();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleRestart = () => {
    if (gameRef.current) {
      gameRef.current.reset();
      // Track manual restart
      trackUserInteraction('button_click', 'snake_restart', {
        restart_method: 'button'
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="border-2 border-gray-800 bg-gray-700 rounded-lg shadow-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        {/* Score overlay */}
        <div className="absolute top-2 left-2 text-white text-xl font-bold z-10 bg-black bg-opacity-50 px-2 py-1 rounded">
          Score: {score}
        </div>

        {/* Game Over overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-2xl font-bold z-20 rounded-lg">
            <div className="text-center bg-gray-900 bg-opacity-90 p-6 rounded-lg border border-gray-600">
              <div className="mb-4">Game Over!</div>
              <div className="mb-4 text-lg">Final Score: {score}</div>
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded text-lg transition-colors"
              >
                Play Again (R)
              </button>
            </div>
          </div>
        )}

        {/* Pause overlay */}
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-2xl font-bold z-20 rounded-lg">
            <div className="text-center bg-gray-900 bg-opacity-90 p-6 rounded-lg border border-gray-600">
              <div>⏸️ Paused</div>
              <div className="text-lg mt-2">Press P to resume</div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-2 max-w-md">
        <div>
          <strong>Controls:</strong> Use WASD or Arrow Keys to move
        </div>
        <div>
          Press P to pause • Press R to restart (when game over)
        </div>
        <div className="text-xs">
          🐍 Eat the red food to grow and increase your score! Speed increases as you progress.
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
