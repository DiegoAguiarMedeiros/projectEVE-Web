import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000', // Example color
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff', // Example color
    },
  },
});