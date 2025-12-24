import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { alpha } from '@mui/material/styles';

const ThemeModeContext = createContext();

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('themeMode') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('themeMode', mode);
    } catch (e) {}
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { 
        main: '#00bfa5' 
      },
      secondary: { 
        main: '#ff5252' 
      },
      ...(mode === 'dark'
        ? { 
            background: { 
                default: '#050a14', 
                paper: '#0f172a' 
            },
            text: { 
                primary: '#f8fafc', 
                secondary: '#94a3b8' 
            },
            divider: 'rgba(255, 255, 255, 0.05)',
          }
        : { 
            background: { 
                default: '#f0f4f8', 
                paper: '#ffffff' 
            },
            text: { 
                primary: '#0f172a', 
                secondary: '#475569' 
            },
            divider: 'rgba(0, 0, 0, 0.05)',
          }),
    },
    typography: {
      button: { 
        textTransform: 'none',
        fontWeight: 600 
      },
      fontFamily: '"Inter", "system-ui", "sans-serif"',
    },
    shape: {
      borderRadius: 12, // Increased for a softer glass look
    },
    // GLASSMORPHISM COMPONENT OVERRIDES
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // Adds a subtle animated gradient background to make the glass pop
            background: mode === 'dark' 
              ? `radial-gradient(at 0% 0%, ${alpha('#00bfa5', 0.15)} 0, transparent 50%), radial-gradient(at 100% 100%, ${alpha('#ff5252', 0.1)} 0, transparent 50%), #050a14`
              : `radial-gradient(at 0% 0%, ${alpha('#00bfa5', 0.1)} 0, transparent 50%), radial-gradient(at 100% 100%, ${alpha('#ff5252', 0.05)} 0, transparent 50%), #f0f4f8`,
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            // This applies glassmorphism to ALL Paper-based components (Cards, Dialogs, Menus)
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundImage: 'none', // Removes the default MUI overlay image in dark mode
            boxShadow: mode === 'dark' 
              ? `0 8px 32px 0 ${alpha('#000', 0.4)}` 
              : `0 8px 32px 0 ${alpha('#cbd5e1', 0.5)}`,
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}