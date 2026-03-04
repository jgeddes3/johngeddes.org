import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => {
    const stored = localStorage.getItem('theme-preference');
    if (stored === 'light' || stored === 'dark') return stored;
    // First visit: derive from time of day
    const hour = new Date().getHours();
    return (hour >= 19 || hour < 7) ? 'dark' : 'light';
  });

  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());

  // Update currentHour every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Apply data-theme attribute to documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preference);
  }, [preference]);

  // Toggle simply flips light <-> dark
  const toggleTheme = useCallback(() => {
    setPreference(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-preference', next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, currentHour, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
