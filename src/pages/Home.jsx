/**
 * Home.jsx
 * Main landing page with real-time clock display and search tools functionality
 */

import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Clock, Search, ArrowRight } from 'lucide-react';
import { TOOL_CATALOG, CATEGORY_THEMES } from '../utils/toolCategories';
import { trackEvent } from '../utils/analytics';

const Home = ({ searchNavigation, onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState([]);

  useEffect(() => {
    // Update time immediately on mount
    setCurrentTime(new Date());

    // Set up interval to update every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  // Search functionality for homepage
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTools([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = TOOL_CATALOG.filter(tool => {
      return (
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }).slice(0, 8); // Limit to 8 results for homepage

    setFilteredTools(results);
  }, [searchQuery]);

  // Format time in 24-hour format (HH:MM:SS)
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get the user's timezone in IANA format
  const getTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  // Get current date in a readable format
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle tool selection
  const handleToolSelect = (tool) => {
    if (onNavigate) {
      onNavigate(tool.categoryId, tool.id);
      trackEvent('home_tool_select', { tool: tool.title, category: tool.category });
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section with Clock */}
      <div className="text-center space-y-4">
        <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            {getGreeting()}!
          </h2>

          {/* Real-time Clock Display */}
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {getTimeZone()}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-300">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for tools, games, calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTools.map((tool) => {
          const IconComponent = tool.icon;
          const theme = tool.theme;

          return (
            <div
              key={tool.id}
              onClick={() => handleToolSelect(tool)}
              className={`group cursor-pointer bg-white dark:bg-gray-800 rounded-xl p-6 ${theme.border} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              {/* Tool Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${theme.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              {/* Tool Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {tool.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {tool.description}
                </p>

                <div className={`inline-block px-2 py-1 text-xs rounded-full ${theme.bgLight} ${theme.bgDark} ${theme.textLight} ${theme.textDark}`}>
                  {tool.category}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results State */}
      {searchQuery && filteredTools.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No tools found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No tools match "{searchQuery}". Try a different search term.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              trackEvent('home_show_all_tools_button');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show all tools
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
