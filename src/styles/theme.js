import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    common: {
      black: "#000000",
      white: "#ffffff",
    },
    primary: {
      main: "#AA4465",
      contrastText: "FFECDB",
    },
    secondary: {
      main: "#FFECDB",
      contrastText: "#AA4465",
    },
    background: {
      paper: "#FFFCF7", // #a8dadc
      default: "#FFFCF7",
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: "'Roboto Slab', 'sans-serif'",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontFamily: "'Fjalla One', 'sans-serif'",
      fontSize: "4.8rem",
      fontWeight: 800,
      color: "#002147",
    },
    h2: {
      fontFamily: "'Fjalla One', 'sans-serif'",
      fontSize: "4rem",
      fontWeight: 800,
      color: "#002147",
      "@media (max-width:768px)": {
        fontSize: "2.875rem",
      },
    },
    h3: {
      fontFamily: "'Fjalla One', 'sans-serif'",
      fontSize: "3rem",
      fontWeight: 700,
      color: "#002147",
      "@media (max-width:768px)": {
        fontSize: "1.875rem",
      },
    },
    h4: {
      fontFamily: "'Fjalla One', 'sans-serif'",
      fontSize: "2.0rem",
      fontWeight: 700,
      color: "#002147",
      "@media (max-width:768px)": {
        fontSize: "1.8rem",
      },
    },
    h5: {
      fontFamily: "'Fjalla One', 'sans-serif'",
      fontSize: "1.8rem",
      fontWeight: 700,
      color: "#002147",
      "@media (max-width:768px)": {
        fontSize: "1.6rem",
      },
    },
    h6: {
      fontFamily: "'Fjalla One', 'sans-serif'",
      fontSize: "1.4rem",
      fontWeight: 700,
      color: "#002147",
      "@media (max-width:768px)": {
        fontSize: "1.2rem",
      },
    },
    body1: {
      fontFamily: "'Roboto Slab', 'sans-serif'",
      fontSize: "1.25rem",
      fontWeight: 300,
      "@media (max-width:768px)": {
        fontSize: "1rem",
      },
    },
    body2: {
      fontFamily: "'Roboto Slab', 'sans-serif'",
      fontSize: "1rem",
      fontWeight: 700,
      "@media (max-width:768px)": {
        fontSize: "0.875rem",
      },
    },
    subtitle1: {
      fontFamily: "'Roboto Slab', 'sans-serif'",
      fontSize: "0.875rem",
      fontWeight: 300,
      "@media (max-width:768px)": {
        fontSize: "0.750rem",
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          fontFamily: "inherit",
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          padding: "0",
          margin: "0",
        },
      },
    },
  },
});
