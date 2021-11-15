import React, { useState } from "react"
import { Typography, Divider, Button } from "@mui/material"
import { NavBar } from "../Components/navbar"
import { makeStyles, useTheme } from "@mui/styles"
import TextField from "@mui/material/TextField"
import SaveIcon from "@mui/icons-material/Save"

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
  cornerBorder: {
    borderRadius: "14px",
    border: "4px solid",
    borderColor: theme.palette.background.lightBlue,
    padding: "81px 137px",
  },
  textField: {
    backgroundColor: "#FFFFFF",
    width: "25%",
    borderRadius: 10,
    border: "2px solid #B5B5B5",
    marginRight: "10px",
  },
}))

export const Account = () => {
  const theme = useTheme()
  const classes = useStyles()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const user = {
    username: "Test",
    email: "test@gmail.com",
  }

  return (
    <>
      <NavBar />
      <div
        id="profiles"
        style={{
          padding: "30px 286px",
          backgroundColor: theme.palette.background.lightPink,
        }}
      >
        <Typography
          style={{
            color: theme.palette.text.dark,
            fontSize: 28,
            marginBottom: "15px",
          }}
        >
          Account Settings
        </Typography>
      </div>
      <div id="page-container" style={{ margin: "62px 172px" }}>
        <div id="course-container" className={classes.cornerBorder}>
          <div id="username-section">
            <Typography className={classes.header}>Current Username</Typography>
            <Typography className={classes.text}>{user.username}</Typography>
            <Typography className={classes.header}>Change Username</Typography>
            <div className={classes.align}>
              <TextField
                required
                pattern
                className={classes.textField}
                id="filled-basic"
                label="New Username"
                variant="filled"
                value={username}
                InputProps={{ disableUnderline: true }}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button variant="contained">
                <SaveIcon
                  sx={{ fontSize: 40, color: theme.palette.background.primary }}
                />
              </Button>
            </div>
          </div>
          <Divider className={classes.divider} />
          <div id="email-section">
            <Typography className={classes.header}>Current Email</Typography>
            <Typography className={classes.text}>{user.email}</Typography>
            <Typography className={classes.header}>Change Email</Typography>
            <div className={classes.align}>
              <TextField
                required
                pattern
                className={classes.textField}
                id="filled-basic"
                label="New Email"
                variant="filled"
                value={email}
                InputProps={{ disableUnderline: true }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="contained">
                <SaveIcon
                  sx={{ fontSize: 40, color: theme.palette.background.primary }}
                />
              </Button>
            </div>
          </div>
          <Divider className={classes.divider} />
          <div id="password-section">
            <Typography className={classes.header}>Change Email</Typography>
            <div className={classes.align}>
              <TextField
                required
                pattern
                className={classes.textField}
                id="filled-basic"
                label="New Password"
                variant="filled"
                value={newPassword}
                InputProps={{ disableUnderline: true }}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                required
                pattern
                className={classes.textField}
                id="filled-basic"
                label="Current Password"
                variant="filled"
                value={password}
                InputProps={{ disableUnderline: true }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="contained">
                <SaveIcon
                  sx={{ fontSize: 40, color: theme.palette.background.primary }}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
