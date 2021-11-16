import React, { useState, useContext, useEffect } from "react"
import { useTheme } from "@mui/styles"
import { Button, Grid, Typography } from "@mui/material"
import map from "lodash/map"

import { AuthContext } from "../contexts/auth"
import BookmarkButton from "./bookmarkButton"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const COURSE_COLORS = ["#F9EEFF", "#FFDFE8", "#DAD8FF", "#EDCDFF", "#FEC5C5"]

const SavedCourses = () => {
  const theme = useTheme()
  const { authedFetch } = useContext(AuthContext)
  const [courses, setCourses] = useState()

  useEffect(() => {
    return authedFetch(`${API_BASE_URL}/bookmark`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(
          data.map((d) => ({ code: d.course_code, name: d.course.name }))
        )
      })
      .catch((err) => console.log(err))
  }, [authedFetch])

  return (
    <>
      <div
        id="saved-courses-title"
        style={{
          padding: "30px",
          backgroundColor: theme.palette.background.lightBlue,
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
          <Typography style={{ color: theme.palette.text.dark, fontSize: 28 }}>
            Saved Courses
          </Typography>
        </div>
      </div>
      <div id="saved-courses" style={{ padding: "30px 0" }}>
        <div
          style={{
            maxWidth: 1440,
            margin: "auto",
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <Grid id="course-grid" container>
            {courses ? (
              <Grid item>
                {map(courses, (course, idx) => {
                  const cards_per_row = Math.floor(
                    document.getElementById("course-grid").clientWidth / 270
                  )
                  const row_idx = Math.floor(idx / cards_per_row)
                  const color = COURSE_COLORS[row_idx % 5]

                  return (
                    <Button
                      disableElevation
                      variant="contained"
                      style={{
                        backgroundColor: color,
                        margin: "10px 10px",
                        borderRadius: 10,
                        minWidth: "250px",
                        maxWidth: 250,
                        minHeight: "91px",
                        textTransform: "none",
                        border: "2px solid #B5B5B5",
                      }}
                      onClick={() =>
                        window.open(`/course/${course.code}`, "__newtab")
                      }
                    >
                      <BookmarkButton
                        course_id={course.code}
                        style={{
                          position: "absolute",
                          top: 3,
                          right: 3,
                          zIndex: 1,
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          color: "#000",
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
            ) : (
              <Typography>Courses you bookmark will be visible here</Typography>
            )}
          </Grid>
        </div>
      </div>
    </>
  )
}

export default SavedCourses
