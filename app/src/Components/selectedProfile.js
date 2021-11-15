import React, { useState, useContext } from "react"
import { useTheme } from "@mui/styles"
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import map from "lodash/map"

import { AuthContext } from "../contexts/auth"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const SelectedProfile = ({ selectedProfile, reload }) => {
  const theme = useTheme()
  const { authedFetch } = useContext(AuthContext)
  const [addDialog, setAddDialog] = useState("")
  const [sessionName, setSessionName] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [courseName, setCourseName] = useState("")

  const closeAddDialog = () => {
    setAddDialog("")
    setSessionName("")
    setCourseCode("")
    setCourseName("")
  }

  const addToProfile = (e) => {
    e.preventDefault()

    const formdata = new FormData()
    formdata.append("profile", selectedProfile.title)
    formdata.append("session", sessionName)
    courseCode !== "" && formdata.append("course_code", courseCode)
    courseName !== "" && formdata.append("course_name", courseName)

    return authedFetch(`${API_BASE_URL}/profile`, {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        closeAddDialog()
        reload()
      })
  }

  if (!selectedProfile)
    return (
      <Typography>
        Create a profile in order to start planning our your courses
      </Typography>
    )

  return (
    <div id="selected-profile" style={{ padding: "30px 286px" }}>
      <Dialog open={addDialog !== ""} onClose={closeAddDialog}>
        <form onSubmit={addToProfile}>
          <DialogContent sx={{ minWidth: 320 }}>
            <Typography paragraph variant="h5">
              Add a new {addDialog}:
            </Typography>
            {addDialog === "session" ? (
              <TextField
                required
                fullWidth
                label="Session Name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            ) : (
              <>
                <TextField
                  required
                  fullWidth
                  label="Course Code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  sx={{ marginBottom: 4 }}
                />
                <TextField
                  required
                  fullWidth
                  label="Course Name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={closeAddDialog}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Typography
        style={{
          color: theme.palette.text.dark,
          fontSize: 28,
          marginBottom: "15px",
        }}
      >
        {selectedProfile.title}
      </Typography>
      <div style={{ margin: "10px 10px" }}>
        {map(selectedProfile.sessions, (session) => {
          return (
            <div id="session" style={{ marginBottom: "15px" }}>
              <Typography
                style={{
                  color: theme.palette.text.grey,
                  fontSize: 20,
                  marginBottom: "15px",
                }}
              >
                {session.name}
              </Typography>
              <Grid container>
                <Grid item>
                  {map(session.courses, (course) => {
                    return (
                      <Button
                        variant="contained"
                        style={{
                          margin: "0 5px",
                          borderRadius: 10,
                          minWidth: "250px",
                          minHeight: "91px",
                          textTransform: "none",
                          border: "2px solid #B5B5B5",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography style={{ fontSize: 14 }}>
                            {course.code}
                          </Typography>
                          <Typography style={{ fontSize: 14 }}>
                            {course.name}
                          </Typography>
                        </div>
                      </Button>
                    )
                  })}
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    style={{
                      margin: "0 5px",
                      borderRadius: 10,
                      minWidth: "250px",
                      minHeight: "91px",
                      textTransform: "none",
                      border: "2px solid #B5B5B5",
                      backgroundColor: "#FAFAFA",
                    }}
                    onClick={() => {
                      setSessionName(session.name)
                      setAddDialog("course")
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <AddCircleIcon
                        sx={{
                          top: "50%",
                          color: theme.palette.background.main,
                          fontSize: 40,
                        }}
                      />
                      <Typography
                        sx={{
                          color: theme.palette.text.grey,
                          fontSize: 16,
                        }}
                      >
                        Add Course
                      </Typography>
                    </div>
                  </Button>
                </Grid>
              </Grid>
            </div>
          )
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
          cursor: "pointer",
        }}
        onClick={() => setAddDialog("session")}
      >
        <AddCircleIcon
          sx={{
            top: "50%",
            color: theme.palette.background.main,
            fontSize: 40,
          }}
        />
        <Typography style={{ color: theme.palette.text.dark, fontSize: 20 }}>
          Add Session
        </Typography>
      </div>
    </div>
  )
}

export default SelectedProfile
