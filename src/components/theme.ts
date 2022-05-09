import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        light: '#5f9e4b',
        main: '#37861f',
        dark: '#265d15',
        contrastText: '#fff',
      },
      secondary: {
        main: "#000000",
      },
    },
    components: {
      MuiSelect: {
        styleOverrides: {
          select: {
            color: "#fff"
          },
          icon: {
            color: "#fff"
          }
        },
      },
    },
  });

  export default theme;