/**
 * Theme Context — light only, dark mode removed
 */
import React, { createContext, useContext, useEffect } from 'react';

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.removeItem('theme');
  }, []);

  return <ThemeCtx.Provider value={{ theme: 'light', toggle: () => {} }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
