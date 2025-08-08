import { Calculator, Gamepad2, LineChart, BarChart3, Paintbrush } from 'lucide-react';

// Example tool catalog and category themes for search and display
export const TOOL_CATALOG = [
  {
    id: 'loan-calculator',
    title: 'Loan Calculator',
    description: 'Calculate monthly payments, total interest, and view amortization schedules.',
    category: 'Calculators',
    categoryId: 'calculators',
    keywords: ['loan', 'mortgage', 'payment', 'interest', 'amortization'],
    icon: Calculator,
    theme: {
      border: 'border-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-100',
      bgDark: 'dark:bg-blue-900/20',
      textLight: 'text-blue-800',
      textDark: 'dark:text-blue-200',
      name: 'Calculators',
    },
  },
  {
    id: 'snake-game',
    title: 'Snake Game',
    description: 'Classic snake game with arrow key controls.',
    category: 'Games',
    categoryId: 'games',
    keywords: ['snake', 'classic', 'arcade', 'retro'],
    icon: Gamepad2,
    theme: {
      border: 'border-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-100',
      bgDark: 'dark:bg-purple-900/20',
      textLight: 'text-purple-800',
      textDark: 'dark:text-purple-200',
      name: 'Games',
    },
  },
  {
    id: 'graphing-calculator',
    title: 'Graphing Calculator',
    description: 'Plot mathematical functions with support for trigonometric, logarithmic, and polynomial functions.',
    category: 'Physics & Math',
    categoryId: 'physics-math',
    keywords: ['graph', 'function', 'plot', 'math', 'trigonometry', 'polynomial', 'calculus'],
    icon: LineChart,
    theme: {
      border: 'border-green-500',
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-100',
      bgDark: 'dark:bg-green-900/30',
      textLight: 'text-green-800',
      textDark: 'dark:text-green-200',
      name: 'Tools',
    },
  },
  {
    id: 'option-pricing',
    title: 'Options Pricing Tool',
    description: 'Calculate option prices using Black-Scholes model with Greeks (Delta, Gamma, Theta, Vega).',
    category: 'Stock Market',
    categoryId: 'stock-market',
    keywords: ['options', 'black-scholes', 'greeks', 'delta', 'gamma', 'theta', 'vega', 'pricing', 'derivatives'],
    icon: BarChart3,
    theme: {
      border: 'border-yellow-500',
      gradient: 'from-yellow-500 to-yellow-600',
      bgLight: 'bg-yellow-100',
      bgDark: 'dark:bg-yellow-900/30',
      textLight: 'text-yellow-800',
      textDark: 'dark:text-yellow-200',
      name: 'Stock Market',
    },
  },
  {
    id: 'sprite-generator',
    title: 'Sprite Generator',
    description: 'Create and export pixel art sprites for games and projects.',
    category: 'Productivity',
    categoryId: 'productivity',
    keywords: ['sprite', 'pixel', 'art', 'generator', 'editor', 'image'],
    icon: Paintbrush,
    theme: {
      border: 'border-green-500',
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-100',
      bgDark: 'dark:bg-green-900/30',
      textLight: 'text-green-800',
      textDark: 'dark:text-green-200',
      name: 'Tools',
    },
  },
];

export const CATEGORY_THEMES = {
  calculators: {
    gradient: 'from-blue-500 to-blue-600',
    name: 'Calculators',
  },
  games: {
    gradient: 'from-purple-500 to-purple-600',
    name: 'Games',
  },
  'physics-math': {
    gradient: 'from-green-500 to-green-600',
    name: 'Tools',
  },
  'stock-market': {
    gradient: 'from-yellow-500 to-yellow-600',
    name: 'Stock Market',
  },
  productivity: {
    gradient: 'from-green-500 to-green-600',
    name: 'Tools',
  },
};
