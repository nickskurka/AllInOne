/**
 * useOptionLadder.js
 * Custom hook for generating option ladder/chain data with Greek synchronization
 */

import { useState, useCallback, useMemo } from 'react';

export const useOptionLadder = (calculateOptionPrice, calculateGreeks) => {
  const [ladderConfig, setLadderConfig] = useState({
    mode: 'strike', // 'strike' or 'expiration'
    strikeMin: 80,
    strikeMax: 120,
    strikeStep: 5,
    expirationMin: 0.1, // 0.1 years (about 36 days)
    expirationMax: 1.0, // 1 year
    expirationStep: 0.1, // 0.1 years (about 36 days)
    visibleGreeks: ['delta'] // Which Greeks to show in ladder
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Available Greeks for selection
  const availableGreeks = [
    { key: 'delta', label: 'Delta', format: (val) => val.toFixed(3) },
    { key: 'gamma', label: 'Gamma', format: (val) => val.toFixed(4) },
    { key: 'theta', label: 'Theta', format: (val) => val.toFixed(3) },
    { key: 'vega', label: 'Vega', format: (val) => val.toFixed(3) },
    { key: 'rho', label: 'Rho', format: (val) => val.toFixed(3) }
  ];

  // Update ladder configuration
  const updateLadderConfig = useCallback((key, value) => {
    setLadderConfig(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Toggle Greek visibility
  const toggleGreek = useCallback((greekKey) => {
    setLadderConfig(prev => ({
      ...prev,
      visibleGreeks: prev.visibleGreeks.includes(greekKey)
        ? prev.visibleGreeks.filter(g => g !== greekKey)
        : [...prev.visibleGreeks, greekKey]
    }));
  }, []);

  // Generate ladder data
  const generateLadder = useCallback((baseParameters) => {
    if (!calculateOptionPrice || !calculateGreeks) {
      return [];
    }

    const { S, K, T, r, sigma, q } = baseParameters;
    const { mode, strikeMin, strikeMax, strikeStep, expirationMin, expirationMax, expirationStep } = ladderConfig;

    const ladderData = [];

    if (mode === 'strike') {
      // Generate ladder across different strike prices
      for (let strike = strikeMin; strike <= strikeMax; strike += strikeStep) {
        try {
          const callPrice = calculateOptionPrice(S, strike, T, r, sigma, q, 'call');
          const putPrice = calculateOptionPrice(S, strike, T, r, sigma, q, 'put');
          const greeks = calculateGreeks(S, strike, T, r, sigma, q);

          // Calculate implied volatility (simplified - using input sigma for now)
          const impliedVol = sigma;

          ladderData.push({
            strike,
            expiration: T,
            call: {
              price: callPrice,
              impliedVol,
              delta: greeks.callDelta,
              gamma: greeks.gamma,
              theta: greeks.callTheta,
              vega: greeks.vega,
              rho: greeks.callRho
            },
            put: {
              price: putPrice,
              impliedVol,
              delta: greeks.putDelta,
              gamma: greeks.gamma,
              theta: greeks.putTheta,
              vega: greeks.vega,
              rho: greeks.putRho
            }
          });
        } catch (error) {
          console.warn(`Error calculating for strike ${strike}:`, error);
        }
      }
    } else {
      // Generate ladder across different expiration times
      for (let expiration = expirationMin; expiration <= expirationMax; expiration += expirationStep) {
        try {
          const callPrice = calculateOptionPrice(S, K, expiration, r, sigma, q, 'call');
          const putPrice = calculateOptionPrice(S, K, expiration, r, sigma, q, 'put');
          const greeks = calculateGreeks(S, K, expiration, r, sigma, q);

          // Calculate implied volatility (simplified - using input sigma for now)
          const impliedVol = sigma;

          ladderData.push({
            strike: K,
            expiration,
            call: {
              price: callPrice,
              impliedVol,
              delta: greeks.callDelta,
              gamma: greeks.gamma,
              theta: greeks.callTheta,
              vega: greeks.vega,
              rho: greeks.callRho
            },
            put: {
              price: putPrice,
              impliedVol,
              delta: greeks.putDelta,
              gamma: greeks.gamma,
              theta: greeks.putTheta,
              vega: greeks.vega,
              rho: greeks.putRho
            }
          });
        } catch (error) {
          console.warn(`Error calculating for expiration ${expiration}:`, error);
        }
      }
    }

    return ladderData;
  }, [ladderConfig, calculateOptionPrice, calculateGreeks]);

  // Validation for ladder configuration
  const ladderValidation = useMemo(() => {
    const errors = [];

    if (ladderConfig.mode === 'strike') {
      if (ladderConfig.strikeMin >= ladderConfig.strikeMax) {
        errors.push('Min strike must be less than max strike');
      }
      if (ladderConfig.strikeStep <= 0) {
        errors.push('Strike step must be positive');
      }
      if ((ladderConfig.strikeMax - ladderConfig.strikeMin) / ladderConfig.strikeStep > 50) {
        errors.push('Too many strikes (limit: 50)');
      }
    } else {
      if (ladderConfig.expirationMin >= ladderConfig.expirationMax) {
        errors.push('Min expiration must be less than max expiration');
      }
      if (ladderConfig.expirationStep <= 0) {
        errors.push('Expiration step must be positive');
      }
      if ((ladderConfig.expirationMax - ladderConfig.expirationMin) / ladderConfig.expirationStep > 50) {
        errors.push('Too many expirations (limit: 50)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [ladderConfig]);

  // Format functions for display
  const formatExpiration = useCallback((expiration) => {
    if (expiration < 1) {
      const days = Math.round(expiration * 365);
      return `${days}d`;
    }
    return `${expiration.toFixed(2)}y`;
  }, []);

  const formatPrice = useCallback((price) => {
    if (isNaN(price) || !isFinite(price)) return 'N/A';
    return `$${price.toFixed(2)}`;
  }, []);

  const formatPercentage = useCallback((value) => {
    if (isNaN(value) || !isFinite(value)) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  }, []);

  return {
    ladderConfig,
    updateLadderConfig,
    isExpanded,
    setIsExpanded,
    availableGreeks,
    toggleGreek,
    generateLadder,
    ladderValidation,
    formatExpiration,
    formatPrice,
    formatPercentage
  };
};
