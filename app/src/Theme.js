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
    background: {
      main: "#5A189A",
      lightPink: "#F9EEFF",
    },
    text: {
      main: "#FFFFFF",
      grey: "555555",
    },
    button: {
      brightRed: "#EA698B",
      navBarButton: "#AC46A1",
    },
    typography: {
      fontFamily: "Red Hat Display",
    },
  },
})

export default theme
