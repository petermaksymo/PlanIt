import React, { useState, useContext } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import { useTheme, makeStyles } from "@mui/styles"
import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"

import Logo from "./logo"
import { AuthContext } from "../contexts/auth"

const useStyles = makeStyles((theme) => ({
  menuItem: {
    fontSize: 22,
  },
}))

export const NavBar = () => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const history = useHistory()
  const location = useLocation()
  const onMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [menuOpen, setMenuOpen] = useState(null)
  const { isAuthed, logout } = useContext(AuthContext)

  const navOptions = [
    { title: "Find Courses", link: "/" },
    { title: "My Profiles", link: "/profiles" },
    { title: "My Account", link: "/account" },
    { title: "Help", link: "/help" },
  ]

  const mobileNavBar = (
    <>
      <IconButton
        id="nav-menu-toggle"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={(e) => setMenuOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(null)}>
        <List
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: 250,
          }}
        >
          {navOptions.map((option) => (
            <Link to={option.link}>
              <ListItem
                selected={option.link === location.pathname}
                className={classes.menuItem}
              >
                {option.title}
              </ListItem>
            </Link>
          ))}
          <div style={{ flex: 1 }} />
          {isAuthed ? (
            <ListItem
              className={classes.menuItem}
              onClick={() => {
                logout()
                history.push("/")
              }}
            >
              Logout
            </ListItem>
          ) : (
            <>
              <Link to="/login">
                <ListItem className={classes.menuItem}>Login</ListItem>
              </Link>
              <Link to="/signup">
                <ListItem className={classes.menuItem}>Sign Up</ListItem>
              </Link>
            </>
          )}
        </List>
      </Drawer>
      <Link to="/" style={{ margin: "auto" }}>
        <Logo height={48} width={96} />
      </Link>
    </>
  )

  const desktopNavBar = (
    <>
      <Link to="/">
        <Logo height={48} width={96} />
      </Link>
      {navOptions.map((option) => (
        <Link
          to={option.link}
          style={{
            margin: "auto 8px",
            ...(option.link === location.pathname && {
              borderBottom: "2px solid #FF9100",
              paddingTop: 2,
            }),
          }}
        >
          <Typography sx={{ fontSize: "18px", margin: "0 8px" }}>
            {option.title}
          </Typography>
        </Link>
      ))}
      <div style={{ flex: 1 }} />
      {isAuthed ? (
        <Button
          variant="contained"
          sx={{
            marginRight: "8px",
            backgroundColor: theme.palette.button.navBarButton,
          }}
          onClick={() => {
            logout()
            history.push("/")
          }}
        >
          Logout
        </Button>
      ) : (
        <>
          <Link to="/login">
            <Button
              variant="contained"
              sx={{
                marginRight: "8px",
                backgroundColor: theme.palette.button.navBarButton,
              }}
            >
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              variant="contained"
              sx={{ backgroundColor: theme.palette.button.navBarButton }}
            >
              Signup
            </Button>
          </Link>
        </>
      )}
    </>
  )
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: theme.palette.primary.main }}
    >
      <Toolbar
        sx={{
          maxWidth: 1440,
          width: "100%",
          margin: "auto",
          boxSizing: "border-box",
          padding: "0 12px !important",
        }}
      >
        {onMobile ? mobileNavBar : desktopNavBar}
      </Toolbar>
    </AppBar>
  )
}
