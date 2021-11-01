import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/styles';
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useMediaQuery from "@mui/material/useMediaQuery";

import Logo from "./logo";


const NavBarOption = ({ title, link }) => (
  <Link to={link} style={{ margin: 'auto 14px'}}>
    <Typography sx={{ fontSize: '18px' }}>
      {title}
    </Typography>
  </Link>
)

export const NavBar = () => {
  const theme = useTheme()
  const onMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)

  const navOptions = [
    { title: 'My Profiles', link: '/profiles' },
    { title: 'Find Courses', link: '/' },
    { title: 'My Account', link: '/account' },
    { title: 'Help', link: '/help' },
  ]

  const mobileNavBar = (
    <>
      <IconButton
        id='nav-menu-toggle'
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={(e) => setMenuAnchorEl(e.currentTarget)}
      > 
        <MenuIcon />
      </IconButton>
      <Menu
        open={!!menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        anchorEl={menuAnchorEl}
      >
        {navOptions.map(option => (
          <Link to={option.link}>
            <MenuItem>{option.title}</MenuItem>
          </Link>
        ))}
        <Link to='/login'>
          <MenuItem>Login</MenuItem>
        </Link>
        <Link to='/signup'>
          <MenuItem>Sign Up</MenuItem>
        </Link>
      </Menu>
      <Link to='/' style={{ margin: 'auto' }}>
        <Logo height={48} width={96}/>
      </Link>
    </>
  )

  const desktopNavBar = (
    <>
      <Link to='/'>
        <Logo height={48} width={96}/>
      </Link>
      {navOptions.map(option => <NavBarOption title={option.title} link={option.link}/>)}
      <div style={{ flex: 1 }}/>
      <Link to='/login'>
        <Button variant='contained' color='secondary' sx={{ marginRight: '14px'}}>
          Login
        </Button>
      </Link>
      <Link to='/signup'>
        <Button variant='contained' color='secondary'>
          Signup
        </Button>
      </Link>
    </>
  )
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ maxWidth: 1440, width: '100%', margin: 'auto', boxSizing: 'border-box' }}>
        {onMobile ? mobileNavBar : desktopNavBar }
      </Toolbar>
    </AppBar>
  );
}