/**
 * App.jsx
 * Main application component that handles routing, layout, and theme management
 * Serves as the root container for all other components
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import usePageTracking, { trackSessionData, trackUserInteraction } from './hooks/usePageTracking';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Home from './pages/Home';
import StockMarket from './pages/StockMarket';
import Productivity from './pages/Productivity';
import Games from './pages/Games';
import Calculators from './pages/Calculators';
import PhysicsMathTools from './pages/PhysicsMathTools';
import About from './pages/About';
import Settings from './components/Settings';

// Tab configuration for easy management and expansion
const TABS = [
  { id: 'home', label: 'Home', component: Home },
  { id: 'stockmarket', label: 'Stock Market', component: StockMarket },
  { id: 'productivity', label: 'Productivity', component: Productivity },
  { id: 'games', label: 'Games', component: Games },
  { id: 'calculators', label: 'Calculators', component: Calculators },
  { id: 'physics', label: 'Tools', component: PhysicsMathTools },
  { id: 'settings', label: 'Settings', component: Settings },
  { id: 'about', label: 'About', component: About }
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchNavigation, setSearchNavigation] = useState(null);

  // Track page/tab changes for analytics
  usePageTracking(activeTab);

  // Initialize session tracking on app load
  useEffect(() => {
    // Track session start and detailed user environment
    trackSessionData();

    // Track initial app load
    trackUserInteraction('app_load', 'dashboard_initialized', {
      initial_tab: activeTab,
      tabs_available: TABS.length,
      user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    // Track user engagement patterns
    let engagementTimer;
    let idleTimer;
    let isIdle = false;

    const resetIdleTimer = () => {
      if (isIdle) {
        isIdle = false;
        trackUserInteraction('user_return', 'activity_resumed');
      }

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!isIdle) {
          isIdle = true;
          trackUserInteraction('user_idle', 'activity_paused', {
            idle_threshold_seconds: 60
          });
        }
      }, 60000); // 1 minute idle threshold
    };

    // Track user activity events
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    // Track engagement duration every 30 seconds
    engagementTimer = setInterval(() => {
      if (!isIdle) {
        trackUserInteraction('engagement_ping', 'active_session', {
          current_tab: activeTab,
          session_active: true
        });
      }
    }, 30000);

    // Cleanup function
    return () => {
      clearTimeout(idleTimer);
      clearInterval(engagementTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true);
      });
    };
  }, []);

  // Enhanced tab change handler with analytics
  const handleTabChange = (newTab) => {
    const previousTab = activeTab;
    setActiveTab(newTab);

    // Track detailed tab navigation
    trackUserInteraction('tab_switch', 'navigation', {
      from_tab: previousTab,
      to_tab: newTab,
      navigation_method: 'tab_click'
    });
  };

  // Handle search navigation - when user selects a tool from search
  const handleSearchNavigate = (categoryId, toolId) => {
    // Map search category IDs to actual tab IDs
    const categoryToTabMap = {
      'physicsmath': 'physics',
      'games': 'games',
      'calculators': 'calculators',
      'stockmarket': 'stockmarket'
    };

    const targetTab = categoryToTabMap[categoryId];
    if (targetTab) {
      // Switch to the appropriate tab
      setActiveTab(targetTab);

      // Set navigation data to pass to the page component
      setSearchNavigation({ toolId, timestamp: Date.now() });

      // Track search navigation
      trackUserInteraction('search_navigate', 'tool_selection', {
        target_tool: toolId,
        target_category: categoryId,
        target_tab: targetTab
      });
    }
  };

  // Get the active component based on current tab
  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || Home;

  return (
    <ThemeProvider>
      <div className="page-container">
        <Layout>
          <Navbar
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onSearchNavigate={handleSearchNavigate}
          />
          <div className="flex-1 p-6">
            <div className="animate-fade-in">
              <ActiveComponent
                searchNavigation={searchNavigation}
                onNavigate={handleSearchNavigate}
              />
            </div>
          </div>
        </Layout>
      </div>
    </ThemeProvider>
  );
}

export default App;
