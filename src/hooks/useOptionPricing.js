/**
 * useOptionPricing.js
 * Custom hook for Black-Scholes option pricing and Greeks calculations
 */

import { useState, useCallback, useMemo } from 'react';

// Standard normal cumulative distribution function
const normalCDF = (x) => {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2.0);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
};

// Standard normal probability density function
const normalPDF = (x) => {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
};

export const useOptionPricing = () => {
  const [parameters, setParameters] = useState({
    S: 100,    // Current stock price
    K: 100,    // Strike price
    T: 0.25,   // Time to expiration (years)
    r: 0.05,   // Risk-free rate
    sigma: 0.2, // Volatility
    q: 0       // Dividend yield
  });

  // Calculate d1 and d2 for Black-Scholes
  const calculateD1D2 = useCallback((S, K, T, r, sigma, q) => {
    if (T <= 0 || sigma <= 0) return { d1: 0, d2: 0 };

    const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    return { d1, d2 };
  }, []);

  // Black-Scholes option pricing
  const calculateOptionPrice = useCallback((S, K, T, r, sigma, q, optionType = 'call') => {
    if (T <= 0) {
      // At expiration
      if (optionType === 'call') {
        return Math.max(S - K, 0);
      } else {
        return Math.max(K - S, 0);
      }
    }

    const { d1, d2 } = calculateD1D2(S, K, T, r, sigma, q);

    const Nd1 = normalCDF(d1);
    const Nd2 = normalCDF(d2);
    const NegD1 = normalCDF(-d1);
    const NegD2 = normalCDF(-d2);

    if (optionType === 'call') {
      return S * Math.exp(-q * T) * Nd1 - K * Math.exp(-r * T) * Nd2;
    } else {
      return K * Math.exp(-r * T) * NegD2 - S * Math.exp(-q * T) * NegD1;
    }
  }, [calculateD1D2]);

  // Calculate all Greeks
  const calculateGreeks = useCallback((S, K, T, r, sigma, q) => {
    if (T <= 0) {
      return {
        callDelta: S > K ? 1 : 0,
        putDelta: S < K ? -1 : 0,
        gamma: 0,
        callTheta: 0,
        putTheta: 0,
        vega: 0,
        callRho: 0,
        putRho: 0
      };
    }

    const { d1, d2 } = calculateD1D2(S, K, T, r, sigma, q);

    const Nd1 = normalCDF(d1);
    const NegD1 = normalCDF(-d1);
    const Nd2 = normalCDF(d2);
    const NegD2 = normalCDF(-d2);
    const nd1 = normalPDF(d1);

    // Delta
    const callDelta = Math.exp(-q * T) * Nd1;
    const putDelta = -Math.exp(-q * T) * NegD1;

    // Gamma (same for calls and puts)
    const gamma = Math.exp(-q * T) * nd1 / (S * sigma * Math.sqrt(T));

    // Theta
    const term1 = -(S * nd1 * sigma * Math.exp(-q * T)) / (2 * Math.sqrt(T));
    const term2Call = r * K * Math.exp(-r * T) * Nd2;
    const term2Put = r * K * Math.exp(-r * T) * NegD2;
    const term3 = q * S * Math.exp(-q * T);

    const callTheta = (term1 - term2Call - term3 * Nd1) / 365; // Per day
    const putTheta = (term1 + term2Put + term3 * NegD1) / 365; // Per day

    // Vega (same for calls and puts)
    const vega = S * Math.exp(-q * T) * nd1 * Math.sqrt(T) / 100; // Per 1% change

    // Rho
    const callRho = K * T * Math.exp(-r * T) * Nd2 / 100; // Per 1% change
    const putRho = -K * T * Math.exp(-r * T) * NegD2 / 100; // Per 1% change

    return {
      callDelta,
      putDelta,
      gamma,
      callTheta,
      putTheta,
      vega,
      callRho,
      putRho
    };
  }, [calculateD1D2]);

  // Update parameters
  const updateParameter = useCallback((key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  }, []);

  // Calculate current option prices and Greeks
  const results = useMemo(() => {
    const { S, K, T, r, sigma, q } = parameters;

    const callPrice = calculateOptionPrice(S, K, T, r, sigma, q, 'call');
    const putPrice = calculateOptionPrice(S, K, T, r, sigma, q, 'put');
    const greeks = calculateGreeks(S, K, T, r, sigma, q);

    return {
      callPrice,
      putPrice,
      ...greeks
    };
  }, [parameters, calculateOptionPrice, calculateGreeks]);

  // Validate parameters
  const validation = useMemo(() => {
    const { S, K, T, r, sigma, q } = parameters;
    const errors = [];

    if (S <= 0) errors.push('Stock price must be positive');
    if (K <= 0) errors.push('Strike price must be positive');
    if (T < 0) errors.push('Time to expiration cannot be negative');
    if (sigma <= 0) errors.push('Volatility must be positive');
    if (r < 0) errors.push('Risk-free rate cannot be negative');
    if (q < 0) errors.push('Dividend yield cannot be negative');

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [parameters]);

  return {
    parameters,
    updateParameter,
    results,
    validation,
    calculateOptionPrice,
    calculateGreeks
  };
};
