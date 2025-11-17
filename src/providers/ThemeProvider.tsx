import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    accentDark: string;
    background: string;
    surface: string;
    surfaceLight: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    lineHeight: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  zIndex: {
    base: number;
    dropdown: number;
    modal: number;
    tooltip: number;
  };
}

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme-mode';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  
  return getSystemTheme();
}

function getCSSVariable(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function buildThemeFromCSSVariables(): Theme {
  return {
    colors: {
      primary: getCSSVariable('--color-primary'),
      primaryDark: getCSSVariable('--color-primary-dark'),
      primaryLight: getCSSVariable('--color-primary-light'),
      secondary: getCSSVariable('--color-secondary'),
      accent: getCSSVariable('--color-accent'),
      accentDark: getCSSVariable('--color-accent-dark'),
      background: getCSSVariable('--color-background'),
      surface: getCSSVariable('--color-surface'),
      surfaceLight: getCSSVariable('--color-surface-light'),
      text: getCSSVariable('--color-text'),
      textSecondary: getCSSVariable('--color-text-secondary'),
      textTertiary: getCSSVariable('--color-text-tertiary'),
      border: getCSSVariable('--color-border'),
      error: getCSSVariable('--color-error'),
      success: getCSSVariable('--color-success'),
      warning: getCSSVariable('--color-warning'),
    },
    typography: {
      fontFamily: getCSSVariable('--font-family-base'),
      fontSize: {
        xs: getCSSVariable('--font-size-xs'),
        sm: getCSSVariable('--font-size-sm'),
        base: getCSSVariable('--font-size-base'),
        lg: getCSSVariable('--font-size-lg'),
        xl: getCSSVariable('--font-size-xl'),
        '2xl': getCSSVariable('--font-size-2xl'),
        '3xl': getCSSVariable('--font-size-3xl'),
      },
      lineHeight: {
        xs: getCSSVariable('--line-height-xs'),
        sm: getCSSVariable('--line-height-sm'),
        base: getCSSVariable('--line-height-base'),
        lg: getCSSVariable('--line-height-lg'),
        xl: getCSSVariable('--line-height-xl'),
        '2xl': getCSSVariable('--line-height-2xl'),
        '3xl': getCSSVariable('--line-height-3xl'),
      },
      fontWeight: {
        normal: parseInt(getCSSVariable('--font-weight-normal')) || 400,
        medium: parseInt(getCSSVariable('--font-weight-medium')) || 500,
        semibold: parseInt(getCSSVariable('--font-weight-semibold')) || 600,
        bold: parseInt(getCSSVariable('--font-weight-bold')) || 700,
      },
    },
    spacing: {
      xs: getCSSVariable('--spacing-xs'),
      sm: getCSSVariable('--spacing-sm'),
      md: getCSSVariable('--spacing-md'),
      lg: getCSSVariable('--spacing-lg'),
      xl: getCSSVariable('--spacing-xl'),
      '2xl': getCSSVariable('--spacing-2xl'),
      '3xl': getCSSVariable('--spacing-3xl'),
    },
    radius: {
      sm: getCSSVariable('--radius-sm'),
      md: getCSSVariable('--radius-md'),
      lg: getCSSVariable('--radius-lg'),
      xl: getCSSVariable('--radius-xl'),
      full: getCSSVariable('--radius-full'),
    },
    shadows: {
      sm: getCSSVariable('--shadow-sm'),
      md: getCSSVariable('--shadow-md'),
      lg: getCSSVariable('--shadow-lg'),
      xl: getCSSVariable('--shadow-xl'),
    },
    zIndex: {
      base: parseInt(getCSSVariable('--z-index-base')) || 0,
      dropdown: parseInt(getCSSVariable('--z-index-dropdown')) || 1000,
      modal: parseInt(getCSSVariable('--z-index-modal')) || 2000,
      tooltip: parseInt(getCSSVariable('--z-index-tooltip')) || 3000,
    },
  };
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
  const [theme, setThemeState] = useState<Theme>(buildThemeFromCSSVariables);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    
    setTimeout(() => {
      setThemeState(buildThemeFromCSSVariables());
    }, 0);
  }, [mode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!storedTheme) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const contextValue: ThemeContextType = {
    theme,
    mode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
}
