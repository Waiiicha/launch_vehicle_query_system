import { createTheme } from '@mui/material';

export const appleTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0066cc', // Apple Blue
    },
    secondary: {
      main: '#86868b', // Apple Grey
    },
    background: {
      default: '#f5f5f7', // 官网浅灰
      paper: '#ffffff',
    },
    text: {
      primary: '#1d1d1f', // 接近纯黑
      secondary: '#86868b',
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: '#1d1d1f',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1.05rem',
      lineHeight: 1.6,
      color: '#424245',
    },
    button: {
      textTransform: 'none', // 取消大写
      fontWeight: 500,
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: 'none',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999, // 胶囊按钮
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: 'rgba(0,102,204,0.1)',
          }
        },
        contained: {
          '&:hover': {
             backgroundColor: '#0055aa',
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        }
      }
    }
  }
});