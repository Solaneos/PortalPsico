import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D47A1',
    },
    secondary: {
      main: '#00bcd4',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1565C0',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});
