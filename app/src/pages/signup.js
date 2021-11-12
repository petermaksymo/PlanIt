import { TextField, Typography, Checkbox, Button} from '@mui/material';
import { makeStyles, useTheme} from '@mui/styles';
import {theme} from '../Theme';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.main,
    flex: 1, 
    display: "flex",
  },
  semiContainer: {
    maxWidth: 800, 
    width: "100%",
    margin: "auto",
  },
  textField: {
    backgroundColor: '#FFFFFF', 
    width: '49%', 
    borderRadius: '1rem',
  },
  buttonContainer: {
    width: '100%', 
    display: 'flex', 
    justifyContent: 'space-between',
  },
  showPassword: {
    display: "flex", 
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: theme.palette.text.main,
  },
  button: { // cant put this class on the buttons for some reason
    borderColor: '#FFFFFF', 
    color: theme.palette.text.main, 
    borderWidth: 'medium', 
    borderRadius: '0.5rem',
  },
}));

export const Signup = () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.container}>
      <div className={classes.semiContainer}>
        <div id="title" style={{marginBottom: '4rem'}}>
          <Typography variant="h3" className={classes.text}>
            Create your PlanIt account
          </Typography>
        </div>
        <div id="username" style={{marginBottom: '2rem'}}>
          <TextField className={classes.textField} id="filled-basic" label="Username" variant="filled" />
        </div>
        <div id="password" style={{marginBottom: '4rem'}}>
          <Typography className={classes.text}>
            Password needs to be at least X characters long with at least 1 number, or symbol
          </Typography>
          <TextField className={classes.textField} style={{ marginRight: '1rem' }} id="filled-basic" label="Password" variant="filled" />
          <TextField className={classes.textField} id="filled-basic" label="Confirm Password" variant="filled" />
          <div id="show-password" className={classes.showPassword}>
            <Checkbox sx={{color: '#FFFFFF', '&.Mui-checked': {color: '#FFFFFF',}, }}/> 
            <Typography className={classes.text}>Show Password</Typography>
          </div>
        </div>
        <div id="email" style={{marginBottom: '6rem'}}>
          <Typography className={classes.text}>What’s your email address?</Typography>
          <TextField className={classes.textField} id="filled-basic" label="Email" variant="filled" />
        </div>
        <div id="buttons" className={classes.buttonContainer}>
          <Button variant="outlined" className={classes.button}>Sign In</Button>
          <Button variant="outlined" className={classes.button} style={{backgroundColor: theme.palette.button.brightRed}}>Create Account</Button>
        </div>
        

      </div>
    </div>
  )
}
