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
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import remove from "lodash/remove"
import map from "lodash/map"
import findIndex from "lodash/findIndex"

import { AuthContext } from "../contexts/auth"
import SelectedProfile from "../Components/selectedProfile"
import SavedCourses from "../Components/savedCourses"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const PROFILE_COLORS = ["#D55D92", "#AC46A1", "#822FAF", "#6411AD", "#3D0D69"]

export const Profiles = () => {
  const theme = useTheme()
  const { authedFetch } = useContext(AuthContext)
  const [profiles, setProfiles] = useState()
  const [selectedProfileId, setSelectedProfileId] = useState(0)
  const selectedProfile = profiles && profiles[selectedProfileId]

  const [dialogMode, setDialogMode] = useState(null)
  const dialogOpen = Boolean(dialogMode)
  const [newProfileName, setNewProfileName] = useState("")
  const closeDialog = () => {
    setDialogMode(null)
    setNewProfileName("")
  }

  const [profileAnchorEl, setProfileAnchorEl] = useState(null)
  const [selectedProfileMenu, setSelectedProfileMenu] = useState(null)
  const profileMenuOpen = Boolean(profileAnchorEl)

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
        closeDialog()
      })
  }

  const handlePatch = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("profile", newProfileName)

    return authedFetch(
      `${API_BASE_URL}/profile?profile=${selectedProfileMenu}`,
      {
        method: "PATCH",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        closeDialog()
        setProfileAnchorEl(null)
        return loadProfile()
      })
      .then(() =>
        setSelectedProfileId(
          findIndex(profiles, (p) => p.title === selectedProfileMenu)
        )
      )
  }

  const handleDelete = (session = null, course = null) => {
    return authedFetch(
      `${API_BASE_URL}/profile?profile=${selectedProfileMenu}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        closeDialog()
        setProfileAnchorEl(null)
        loadProfile()
      })
  }

  if (!profiles) return null

  return (
    <>
      <NavBar />
      <div className="pageContainer">
        <Dialog open={dialogOpen} onClose={closeDialog}>
          <form onSubmit={dialogMode === "add" ? createProfile : handlePatch}>
            <DialogContent sx={{ minWidth: 320 }}>
              <Typography paragraph variant="h5">
                {dialogMode === "add"
                  ? "Add a new profile:"
                  : `Rename ${selectedProfileMenu}:`}
              </Typography>
              <TextField
                required
                autoFocus
                fullWidth
                label={
                  dialogMode === "add" ? "Profile Name" : "New Profile Name"
                }
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={closeDialog}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {dialogMode === "add" ? "Add" : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
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
              My Profiles
            </Typography>
            <Grid container>
              <Grid item style={{ marginLeft: "50px" }}>
                {map(profiles, (profile, idx) => {
                  const isSelected = idx === selectedProfileId

                  return (
                    <Button
                      variant="contained"
                      disableElevation
                      style={{
                        border: isSelected
                          ? "5px solid #FF9E00"
                          : "5px solid transparent",
                        backgroundColor: PROFILE_COLORS[idx % 5],
                        margin: "10px",
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
                        id={`profile-button-${profile.title}`}
                        aria-controls="profile-menu"
                        aria-haspopup="true"
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "2px",
                          color: theme.palette.text.main,
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          e.nativeEvent.stopImmediatePropagation()
                          setProfileAnchorEl(e.currentTarget)
                          setSelectedProfileMenu(profile.title)
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Button>
                  )
                })}
                <Button
                  variant="contained"
                  style={{
                    margin: 10,
                    borderRadius: 10,
                    minWidth: "200px",
                    minHeight: "102px",
                    backgroundColor: "#FAFAFA",
                    textTransform: "none",
                  }}
                  onClick={() => setDialogMode("add")}
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
                <Menu
                  id="profile-menu"
                  anchorEl={profileAnchorEl}
                  open={profileMenuOpen}
                  onClose={() => setProfileAnchorEl(null)}
                >
                  <MenuItem onClick={() => setDialogMode("edit")}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleDelete()}>Delete</MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </div>
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
