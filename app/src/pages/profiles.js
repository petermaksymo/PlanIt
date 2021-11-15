import React, { useState, useContext, useEffect } from "react"
import { NavBar } from "../Components/navbar"
import { useTheme } from "@mui/styles"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import remove from "lodash/remove"
import map from "lodash/map"

import { AuthContext } from "../contexts/auth"
import SelectedProfile from "../Components/selectedProfile"
import SavedCourses from "../Components/savedCourses"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const Profiles = () => {
  const theme = useTheme()
  const { authedFetch } = useContext(AuthContext)
  const [profiles, setProfiles] = useState()
  const [selectedProfileId, setSelectedProfileId] = useState(0)
  const selectedProfile = profiles && profiles[selectedProfileId]

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newProfileName, setNewProfileName] = useState("")
  const closeAddDialog = () => {
    setAddDialogOpen(false)
    setNewProfileName("")
  }

  const loadProfile = () => {
    const convertProfileData = (data) => {
      const profiles = map(
        remove(data, (d) => !d.session_name && !d.course_code),
        (p) => p.profile_name
      )
      return map(profiles, (profile) => {
        const sessions = map(
          remove(data, (d) => d.profile_name === profile && !d.course_code),
          (s) => s.session_name
        )

        return {
          title: profile,
          sessions: map(sessions, (session) => {
            const courses = map(
              remove(
                data,
                (d) => d.profile_name === profile && d.session_name === session
              ),
              (c) => ({ code: c.course_code, name: c.course.name })
            )

            return {
              name: session,
              courses,
            }
          }),
        }
      })
    }

    return authedFetch(`${API_BASE_URL}/profile`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        const fetched_profiles = convertProfileData(data)

        setProfiles(fetched_profiles)
      })
  }

  useEffect(loadProfile, [authedFetch])

  const createProfile = (e) => {
    e.preventDefault()

    const formdata = new FormData()
    formdata.append("profile", newProfileName)

    return authedFetch(`${API_BASE_URL}/profile`, {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        loadProfile()
        setSelectedProfileId(profiles.length)
        closeAddDialog()
      })
  }

  if (!profiles) return null

  return (
    <>
      <NavBar />
      <div className="pageContainer">
        <Dialog open={addDialogOpen} onClose={closeAddDialog}>
          <form onSubmit={createProfile}>
            <DialogContent sx={{ minWidth: 320 }}>
              <Typography paragraph variant="h5">
                Add a new profile:
              </Typography>
              <TextField
                required
                autoFocus
                fullWidth
                label="Profile Name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
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
            My Profiles
          </Typography>
          <Grid container>
            <Grid item style={{ marginLeft: "50px" }}>
              {map(profiles, (profile, idx) => {
                return (
                  <Button
                    variant="contained"
                    style={{
                      margin: "0 10px",
                      borderRadius: 10,
                      minWidth: "237px",
                      minHeight: "102px",
                      textTransform: "none",
                    }}
                    onClick={() => setSelectedProfileId(idx)}
                  >
                    <Typography style={{ margin: "30px 15px", fontSize: 20 }}>
                      {profile.title}
                    </Typography>
                    <IconButton
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "2px",
                        color: theme.palette.text.main,
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Button>
                )
              })}
            </Grid>
            <Button
              variant="contained"
              style={{
                margin: "0 15px",
                borderRadius: 10,
                minWidth: "200px",
                minHeight: "102px",
                backgroundColor: "#FAFAFA",
                textTransform: "none",
              }}
              onClick={() => setAddDialogOpen(true)}
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
                  sx={{ color: theme.palette.text.grey, fontSize: 18 }}
                >
                  Create New Profile
                </Typography>
              </div>
            </Button>
          </Grid>
        </div>
        <SelectedProfile
          selectedProfile={selectedProfile}
          reload={loadProfile}
        />
        <SavedCourses />
      </div>
    </>
  )
}
