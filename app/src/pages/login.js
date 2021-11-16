import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { TextField, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { makeStyles, useTheme } from "@mui/styles"
import Logo from "../Components/logo"
import { AuthContext } from "../contexts/auth"

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.main,
    flex: 1,
    display: "flex",
  },
  semiContainer: {
    width: "100%",
    margin: "auto",
    display: "flex",
    flexFlow: "row wrap",
    flex: "0 1 auto",
    justifyContent: "center",
    alignItems: "center",
  },
  textField: {
    backgroundColor: "#FFFFFF",
    maxWidth: 400,
    width: "100%",
    borderRadius: "1rem",
  },
  buttonContainer: {
    maxWidth: 400,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  text: {
    color: theme.palette.text.main,
  },
  button: {
    borderColor: "#FFFFFF",
    color: theme.palette.text.main,
    borderWidth: "medium",
    borderRadius: "0.5rem",
  },
  rightSide: {
    maxWidth: 400,
    width: "100%",
    padding: "20px",
  },
}))

export const Login = () => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const { isAuthed, login } = useContext(AuthContext)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState()

  useEffect(() => {
    if (isAuthed) history.push("/profiles")
  }, [isAuthed, history])

  const handleSubmit = (e) => {
    e.preventDefault()

    return login(username, password)
      .then(() => history.push("/profiles"))
      .catch((err) => setError(err))
  }

  return (
    <div className={classes.container}>
      <div className={classes.semiContainer}>
        <Logo height="91" width="192" style={{ margin: "0 auto" }} />
        <div id="right-side" className={classes.rightSide}>
          <div id="title" style={{ marginBottom: "2rem" }}>
            <Typography variant="h3" className={classes.text}>
              Sign in
            </Typography>
          </div>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleSubmit}>
            <div id="username" style={{ marginBottom: "1rem" }}>
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
              <TextField
                required
                className={classes.textField}
                style={{ marginRight: "1rem" }}
                id="filled-basic"
                label="Password"
                type="password"
                variant="filled"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{ disableUnderline: true }}
              />
            </div>
            <div id="buttons" className={classes.buttonContainer}>
              <Link to="/signup">
                <Button variant="outlined" className={classes.button}>
                  Create Account
                </Button>
              </Link>
              <Button
                variant="outlined"
                className={classes.button}
                style={{ backgroundColor: theme.palette.button.brightRed }}
                type="submit"
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
