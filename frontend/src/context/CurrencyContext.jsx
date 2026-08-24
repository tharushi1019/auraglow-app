import React, { createContext, useContext, useState, useMemo } from 'react';

const CurrencyContext = createContext();

// Base currency is LKR
const EXCHANGE_RATES = {
  LKR: { rate: 1, symbol: 'Rs ', prefix: true },
  USD: { rate: 0.0033, symbol: '$', prefix: true },
  EUR: { rate: 0.0031, symbol: '€', prefix: true },
  GBP: { rate: 0.0026, symbol: '£', prefix: true },
  AED: { rate: 0.012, symbol: ' AED', prefix: false },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('LKR');

  const formatPrice = (amountInLkr) => {
    if (!amountInLkr) return '';
    const numAmount = typeof amountInLkr === 'string' ? parseFloat(amountInLkr.replace(/[^0-9.-]+/g, "")) : amountInLkr;
    
    if (isNaN(numAmount)) return amountInLkr; // Return original if parsing fails
    
    const { rate, symbol, prefix } = EXCHANGE_RATES[currency];
    const converted = (numAmount * rate).toFixed(2);
    
    // Remove .00 for clean numbers in LKR
    const cleanConverted = (currency === 'LKR' && converted.endsWith('.00')) 
      ? Math.round(numAmount * rate).toString() 
      : converted;

    return prefix ? `${symbol}${cleanConverted}` : `${cleanConverted}${symbol}`;
  };

  const value = useMemo(() => ({
    currency,
    setCurrency,
    formatPrice,
    availableCurrencies: Object.keys(EXCHANGE_RATES)
  }), [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
