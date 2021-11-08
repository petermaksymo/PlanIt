import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  breakpoints: {
    values: {
      sm: 425,
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
  palette: {
    primary: {
      main: "#3C096C",
    },
    secondary: {
      main: "#FF9100",
    },
    text: {
      primary: "#555555",
    },
    background: {
      paper: "#FBFBFB",
    },
    typography: {
      fontFamily: "Red Hat Display",
    },
  },
})

export default theme
