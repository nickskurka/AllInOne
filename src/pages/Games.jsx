/**
 * Games.jsx
 * Games and entertainment page with modular game selection
 */

import React, { useState, useEffect } from 'react';
import { Gamepad2, Zap } from 'lucide-react';
import SnakeGame from '../components/SnakeGame';
import { trackEvent } from '../utils/analytics';

const Games = ({ searchNavigation }) => {
  const [activeModule, setActiveModule] = useState(null);

  // Available game modules
  const gameModules = [
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'Classic Snake game with smooth animations and sprite graphics. Eat the fruits to grow your snake and increase your score!',
      icon: Zap,
      status: 'available',
      component: SnakeGame
    }
  ];

  // Handle opening a game module
  const openModule = (moduleId) => {
    const module = gameModules.find(m => m.id === moduleId);
    if (module && module.status === 'available') {
      setActiveModule(module);
      trackEvent('games_game_launch', { game: module.title });
    }
  };

  // Handle search navigation - automatically open game when navigated from search
  useEffect(() => {
    if (searchNavigation && searchNavigation.toolId) {
      const targetModule = gameModules.find(m => m.id === searchNavigation.toolId);
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
              trackEvent('games_back', { from: activeModule?.title });
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span>← Back to Games</span>
          </button>
          <div className="flex items-center space-x-2">
            <activeModule.icon className="w-6 h-6 text-purple-600" />
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
        <Gamepad2 className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold">Games & Entertainment</h1>
      </div>

      {/* Available Games */}
      <div className="content-area">
        <h2 className="text-xl font-semibold mb-4">Available Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameModules.map((game) => {
            const IconComponent = game.icon;
            return (
              <div
                key={game.id}
                className="border border-purple-200 dark:border-purple-800 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => openModule(game.id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <IconComponent className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{game.title}</h4>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      available
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{game.description}</p>
                <button
                  className="w-full py-2 px-4 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModule(game.id);
                    trackEvent('games_play_button', { game: game.title });
                  }}
                >
                  Play Game
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Games;
