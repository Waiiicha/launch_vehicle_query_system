import { createTheme } from '@mui/material';

export const sciFiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f3ff', // 赛博青
    },
    secondary: {
      main: '#d500f9', // 霓虹紫
    },
    background: {
      default: '#050510', // 深空黑
      paper: 'rgba(20, 20, 35, 0.8)', // 玻璃拟态背景
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#00f3ff', // 次要文字用青色高亮
    }
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.1em',
      textShadow: '0 0 10px #00f3ff',
    },
    h6: {
      letterSpacing: '0.05em',
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 243, 255, 0.2)',
          boxShadow: '0 0 15px rgba(0, 243, 255, 0.1)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // 硬朗的边角
          border: '1px solid #00f3ff',
          '&:hover': {
            boxShadow: '0 0 10px #00f3ff',
            backgroundColor: 'rgba(0, 243, 255, 0.1)',
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: '1px solid',
        }
      }
    }
  }
});
