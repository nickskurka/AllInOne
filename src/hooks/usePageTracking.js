import { useEffect } from 'react';

// Enhanced Google Analytics tracking with detailed user activity monitoring
export default function usePageTracking(activeTab) {
  useEffect(() => {
    if (!window.gtag) return;

    // Create a proper page path for each tab
    const pagePath = `/${activeTab}`;
    const pageTitle = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - AllInOne Dashboard`;

    // Send page_view event with enhanced parameters for GA4
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: `${window.location.origin}${pagePath}`,
      page_path: pagePath,
      send_to: 'G-T0RKZL4QK3',
      // Enhanced tracking parameters
      custom_map: {
        'tab_name': activeTab,
        'timestamp': new Date().toISOString(),
        'user_agent': navigator.userAgent,
        'screen_resolution': `${window.screen.width}x${window.screen.height}`,
        'viewport_size': `${window.innerWidth}x${window.innerHeight}`
      }
    });

    // Track custom tab navigation event
    window.gtag('event', 'tab_navigation', {
      event_category: 'Navigation',
      event_label: activeTab,
      custom_parameter_1: pageTitle,
      custom_parameter_2: Date.now(),
      send_to: 'G-T0RKZL4QK3'
    });

    // Also update the browser URL without navigation (for better tracking)
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, pageTitle, pagePath);
      document.title = pageTitle;
    }

    console.log(`Enhanced GA4 Tracking: ${pageTitle} (${pagePath})`);
  }, [activeTab]);
}

// Enhanced analytics utility functions for detailed tracking
export const trackEvent = (eventName, parameters = {}) => {
  if (!window.gtag) return;

  const enhancedParams = {
    ...parameters,
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    send_to: 'G-T0RKZL4QK3'
  };

  window.gtag('event', eventName, enhancedParams);
  console.log(`GA4 Event Tracked: ${eventName}`, enhancedParams);
};

export const trackUserInteraction = (action, element, details = {}) => {
  trackEvent('user_interaction', {
    event_category: 'User Engagement',
    event_label: element,
    action_type: action,
    ...details
  });
};

export const trackFeatureUsage = (feature, duration = null) => {
  trackEvent('feature_usage', {
    event_category: 'Feature Engagement',
    event_label: feature,
    usage_duration: duration,
    engagement_score: duration ? Math.min(duration / 1000, 300) : null // Cap at 5 minutes
  });
};

export const trackGameActivity = (game, action, score = null) => {
  trackEvent('game_activity', {
    event_category: 'Gaming',
    event_label: game,
    action_type: action,
    game_score: score,
    engagement_level: score ? (score > 10 ? 'high' : 'medium') : 'low'
  });
};

export const trackCalculatorUsage = (calculatorType, operation = null) => {
  trackEvent('calculator_usage', {
    event_category: 'Tools',
    event_label: calculatorType,
    operation_type: operation,
    tool_category: 'calculator'
  });
};

export const trackThemeChange = (newTheme) => {
  trackEvent('theme_change', {
    event_category: 'User Preferences',
    event_label: newTheme,
    preference_type: 'theme',
    user_customization: true
  });
};

export const trackSessionData = () => {
  if (!window.gtag) return;

  const sessionData = {
    session_start: new Date().toISOString(),
    device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    browser: navigator.userAgent.split(' ').pop(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    referrer: document.referrer || 'direct',
    connection_type: navigator.connection ? navigator.connection.effectiveType : 'unknown'
  };

  window.gtag('event', 'session_start', {
    event_category: 'Session',
    custom_parameters: sessionData,
    send_to: 'G-T0RKZL4QK3'
  });
};
