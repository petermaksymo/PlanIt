import React, {useState} from 'react';
import { makeStyles } from '@mui/styles';
import {AppBar, Toolbar, Typography, IconButton, Button} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Dialog } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const useStyles = makeStyles(theme => ({
    menuButton: {
    //   marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

export const NavBar = () => {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    console.log(open)
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Education Pathways
                </Typography>
                <Button color="inherit" onClick={handleOpen}>
                    Signup
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Create your account"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Put the Sign up form here
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Exit</Button>
                <Button onClick={handleClose} autoFocus>
                    Confirm
                </Button>
                </DialogActions>
                </Dialog>
            </Toolbar>
        </AppBar>
    );
}