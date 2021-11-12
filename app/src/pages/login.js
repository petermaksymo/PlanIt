import { TextField, Typography, Checkbox, Button} from '@mui/material';
import { makeStyles, useTheme} from '@mui/styles';
import {theme} from '../Theme';
import Logo from "../Components/logo"

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.main,
    flex: 1, 
    display: "flex",
  },
  semiContainer: {
    width: "100%",
    margin: "auto",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textField: {
    backgroundColor: '#FFFFFF', 
    width: '50%', 
    borderRadius: '1rem',
  },
  buttonContainer: {
    width: '50%', 
    display: 'flex', 
    justifyContent: 'space-between',
  },
  text: {
    color: theme.palette.text.main,
  },
  button: {
    borderColor: '#FFFFFF', 
    color: theme.palette.text.main, 
    borderWidth: 'medium', 
    borderRadius: '0.5rem',
  },
  rightSide: {
    maxWidth: 800, 
    width: "100%",
    marginLeft: '20px',
  }
}));

export const Login = () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.container}>
      <div className={classes.semiContainer}>
        <Logo height='91' width='192'/>
        <div id="right-side" className={classes.rightSide}>
          <div id="title" style={{marginBottom: '2rem'}}>
            <Typography variant="h3" className={classes.text}>
              Sign in
            </Typography>
          </div>
          <div id="username" style={{marginBottom: '1rem'}}>
            <TextField className={classes.textField} id="filled-basic" label="Username" variant="filled" />
          </div>
          <div id="password" style={{marginBottom: '2rem'}}>
            <TextField className={classes.textField} style={{ marginRight: '1rem' }} id="filled-basic" label="Password" variant="filled" />
          </div>
          <div id="buttons" className={classes.buttonContainer}>
            <Button variant="outlined" className={classes.button}>Create Account</Button>
            <Button variant="outlined" className={classes.button} style={{backgroundColor: theme.palette.button.brightRed}}>Sign in</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
