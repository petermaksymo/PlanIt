import { useState, useContext, useEffect } from "react"
import { TextField, Typography, Checkbox, Button } from "@mui/material"
import { Link, useHistory } from "react-router-dom"
import { makeStyles, useTheme } from "@mui/styles"
import { AuthContext } from "../contexts/auth"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.main,
    flex: 1,
    display: "flex",
  },
  semiContainer: {
    maxWidth: 800,
    padding: 20,
    width: "100%",
    margin: "auto",
    [theme.breakpoints.down("md")]: {
      margin: "24px auto",
    },
  },
  textField: {
    backgroundColor: "#FFFFFF",
    maxWidth: 392,
    width: "100%",
    borderRadius: "1rem",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  showPassword: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: theme.palette.text.main,
  },
  button: {
    // cant put this class on the buttons for some reason
    borderColor: "#FFFFFF",
    color: theme.palette.text.main,
    borderWidth: "medium",
    borderRadius: "0.5rem",
  },
}))

export const Signup = () => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const { login, isAuthed } = useContext(AuthContext)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthed) history.push("/profiles")
  }, [isAuthed, history])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Error, your passwords do not match")
      return
    }

    const formdata = new FormData()
    formdata.append("username", username)
    formdata.append("password", password)
    formdata.append("email", email)

    return fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then(() => login(username, password))
      .then(() => history.push("/profiles"))
      .catch((err) => {
        setError("Error: your account could not be created at this time")
      })
  }

  // Minimum eight characters, at least one letter, one number, and one special character
  const passwordRegEx =
    "(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}"

  return (
    <div className={classes.container}>
      <div className={classes.semiContainer}>
        <div id="title" style={{ marginBottom: "3rem" }}>
          <Typography variant="h3" className={classes.text}>
            Create your PlanIt account
          </Typography>
        </div>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <Typography className={classes.text}>
            Enter a unique username:
          </Typography>
          <div id="username" style={{ marginBottom: "2rem" }}>
            <TextField
              required
              pattern
              className={classes.textField}
              id="filled-basic"
              label="Username"
              variant="filled"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{ disableUnderline: true }}
            />
          </div>
          <div id="password" style={{ marginBottom: "2rem" }}>
            <Typography className={classes.text}>
              Enter a password at least 8 characters long with at least 1 letter, number and special character
              or symbol:
            </Typography>
            <TextField
              required
              className={classes.textField}
              style={{ marginRight: "1rem" }}
              id="filled-basic"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{
                pattern: passwordRegEx,
                disableUnderline: true,
                title:
                  "Password must be minimum 8 characters with at least one letter, number, and special character",
              }}
              sx={{ marginBottom: 1 }}
            />
            <TextField
              required
              className={classes.textField}
              id="filled-basic"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              variant="filled"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputProps={{
                pattern: passwordRegEx,
                disableUnderline: true,
                title:
                  "Password must be minimum 8 characters with at least one letter, number, and special character",
              }}
            />
            <div id="show-password" className={classes.showPassword}>
              <Checkbox
                sx={{ color: "#FFFFFF", "&.Mui-checked": { color: "#FFFFFF" } }}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <Typography className={classes.text}>Show Password</Typography>
            </div>
          </div>
          <div id="email" style={{ marginBottom: "2rem" }}>
            <Typography className={classes.text}>Enter your email:</Typography>
            <TextField
              required
              className={classes.textField}
              id="filled-basic"
              label="Email"
              type="email"
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{ disableUnderline: true }}
            />
          </div>
          <div id="buttons" className={classes.buttonContainer}>
            <Link to="/login">
              <Button variant="outlined" className={classes.button}>
                Sign In
              </Button>
            </Link>
            <Button
              variant="outlined"
              className={classes.button}
              style={{ backgroundColor: theme.palette.button.brightRed }}
              type="submit"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
