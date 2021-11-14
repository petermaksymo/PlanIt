import React, { useState } from "react"
import { NavBar } from "../Components/navbar"
import { useTheme } from "@mui/styles"
import { Button, Grid, IconButton, Typography } from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import MoreVertIcon from "@mui/icons-material/MoreVert"

export const Profiles = () => {
  const theme = useTheme()
  const profileTemplate = [
    {
      title: "Main Profile",
      sessions: [
        {
          name: "Fall Session 2021",
          courses: [
            {
              code: "ECE297H1",
              name: "Communication and Design",
            },
            {
              code: "ECE297H1",
              name: "Communication and Design",
            },
            {
              code: "ECE297H1",
              name: "Communication and Design",
            },
            {
              code: "ECE297H1",
              name: "Communication and Design",
            },
          ],
        },
        {
          name: "Winter Session 2022",
          courses: [
            {
              code: "ECE345H1",
              name: "Algorithms & Data Structures",
            },
            {
              code: "ECE345H1",
              name: "Algorithms & Data Structures",
            },
            {
              code: "ECE345H1",
              name: "Algorithms & Data Structures",
            },
            {
              code: "ECE345H1",
              name: "Algorithms & Data Structures",
            },
          ],
        },
        {
          name: "Summer Session 2022",
          courses: [
            {
              code: "ECE444H1",
              name: "Software Engineering",
            },
          ],
        },
      ],
    },
    {
      title: "Test Profile",
    },
    {
      title: "Business Minor",
    },
    {
      title: "AI Minor",
    },
  ]

  const [profileJSON, setProfileJSON] = useState(profileTemplate[0])
  if (profileJSON === "") {
    setProfileJSON(profileTemplate[0])
  }

  return (
    <>
      <NavBar />
      <div className="pageContainer">
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
              {profileTemplate.map((profile) => {
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
        <div id="selected-profile" style={{ padding: "30px 286px" }}>
          <Typography
            style={{
              color: theme.palette.text.dark,
              fontSize: 28,
              marginBottom: "15px",
            }}
          >
            {profileJSON.title}
          </Typography>
          <div style={{ margin: "10px 10px" }}>
            {profileJSON.sessions.map((session) => {
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
                      {session.courses.map((course) => {
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
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
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
        </div>
        <div
          id="saved-courses-title"
          style={{
            padding: "30px 286px",
            backgroundColor: theme.palette.background.lightBlue,
          }}
        >
          <Typography style={{ color: theme.palette.text.dark, fontSize: 28 }}>
            Saved Courses
          </Typography>
        </div>
        <div id="saved-courses" style={{ padding: "30px 286px" }}>
          <Grid container>
            <Grid item>
              {profileTemplate[0].sessions[0].courses.map((course) => {
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
                    <div style={{ display: "flex", flexDirection: "column" }}>
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
          </Grid>
        </div>
      </div>
    </>
  )
}
