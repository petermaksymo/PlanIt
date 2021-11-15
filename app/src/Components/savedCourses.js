import React, { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "@mui/styles"
import { Button, Grid, Typography } from "@mui/material"
import map from "lodash/map"

import { AuthContext } from "../contexts/auth"
import BookmarkButton from "./bookmarkButton"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

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
          padding: "30px 286px",
          backgroundColor: theme.palette.background.lightBlue,
        }}
      >
        <Typography style={{ color: theme.palette.text.dark, fontSize: 28 }}>
          Saved Courses
        </Typography>
      </div>
      <div id="saved-courses" style={{ padding: "30px 286px" }}>
        {courses ? (
          <Grid container>
            <Grid item>
              {map(courses, (course) => {
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
                    <BookmarkButton
                      course_id={course.code}
                      style={{
                        position: "absolute",
                        top: 3,
                        right: 3,
                        zIndex: 1,
                      }}
                    />
                    <Link to={`/course/${course.code}`}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography style={{ fontSize: 14 }}>
                          {course.code}
                        </Typography>
                        <Typography style={{ fontSize: 14 }}>
                          {course.name}
                        </Typography>
                      </div>
                    </Link>
                  </Button>
                )
              })}
            </Grid>
          </Grid>
        ) : (
          <Typography>Courses you bookmark will be visible here</Typography>
        )}
      </div>
    </>
  )
}

export default SavedCourses
