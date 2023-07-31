import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    [key: string]: any;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    [key: string]: any;
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    allVariants: {
      color: "white",
    },
    h1: {
      fontWeight: "bold",
    },
    h2: {
      fontWeight: "bold",
    },
    h3: {
      fontWeight: "bold",
    },
    h4: {
      fontWeight: "bold",
    },
    h5: {
      fontWeight: "bold",
    },
    h6: {
      fontWeight: "bold",
    },
  },
  palette: {
    primary: {
      main: "#ffffff",
      contrastText: "white",
    },
    secondary: {
      light: "#0066ff",
      main: "#0044ff",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#ffcc00",
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    background: {
      default:
        "radial-gradient(circle, hsla(246, 42%, 18%, 1) 0%, hsla(249, 54%, 5%, 1) 100%)",
      paper: "rgba(10,10,50,0.6)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
        containedPrimary: {
          background:
            "radial-gradient(circle, rgba(0,255,190,1) 0%, rgba(3,75,88,1) 100%)",
          color: "white",
        },
      },
    },
  },
  overrides: {
    MuiInput: {
      input: {
        "&::placeholder": {
          color: "gray",
        },
        color: "white", // if you also want to change the color of the input, this is the prop you'd use
      },
    },
  },
});

export const gridProps = {
  textAlign: "center",
  background:
    "radial-gradient(circle, hsla(246, 42%, 18%, 1) 0%, hsla(249, 54%, 5%, 1) 100%)",
  minHeight: "calc( 100vh - 200px )",
};

export const background = {
  background:
    "radial-gradient(circle, hsla(246, 42%, 18%, 1) 0%, hsla(249, 54%, 5%, 1) 100%)",
};
