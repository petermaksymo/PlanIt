import React, { useState, useContext } from "react"
import { useTheme } from "@mui/styles"
import {
  Button,
  IconButton,
  Grid,
  Typography,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import DeleteIcon from "@mui/icons-material/Delete"
import map from "lodash/map"

import { AuthContext } from "../contexts/auth"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const COURSE_COLORS = ["#F9EEFF", "#FFDFE8", "#DAD8FF", "#EDCDFF", "#FEC5C5"]

const SelectedProfile = ({ selectedProfile, reload }) => {
  const theme = useTheme()
  const { authedFetch } = useContext(AuthContext)
  const [addDialog, setAddDialog] = useState("")
  const [sessionName, setSessionName] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [searchResult, setSearchResult] = useState()
  const [ranCourseSearch, setRanCourseSearch] = useState(false)

  const closeAddDialog = () => {
    setAddDialog("")
    setSessionName("")
    setCourseCode("")
    setSearchResult()
  }

  const addToProfile = (e) => {
    e.preventDefault()

    const formdata = new FormData()
    formdata.append("profile", selectedProfile.title)
    formdata.append("session", sessionName)
    courseCode !== "" && formdata.append("course_code", searchResult.code)

    return authedFetch(`${API_BASE_URL}/profile`, {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        closeAddDialog()
        reload()
      })
      .catch((err) => console.log(err))
  }

  const handleDelete = (session = null, course = null) => {
    return authedFetch(
      `${API_BASE_URL}/profile?profile=${selectedProfile.title}&session=${
        course ? session + "&course_code=" + course : session
      }`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        reload()
      })
  }

  const handleCourseSearch = (e) => {
    e.preventDefault()
    setRanCourseSearch(true)
    return fetch(`${API_BASE_URL}/course/${courseCode.toUpperCase()}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResult(data)
        setRanCourseSearch(false)
      })
      .catch((err) => console.log(err))
  }

  return (
    <div id="selected-profile" style={{ padding: "30px 0" }}>
      <Dialog open={addDialog !== ""} onClose={closeAddDialog}>
        <form
          onSubmit={
            addDialog === "course" && !searchResult
              ? handleCourseSearch
              : addToProfile
          }
        >
          <DialogContent sx={{ minWidth: 320 }}>
            <Typography paragraph variant="h5">
              Add a new {addDialog}:
            </Typography>
            {addDialog === "session" ? (
              <TextField
                autoFocus
                required
                fullWidth
                label="Session Name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            ) : (
              <>
                <Typography paragraph>
                  Search for a course by exact course code for a match (e.g.
                  ECE444H1):
                </Typography>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  label="Course Code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  sx={{ marginBottom: 4 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCourseSearch} edge="end">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
            {searchResult ? (
              <>
                <Typography>
                  <strong>Found course</strong>
                  <br />
                  <strong>Course Name:</strong> {searchResult.name} <br />
                  <strong>Course Code:</strong> {searchResult.code}
                </Typography>
              </>
            ) : (
              ranCourseSearch && (
                <>
                  <Typography>
                    <strong>Error</strong>
                    <br />
                    Unable to find course
                  </Typography>
                </>
              )
            )}
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={closeAddDialog}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {addDialog === "course" && !searchResult ? "Search" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <div
        style={{
          maxWidth: 1440,
          margin: "auto",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        {selectedProfile ? (
          <>
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
              {map(selectedProfile.sessions, (session, session_idx) => {
                return (
                  <div id="session" style={{ margin: "15px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Typography
                        style={{
                          color: theme.palette.text.grey,
                          fontSize: 20,
                          margin: "auto 5px auto 0",
                        }}
                      >
                        {session.name}
                      </Typography>
                      <IconButton onClick={() => handleDelete(session.name)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                    <Grid container>
                      <Grid item>
                        {map(session.courses, (course) => {
                          return (
                            <Button
                              disableElevation
                              variant="contained"
                              style={{
                                backgroundColor: COURSE_COLORS[session_idx % 5],
                                margin: 10,
                                borderRadius: 10,
                                minWidth: "250px",
                                maxWidth: 250,
                                minHeight: "91px",
                                textTransform: "none",
                                border: "2px solid #B5B5B5",
                              }}
                              onClick={() =>
                                window.open(
                                  `/course/${course.code}`,
                                  "__newtab"
                                )
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  color: "#000",
                                }}
                              >
                                <IconButton
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 3,
                                    color: "#000",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.nativeEvent.stopImmediatePropagation()
                                    handleDelete(session.name, course.code)
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
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
                        <Button
                          disableElevation
                          variant="contained"
                          style={{
                            margin: 10,
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
              <Typography
                style={{ color: theme.palette.text.dark, fontSize: 20 }}
              >
                Add Session
              </Typography>
            </div>
          </>
        ) : (
          <Typography>
            Create a profile in order to start planning our your courses
          </Typography>
        )}
      </div>
    </div>
  )
}

export default SelectedProfile
