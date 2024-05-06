import React from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function ThemeManager({ children }) {

  let theme = createTheme({
    palette: {
      primary: {
        main:  '#153d6a',
      },
      secondary: {
        main:  '#2E677A',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
