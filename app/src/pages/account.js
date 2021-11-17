import React, { useEffect, useState, useContext } from "react"
import { Typography, Divider, Button } from "@mui/material"
import { NavBar } from "../Components/navbar"
import { makeStyles, useTheme } from "@mui/styles"
import TextField from "@mui/material/TextField"
import SaveIcon from "@mui/icons-material/Save"

import { AuthContext } from "../contexts/auth"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const useStyles = makeStyles((theme) => ({
  header: {
    color: theme.palette.text.grey,
    fontSize: 20,
    marginBottom: "15px",
    fontWeight: "bold",
  },
  text: {
    color: theme.palette.text.grey,
    fontSize: 18,
    marginBottom: "15px",
    marginLeft: "15px",
  },
  divider: {
    backgroundColor: theme.palette.background.lightBlue,
    height: "3px",
    margin: "41px 0",
  },
  align: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textField: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
    border: "2px solid #B5B5B5",
    marginRight: "10px",
  },
  saveButton: {
    borderRadius: "50%",
    padding: "10px 0px",
    textTransform: "none",
  },
}))

export const Account = () => {
  const theme = useTheme()
  const classes = useStyles()
  const { authedFetch } = useContext(AuthContext)
  const [user, setUser] = useState({})
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    return authedFetch(`${API_BASE_URL}/account`)
      .then((res) => res.json())
      .then((data) => setUser(data))
  }, [authedFetch])

  const patchAccount = (e, field) => {
    e.preventDefault()
    setError()
    setPasswordChanged(false)

    const formData = new FormData()
    if (field === "email" && email !== "") formData.append("email", email)
    else if (field === "password" && newPassword !== "")
      formData.append("new_password", newPassword)
    else return // nothing to patch

    return authedFetch(`${API_BASE_URL}/account`, {
      method: "PATCH",
      body: formData,
    }).then((res) =>
      res.json().then((data) => {
        if (res.status !== 200)
          return setError("An error has occurred, please try again")

        setUser(data)
        if (field === "email") setEmail("")
        else {
          setNewPassword("")
          setPasswordChanged(true)
        }
      })
    )
  }

  return (
    <>
      <NavBar />
      <div
        id="profiles"
        style={{
          padding: "30px 0",
          backgroundColor: theme.palette.background.lightPink,
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "auto",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <Typography
            style={{
              color: theme.palette.text.dark,
              fontSize: 28,
              marginBottom: "15px",
              fontWeight: "bold",
            }}
          >
            Account Settings
          </Typography>
        </div>
      </div>
      <div id="page-container" style={{ margin: "40px 0" }}>
        <div
          style={{
            maxWidth: 1440,
            margin: "auto",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <div id="email-section">
            <Typography className={classes.header}>Current Email</Typography>
            <Typography className={classes.text}>{user.email}</Typography>
            <Typography className={classes.header}>Change Email</Typography>
            <form
              className={classes.align}
              onSubmit={(e) => patchAccount(e, "email")}
            >
              <TextField
                className={classes.textField}
                id="filled-basic"
                label="New Email"
                variant="filled"
                value={email}
                type="email"
                InputProps={{ disableUnderline: true }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="contained"
                className={classes.saveButton}
                type="submit"
              >
                <SaveIcon
                  sx={{ fontSize: 40, color: theme.palette.background.primary }}
                />
              </Button>
            </form>
          </div>
          <Divider className={classes.divider} />
          <div id="password-section">
            <Typography className={classes.header}>Change Password</Typography>
            <Typography paragraph>
              Enter a new password (to be replaced with a password reset email
              in the future)
            </Typography>
            <form
              className={classes.align}
              onSubmit={(e) => patchAccount(e, "password")}
            >
              <TextField
                className={classes.textField}
                id="filled-basic"
                label="New Password"
                variant="filled"
                type="password"
                value={newPassword}
                InputProps={{ disableUnderline: true }}
                inputProps={{
                  pattern:
                    "(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}",
                  title:
                    "Password must be minimum 8 characters with at least one letter, number, and special character",
                }}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                variant="contained"
                className={classes.saveButton}
                type="submit"
              >
                <SaveIcon
                  sx={{ fontSize: 40, color: theme.palette.background.primary }}
                />
              </Button>
            </form>
            {passwordChanged && (
              <Typography sx={{ color: "success.main" }}>
                Password change successful!
              </Typography>
            )}
          </div>
          {error && <Typography color="error">{error}</Typography>}
        </div>
      </div>
    </>
  )
}
