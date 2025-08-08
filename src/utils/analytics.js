// Google Analytics utility for custom event and pageview tracking

/**
 * Track a page view (virtual pageview for SPAs)
 * @param {string} page_path - The path or name of the page/tab
 */
export function trackPageView(page_path) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path,
    });
  }
}

/**
 * Track a custom event
 * @param {string} action - The event action (e.g. 'tab_switch', 'tool_launch')
 * @param {object} params - Additional event parameters
 */
export function trackEvent(action, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
}

