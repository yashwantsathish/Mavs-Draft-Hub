import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: `'Oswald', 'Arial', sans-serif`,
  },
  palette: {
    primary: {
      main: '#00538C', 
    },
    secondary: {
      main: '#007DC5',
    },
  },
});

export default theme;
